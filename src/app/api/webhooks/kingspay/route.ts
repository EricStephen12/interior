import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-kingspay-signature')
    const secret = process.env.KINGSPAY_SECRET_KEY

    if (!secret) {
      console.error('KINGSPAY_SECRET_KEY is not defined')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    if (!signature) {
      console.error('Webhook request missing x-kingspay-signature header')
      return NextResponse.json({ error: 'Missing signature header' }, { status: 401 })
    }

    // Verify signature using HMAC SHA256
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      console.error('Webhook signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body)
    console.log('KingsPay webhook received:', JSON.stringify(payload, null, 2))

    // Handle payment succeeded event
    if (payload.event === 'payment.succeeded') {
      const payment = payload.data
      if (!payment) {
        console.error('payment.succeeded event missing data block:', payload)
        return NextResponse.json({ error: 'Malformed webhook payload' }, { status: 400 })
      }

      const paymentId = payment.id
      const email = payment.email || payment.metadata?.userEmail
      const metadata = payment.metadata || {}

      if (!paymentId || !email) {
        console.error('Webhook data missing payment ID or user email:', payment)
        return NextResponse.json({ error: 'Missing required payload data' }, { status: 400 })
      }

      console.log(`Processing webhook for payment ${paymentId} (${email})`)
      await fulfillPayment(paymentId, metadata, email)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function fulfillPayment(paymentId: string, metadata: any, userEmail: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: paymentId }
    })

    if (!order) {
      console.error(`Order with ID ${paymentId} not found in database.`)
      throw new Error(`Order ${paymentId} not found`)
    }

    if (order.status === 'COMPLETED') {
      console.log(`Order ${paymentId} is already COMPLETED. Skipping webhook fulfillment.`)
      return
    }

    const creditAmount = metadata?.creditAmount ? parseInt(metadata.creditAmount.toString()) : 0
    const hasMembership = !!metadata?.hasMembership
    const phone = metadata?.phone || ''
    const name = metadata?.name || 'Member'
    const clerkId = metadata?.clerkId

    console.log(`Webhook fulfilling payment for ${userEmail}: order=${paymentId}, credits=${creditAmount}, membership=${hasMembership}`)

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
