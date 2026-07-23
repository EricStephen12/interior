import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    // 1. Verify Vercel Cron Secret to protect this endpoint
    const authHeader = req.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Define the start and end of "Today" in the server timezone (which should be UTC or your configured timezone)
    // For Vercel, it runs in UTC. If you need local timezone, we shift it. For simplicity, we use UTC midnight.
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    // 3. Find all users who actually scanned in today
    const todayCheckIns = await prisma.checkIn.findMany({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        }
      },
      select: { userId: true }
    })
    const checkedInUserIds = todayCheckIns.map(c => c.userId)

    // 4. Find all active users who DID NOT check in today
    const missedUsers = await prisma.user.findMany({
      where: {
        credits: { gt: 0 },
        id: { notIn: checkedInUserIds }
      },
      select: { id: true }
    })
    const missedUserIds = missedUsers.map(u => u.id)

    // 5. Bulk update: Deduct 1 credit from everyone who missed today
    if (missedUserIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: missedUserIds } },
        data: { credits: { decrement: 1 } }
      })

      // 6. Bulk insert: Create MISSED records for all of them
      const nowForRecord = new Date()
      await prisma.checkIn.createMany({
        data: missedUserIds.map(id => ({
          userId: id,
          protocol: 'MISSED',
          date: nowForRecord
        }))
      })
    }

    return NextResponse.json({ 
      success: true, 
      processed: missedUsers.length + checkedInUserIds.length, 
      deducted: missedUserIds.length 
    })

  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
