import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userEmail, phone, totalAmount, items, hasMembership } = body

    if (!items) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress || userEmail

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        phone: phone || undefined,
        credits: hasMembership ? { increment: 30 } : undefined,
        tier: hasMembership ? 'BLACK' : undefined,
        clerkId: clerkUser?.id || undefined
      },
      create: {
        email,
        phone,
        clerkId: clerkUser?.id || 'guest_' + Date.now(),
        name: clerkUser?.fullName || 'Guest Member',
        credits: hasMembership ? 30 : 0,
        tier: hasMembership ? 'BLACK' : 'NONE'
      }
    })

    const order = await prisma.order.create({
      data: { userEmail: email, totalAmount, items, status: 'COMPLETED' }
    })

    return NextResponse.json({ success: true, order, user })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 })
  }
}
