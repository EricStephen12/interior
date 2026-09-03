import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const recentCheckIns = await prisma.checkIn.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            credits: true,
            memberId: true,
            tier: true
          }
        }
      }
    })

    return NextResponse.json({ checkIns: recentCheckIns })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 })
  }
}
