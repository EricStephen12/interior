import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const reqUrl = new URL(req.url)
  const proto = req.headers.get('x-forwarded-proto') || reqUrl.protocol.replace(':', '')
  const host = req.headers.get('x-forwarded-host') || reqUrl.host
  const origin = `${proto}://${host}`

  // Retrieve payment ID from query parameters
  const paymentId = reqUrl.searchParams.get('id') || 
                    reqUrl.searchParams.get('payment_id') || 
                    reqUrl.searchParams.get('paymentId') || 
                    reqUrl.searchParams.get('reference')

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

      // Perform order completion and credit update
      await fulfillPayment(paymentId, metadata, email)

      return NextResponse.redirect(`${origin}/dashboard?payment=success`)
    } else {
      console.log(`Payment check returned status: ${status}`)
      return NextResponse.redirect(`${origin}/checkout?error=payment_${status ? status.toLowerCase() : 'failed'}`)
    }
  } catch (error) {
    console.error('Callback handler error:', error)
    return NextResponse.redirect(`${origin}/checkout?error=callback_error`)
  }
}

async function fulfillPayment(paymentId: string, metadata: any, userEmail: string) {
  // Use a transaction or findFirst to prevent double crediting
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: paymentId }
    })

    if (!order) {
      console.error(`Order with ID ${paymentId} not found in database.`)
      throw new Error(`Order ${paymentId} not found`)
    }

    if (order.status === 'COMPLETED') {
      console.log(`Order ${paymentId} is already COMPLETED. Skipping fulfillment.`)
      return
    }

    const creditAmount = metadata?.creditAmount ? parseInt(metadata.creditAmount.toString()) : 0
    const hasMembership = !!metadata?.hasMembership
    const phone = metadata?.phone || ''
    const name = metadata?.name || 'Member'
    const clerkId = metadata?.clerkId

    console.log(`Fulfilling payment for ${userEmail}: order=${paymentId}, credits=${creditAmount}, membership=${hasMembership}`)

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
      where: { id: paymentId },
      data: { status: 'COMPLETED' }
    })
  }).catch((err) => {
    console.error('Fulfillment transaction failed:', err)
  })
}
