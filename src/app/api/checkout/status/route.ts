import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'

export async function GET(req: Request) {
  try {
    const reqUrl = new URL(req.url)
    const orderId = reqUrl.searchParams.get('orderId') || reqUrl.searchParams.get('merchantOrderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId parameter' }, { status: 400 })
    }

    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({ success: true, status: 'COMPLETED' })
    }

    if (order.status === 'FAILED') {
      return NextResponse.json({ success: true, status: 'FAILED', message: 'Payment failed' })
    }

    // If order is still PENDING, fetch the latest status directly from KingsPay G&S
    const paymentId = (order as any).kingspayId
    if (!paymentId) {
      return NextResponse.json({ success: true, status: 'PENDING', message: 'No payment provider ID' })
    }

    // Retrieve KingsPay secret key from database settings or environment
    const secretKeyRow = await prisma.storeSetting.findUnique({
      where: { key: 'payment_kingspay_secret_key' }
    })
    const secretKey = secretKeyRow?.value || process.env.KINGSPAY_SECRET_KEY
    if (!secretKey) {
      console.error('KINGSPAY_SECRET_KEY is not defined in settings or environment')
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    console.log(`Polling direct status check with KingsPay for ID: ${paymentId}`)
    const response = await fetch(`https://api.kingspay-gs.com/api/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    })

    if (!response.ok) {
      console.error(`KingsPay status fetch failed: ${response.statusText}`)
      return NextResponse.json({ success: true, status: 'PENDING', message: 'Could not query provider status' })
    }

    const resData = await response.json()
    console.log(`KingsPay direct status response:`, JSON.stringify(resData, null, 2))

    const payment = resData.data || resData
    const status = payment.status
    const statusUpper = status ? status.toString().toUpperCase() : ''

    if (statusUpper === 'SUCCESS') {
      const email = payment.email || payment.metadata?.userEmail
      const metadata = payment.metadata || {}

      if (!email) {
        console.error('No email found in KingsPay payment response', payment)
        return NextResponse.json({ error: 'Email missing from payment details' }, { status: 400 })
      }

      // Perform order completion and credit update
      await fulfillPayment(orderId, metadata, email)

      return NextResponse.json({ success: true, status: 'COMPLETED' })
    }

    if (statusUpper === 'FAILED' || statusUpper === 'CANCELLED' || statusUpper === 'EXPIRED') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' }
      })
      return NextResponse.json({ success: true, status: 'FAILED', message: 'Payment was cancelled or failed.' })
    }

    return NextResponse.json({ success: true, status: 'PENDING' })
  } catch (error) {
    console.error('Status check endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function fulfillPayment(orderId: string, metadata: any, userEmail: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      console.error(`Order with ID ${orderId} not found in database.`)
      throw new Error(`Order ${orderId} not found`)
    }

    if (order.status === 'COMPLETED') {
      console.log(`Order ${orderId} is already COMPLETED. Skipping status check fulfillment.`)
      return
    }

    const creditAmount = metadata?.creditAmount ? parseInt(metadata.creditAmount.toString()) : 0
    const hasMembership = !!metadata?.hasMembership
    const phone = metadata?.phone || ''
    const name = metadata?.name || 'Member'
    const clerkId = metadata?.clerkId

    console.log(`Status check fulfilling payment for ${userEmail}: order=${orderId}, credits=${creditAmount}, membership=${hasMembership}`)

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
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    })

    // Parse order items for inventory decrement and email notification
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

    // Decrement physical product stock with atomic non-negative floor
    for (const item of parsedItems) {
      const pId = item.productId || item.id
      const qty = item.quantity || 1
      if (pId) {
        try {
          // Atomic update: only decrement if stock >= requested quantity
          const updateResult = await tx.product.updateMany({
            where: { id: pId, stock: { gte: qty } },
            data: { stock: { decrement: qty } }
          })

          if (updateResult.count > 0) {
            const product = await tx.product.findUnique({
              where: { id: pId },
              select: { id: true, name: true, stock: true }
            })
            if (product && product.stock <= 3) {
              emailService.sendLowStockAlert({
                productName: product.name,
                remainingStock: product.stock,
                productId: product.id,
              }).catch(() => {})
            }
          } else {
            // Simultaneous payment collision intercepted: stock kept at 0
            console.warn(`[Stock Collision Guard] Order ${order.id}: Item ${item.name} (${pId}) had insufficient inventory to decrement. Oversell prevented.`)
            emailService.sendInventoryCollisionAlert({
              orderId: order.id,
              productName: item.name,
              customerName: name,
              customerEmail: userEmail,
            }).catch(() => {})
          }
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${pId}:`, stockErr)
        }
      }
    }

    const shipping = order.shippingDetails as any

    // 1. Send Order Confirmation Email to Customer via Resend
    emailService.sendOrderConfirmationEmail({
      orderId: order.id,
      userEmail,
      userName: name,
      items: parsedItems,
      totalAmount: order.totalAmount,
      shippingAddress: shipping?.address,
      paymentMethod: 'KingsPay Online',
    }).catch((err) => console.error('[Email Error] Order confirmation:', err))

    // 2. Alert Admin
    emailService.sendAdminNewOrderAlert({
      orderId: order.id,
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
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentMethod: 'KingsPay Online',
        hasMembership,
        creditAmount,
      }
    }).catch(() => {})
  }).catch((err) => {
    console.error('Fulfillment transaction failed:', err)
  })
}
