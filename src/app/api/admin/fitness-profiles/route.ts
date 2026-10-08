import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify admin
    const clerkUser = await currentUser()
    const email = (clerkUser?.emailAddresses?.[0]?.emailAddress || '').toLowerCase()
    const isOwner = email === (process.env.ADMIN_EMAIL || 'sharersgymtest@gmail.com').toLowerCase()

    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: { equals: email, mode: 'insensitive' } }
        ]
      }
    })

    if (!isOwner && dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.toLowerCase() || ''

    const profiles = await (prisma as any).fitnessProfile.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 100,
    })

    const filtered = query
      ? profiles.filter((p: any) =>
          p.userName?.toLowerCase().includes(query) ||
          p.userEmail?.toLowerCase().includes(query) ||
          p.phone?.toLowerCase().includes(query) ||
          p.signatureName?.toLowerCase().includes(query)
        )
      : profiles

    return NextResponse.json({
      profiles: filtered,
      total: profiles.length,
      healthFlagsCount: profiles.filter((p: any) => p.currentPainOrInjury || p.doctorAdviceLimit || p.medicalCondition || p.allergies).length,
    })
  } catch (err) {
    console.error('[Admin FitnessProfiles API] Error:', err)
    return NextResponse.json({ error: 'Failed to load fitness profiles' }, { status: 500 })
  }
}
