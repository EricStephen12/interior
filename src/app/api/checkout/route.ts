import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userEmail, totalAmount, items, hasMembership } = body

    if (!userEmail || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert a demo user if they don't exist (to ensure it works smoothly without auth)
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        credits: hasMembership ? { increment: 30 } : undefined,
        tier: hasMembership ? 'BLACK' : undefined
      },
      create: {
        email: userEmail,
        clerkId: 'demo_clerk_' + Date.now(),
        name: 'Demo Member',
        credits: hasMembership ? 30 : 0,
        tier: hasMembership ? 'BLACK' : 'NONE'
      }
    })

    const order = await prisma.order.create({
      data: {
        userEmail,
        totalAmount,
        items,
        status: 'COMPLETED'
      }
    })

    return NextResponse.json({ success: true, order, user })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 })
  }
}
