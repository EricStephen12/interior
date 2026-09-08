import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  return handleDigest(req)
}

export async function POST(req: Request) {
  return handleDigest(req)
}

async function handleDigest(req: Request) {
  try {
    // Check authorization: allow if admin session or if matching CRON_SECRET header
    const { userId } = await auth().catch(() => ({ userId: null }))
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'sharers_cron_secret'
    const isCron = authHeader === `Bearer ${cronSecret}`

    if (!userId && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Window: Past 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dateStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    // 1. Revenue & Orders
    const paidOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: oneDayAgo },
        status: { in: ['COMPLETED', 'PAID', 'DELIVERED', 'SHIPPED'] },
      },
      select: { totalAmount: true },
    })
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const paidOrderCount = paidOrders.length

    // 2. Gym Facility Check-Ins
    const checkInCount = await prisma.checkIn.count({
      where: {
        date: { gte: oneDayAgo },
      },
    })

    // 3. New Member Registrations
    const newMemberCount = await prisma.user.count({
      where: {
        createdAt: { gte: oneDayAgo },
      },
    })

    // 4. Low Stock Inventory Watchlist (items <= 3)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 3 },
      },
      select: {
        name: true,
        stock: true,
      },
      take: 10,
    })

    // 5. Dispatch Executive Digest Email via Resend
    const emailResult = await emailService.sendDailyExecutiveDigest({
      dateStr,
      totalRevenue,
      paidOrderCount,
      checkInCount,
      newMemberCount,
      lowStockItems: lowStockProducts.map(p => ({ name: p.name, stock: p.stock })),
    })

    return NextResponse.json({
      success: true,
      deliveredTo: 'sharersmall@gmail.com',
      date: dateStr,
      emailId: (emailResult as any)?.data?.id || 'OK',
      metrics: {
        totalRevenue,
        paidOrderCount,
        checkInCount,
        newMemberCount,
        lowStockItems: lowStockProducts,
      },
    })
  } catch (error: any) {
    console.error('[Daily Digest] Error generating digest:', error)
    return NextResponse.json({ error: error?.message || 'Failed to generate digest' }, { status: 500 })
  }
}
