import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function PATCH(req: Request) {
  try {
    const { userId: adminClerkId } = await auth()
    if (!adminClerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify requesting user is an ADMIN
    const adminUser = await prisma.user.findUnique({
      where: { clerkId: adminClerkId }
    })

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, role, creditsToAdd } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    if (role) {
      // Prevent demoting yourself (to avoid lockouts)
      if (userId === adminUser.id && role !== 'ADMIN') {
        return NextResponse.json({ error: 'You cannot demote yourself.' }, { status: 400 })
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role }
      })
      return NextResponse.json({ success: true, user: updatedUser })
    }

    if (creditsToAdd) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: Number(creditsToAdd) } }
      })
      return NextResponse.json({ success: true, user: updatedUser })
    }

    return NextResponse.json({ error: 'No valid action provided' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
