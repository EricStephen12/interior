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

    // 3. Find all users who have remaining days (credits > 0)
    const activeUsers = await prisma.user.findMany({
      where: {
        credits: { gt: 0 }
      },
      select: {
        id: true,
        credits: true
      }
    })

    let deductedCount = 0

    // 4. For each active user, check if they scanned in today
    for (const user of activeUsers) {
      const todayCheckIn = await prisma.checkIn.findFirst({
        where: {
          userId: user.id,
          date: {
            gte: startOfToday,
            lte: endOfToday
          }
        }
      })

      // If they didn't scan in today (no CheckIn record found for today), deduct a day
      if (!todayCheckIn) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: { decrement: 1 },
            // Create a MISSED record so it shows up in their history
            checkIns: {
              create: {
                protocol: 'MISSED',
                date: new Date() // Record the miss right now
              }
            }
          }
        })
        deductedCount++
      }
    }

    return NextResponse.json({ success: true, processed: activeUsers.length, deducted: deductedCount })

  } catch (error) {
    console.error('Cron Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
