import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'

export async function GET(req: Request) {
  const reqUrl = new URL(req.url)
  const proto = req.headers.get('x-forwarded-proto') || reqUrl.protocol.replace(':', '')
  const host = req.headers.get('x-forwarded-host') || reqUrl.host
  const origin = `${proto}://${host}`

  // Retrieve payment ID using merchantOrderId or fallbacks
  const merchantOrderId = reqUrl.searchParams.get('merchantOrderId') || reqUrl.searchParams.get('orderId')
  let paymentId = reqUrl.searchParams.get('id') || 
                    reqUrl.searchParams.get('payment_id') || 
                    reqUrl.searchParams.get('paymentId') || 
                    reqUrl.searchParams.get('reference')

  let dbOrderId = merchantOrderId

  if (merchantOrderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: merchantOrderId }
      })
      if (order && (order as any).kingspayId) {
        paymentId = (order as any).kingspayId
      }
    } catch (err) {
      console.error('Error fetching order by merchantOrderId:', err)
    }
  } else if (paymentId) {
    // If we only have paymentId, find the order by kingspayId column
    try {
      const order = await prisma.order.findFirst({
        where: { kingspayId: paymentId } as any
      })
      if (order) {
        dbOrderId = order.id
      }
    } catch (err) {
      console.error('Error fetching order by kingspayId:', err)
    }
  }

  if (!paymentId) {
    console.error('Callback received without a valid payment ID')
    return NextResponse.redirect(`${origin}/checkout?error=missing_payment_id`)
  }

  const secretKey = process.env.KINGSPAY_SECRET_KEY
  if (!secretKey) {
    console.error('KINGSPAY_SECRET_KEY is not defined in environment variables')
    return NextResponse.redirect(`${origin}/checkout?error=config_error`)
  }

  try {
    console.log(`Checking KingsPay payment status for ID: ${paymentId}`)
    const response = await fetch(`https://api.kingspay-gs.com/api/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    })

    if (!response.ok) {
      console.error(`Failed to verify payment with KingsPay status endpoint: ${response.statusText}`)
      return NextResponse.redirect(`${origin}/checkout?error=verification_failed`)
    }

    const resData = await response.json()
    console.log(`KingsPay status response for ${paymentId}:`, JSON.stringify(resData, null, 2))

    // Handle nested status check (can be directly in root or inside data object)
    const payment = resData.data || resData
    const status = payment.status

    if (status === 'SUCCESS') {
      const email = payment.email || payment.metadata?.userEmail
      const metadata = payment.metadata || {}

      if (!email) {
        console.error('No email found in KingsPay payment response', payment)
        return NextResponse.redirect(`${origin}/checkout?error=no_email_in_payment`)
      }

      // Perform order completion and credit update using our database order ID
      await fulfillPayment(dbOrderId || paymentId, metadata, email)

      return NextResponse.redirect(`${origin}/dashboard?payment=success`)
    } else if (status && ['FAILED', 'CANCELLED', 'EXPIRED'].includes(status.toUpperCase())) {
      console.log(`Payment check returned status: ${status}, marking order as FAILED in DB`)
      try {
        await prisma.order.update({
          where: { id: dbOrderId || paymentId },
          data: { status: 'FAILED' }
        })
      } catch (err) {
        console.error('Failed to update DB for failed order:', err)
      }
      return NextResponse.redirect(`${origin}/checkout?error=payment_${status.toLowerCase()}`)
    } else {
      console.log(`Payment check returned status: ${status}`)
      return NextResponse.redirect(`${origin}/checkout?error=payment_${status ? status.toLowerCase() : 'failed'}`)
    }
  } catch (error) {
    console.error('Callback handler error:', error)
    return NextResponse.redirect(`${origin}/checkout?error=callback_error`)
  }
}

async function fulfillPayment(orderId: string, metadata: any, userEmail: string) {
  // Use a transaction or findFirst to prevent double crediting
  await prisma.$transaction(async (tx) => {
    // Try lookup by primary key ID or kingspayId
    let order = await tx.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      order = await tx.order.findFirst({
        where: { kingspayId: orderId } as any
      })
    }

    if (!order) {
      console.error(`Order with ID ${orderId} not found in database.`)
      throw new Error(`Order ${orderId} not found`)
    }

    const dbOrderId = order.id

    if (order.status === 'COMPLETED' || order.status === 'PAID') {
      console.log(`Order ${dbOrderId} is already ${order.status}. Skipping fulfillment.`)
      return
    }

    const creditAmount = metadata?.creditAmount ? parseInt(metadata.creditAmount.toString()) : 0
    const hasMembership = !!metadata?.hasMembership
    const phone = metadata?.phone || ''
    const name = metadata?.name || 'Member'
    const clerkId = metadata?.clerkId

    console.log(`Fulfilling payment for ${userEmail}: order=${dbOrderId}, credits=${creditAmount}, membership=${hasMembership}`)

    // Update or create user
    await tx.user.upsert({
      where: { email: userEmail },
      update: {
        phone: phone || undefined,
        credits: creditAmount ? { increment: creditAmount } : (hasMembership ? { increment: 30 } : undefined),
        tier: (hasMembership || creditAmount) ? 'BLACK' : undefined,
        clerkId: clerkId || undefined
      },
      create: {
        email: userEmail,
        phone,
        clerkId: clerkId || 'guest_' + Date.now(),
        name: name,
        credits: creditAmount || (hasMembership ? 30 : 0),
        tier: (hasMembership || creditAmount) ? 'BLACK' : 'NONE'
      }
    })

    // Update order status
    const finalStatus = 'PAID'
    await tx.order.update({
      where: { id: dbOrderId },
      data: { status: finalStatus }
    })

    // Parse order items for notification
    let parsedItems: any[] = []
    if (Array.isArray(order.items)) {
      parsedItems = order.items
    } else if (typeof order.items === 'string') {
      try {
        const parsed = JSON.parse(order.items)
        parsedItems = Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        parsedItems = [{ name: 'Gym Apparel / Access Pass', quantity: 1, price: order.totalAmount }]
      }
    }

    const shipping = order.shippingDetails as any

    // 1. Send Order Confirmation Email to Customer via Resend
    emailService.sendOrderConfirmationEmail({
      orderId: dbOrderId,
      userEmail,
      userName: name,
      items: parsedItems,
      totalAmount: order.totalAmount,
      shippingAddress: shipping?.address,
      paymentMethod: 'KingsPay Online',
    }).catch((err) => console.error('[Email Error] Order confirmation:', err))

    // 2. Alert Admin
    emailService.sendAdminNewOrderAlert({
      orderId: dbOrderId,
      userEmail,
      userName: name,
      totalAmount: order.totalAmount,
      paymentType: 'KINGSPAY',
      items: parsedItems,
      shippingDetails: shipping,
      status: 'PAID',
    }).catch((err) => console.error('[Email Error] Admin alert:', err))

    // 3. Trigger Resend Automation Events
    emailService.triggerResendEvent({
      name: 'order.paid',
      email: userEmail,
      data: {
        orderId: dbOrderId,
        totalAmount: order.totalAmount,
        paymentMethod: 'KINGSPAY',
      },
    }).catch(() => {})

    if (hasMembership || creditAmount > 0) {
      emailService.triggerResendEvent({
        name: 'member.pass_purchased',
        email: userEmail,
        data: {
          orderId: dbOrderId,
          credits: creditAmount || 30,
          tier: 'BLACK',
        },
      }).catch(() => {})
    }
  }).catch((err) => {
    console.error('Fulfillment transaction failed:', err)
  })
}
