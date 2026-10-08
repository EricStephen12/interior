import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET — check if current user has submitted a fitness profile
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ hasProfile: false }, { status: 200 })

    const profile = await (prisma as any).fitnessProfile.findUnique({
      where: { userId }
    })

    return NextResponse.json({ hasProfile: !!profile, profile })
  } catch {
    return NextResponse.json({ hasProfile: false }, { status: 500 })
  }
}

// POST — submit fitness profile
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const clerkUser = await currentUser()
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || ''
    const userName = clerkUser?.fullName || clerkUser?.firstName || 'Member'

    const body = await req.json()

    const profile = await (prisma as any).fitnessProfile.upsert({
      where: { userId },
      update: {
        userEmail,
        userName,
        ...body,
        updatedAt: new Date(),
      },
      create: {
        userId,
        userEmail,
        userName,
        ...body,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (err) {
    console.error('[FitnessProfile] Error:', err)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
