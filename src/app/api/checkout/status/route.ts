import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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

    const secretKey = process.env.KINGSPAY_SECRET_KEY
    if (!secretKey) {
      console.error('KINGSPAY_SECRET_KEY is not defined in environment variables')
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
  }).catch((err) => {
    console.error('Fulfillment transaction failed:', err)
  })
}
