import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')
    const secret = process.env.PAYSTACK_SECRET_KEY

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is not defined')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle successful charge
    if (event.event === 'charge.success') {
      const { customer, amount, metadata, reference } = event.data
      const email = customer.email

      // metadata is where we pass creditAmount or hasMembership from the frontend
      const creditAmount = metadata?.creditAmount
      const hasMembership = metadata?.hasMembership

      console.log(`Processing webhook for ${email}: ${amount} NGN, Credits: ${creditAmount}`)

      // Update user credits
      await prisma.user.upsert({
        where: { email },
        update: {
          credits: creditAmount ? { increment: creditAmount } : (hasMembership ? { increment: 30 } : undefined),
          tier: (hasMembership || creditAmount) ? 'BLACK' : undefined,
        },
        create: {
          email,
          clerkId: 'guest_' + Date.now(),
          name: customer.first_name || 'Member',
          credits: creditAmount || (hasMembership ? 30 : 0),
          tier: (hasMembership || creditAmount) ? 'BLACK' : 'NONE'
        }
      })

      // Record order if not already recorded
      await prisma.order.upsert({
        where: { id: reference }, // We use Paystack reference as ID to avoid duplicates
        update: { status: 'COMPLETED' },
        create: {
          id: reference,
          userEmail: email,
          totalAmount: amount / 100, // Paystack sends amount in kobo
          items: metadata?.items || [],
          status: 'COMPLETED'
        }
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
