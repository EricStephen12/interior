import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth, clerkClient } from '@clerk/nextjs/server'

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

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url)
    let targetUserId = searchParams.get('userId')

    if (!targetUserId) {
      try {
        const body = await req.json()
        targetUserId = body.userId
      } catch {}
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Prevent admin from accidentally deleting their own account
    if (targetUserId === adminUser.id) {
      return NextResponse.json({ error: 'You cannot delete your own administrator account.' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 1. Delete associated check-ins
    await prisma.checkIn.deleteMany({
      where: { userId: targetUserId }
    })

    // 2. Delete user from database
    await prisma.user.delete({
      where: { id: targetUserId }
    })

    // 3. Delete from Clerk so they cannot log in
    if (targetUser.clerkId && !targetUser.clerkId.startsWith('guest_')) {
      try {
        const client = await clerkClient()
        await client.users.deleteUser(targetUser.clerkId)
      } catch (clerkErr) {
        console.warn('[Admin Users] Failed to delete Clerk user:', clerkErr)
      }
    }

    return NextResponse.json({ success: true, message: 'Member removed successfully' })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

