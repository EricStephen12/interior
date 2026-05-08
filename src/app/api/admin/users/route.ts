import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function PATCH(req: Request) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify requesting user is an ADMIN
    const adminUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Prevent demoting yourself (to avoid lockouts)
    if (userId === adminUser.id && role !== 'ADMIN') {
      return NextResponse.json({ error: 'You cannot demote yourself.' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
