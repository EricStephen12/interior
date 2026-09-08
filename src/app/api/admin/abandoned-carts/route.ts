import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'
import { auth } from '@clerk/nextjs/server'

/**
 * GET /api/admin/abandoned-carts
 * Scans pending orders created between 1 hour and 72 hours ago
 * and triggers cart reservation reminder emails (without discounts).
 */
export async function GET(req: Request) {
  try {
    const { userId } = await auth().catch(() => ({ userId: null }))
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'sharers_cron_secret'
    const isCron = authHeader === `Bearer ${cronSecret}`

    if (!userId && !isCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = Date.now()
    const oneHourAgo = new Date(now - 60 * 60 * 1000)
    const threeDaysAgo = new Date(now - 72 * 60 * 60 * 1000)

    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: oneHourAgo,
          gte: threeDaysAgo,
        },
      },
      take: 25,
      orderBy: { createdAt: 'desc' },
    })

    const recovered: string[] = []

    for (const order of pendingOrders) {
      const shipping = (order.shippingDetails as any) || {}
      if (shipping.abandonedRecoverySent) {
        continue
      }

      let parsedItems: any[] = []
      if (Array.isArray(order.items)) {
        parsedItems = order.items
      } else if (typeof order.items === 'string') {
        try {
          parsedItems = JSON.parse(order.items)
        } catch {}
      }

      if (parsedItems.length > 0 && order.userEmail) {
        await emailService.sendAbandonedCartEmail({
          userEmail: order.userEmail,
          userName: shipping.name || 'Valued Athlete',
          items: parsedItems,
          totalAmount: order.totalAmount,
          checkoutUrl: 'https://sharersgym.com/checkout',
        })

        await prisma.order.update({
          where: { id: order.id },
          data: {
            shippingDetails: {
              ...shipping,
              abandonedRecoverySent: true,
              abandonedRecoverySentAt: new Date().toISOString(),
            },
          },
        })

        recovered.push(order.id)
      }
    }

    return NextResponse.json({
      success: true,
      scanned: pendingOrders.length,
      emailsSent: recovered.length,
      orderIds: recovered,
    })
  } catch (error) {
    console.error('[Abandoned Carts Cron Error]:', error)
    return NextResponse.json({ error: 'Failed to process abandoned carts' }, { status: 500 })
  }
}

/**
 * POST /api/admin/abandoned-carts
 * Allows admin to manually trigger an abandoned cart reminder for a specific order.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.userEmail) {
      return NextResponse.json({ error: 'Customer email not available for this order' }, { status: 400 })
    }

    let parsedItems: any[] = []
    if (Array.isArray(order.items)) {
      parsedItems = order.items
    } else if (typeof order.items === 'string') {
      try {
        parsedItems = JSON.parse(order.items)
      } catch {}
    }

    const shipping = (order.shippingDetails as any) || {}

    await emailService.sendAbandonedCartEmail({
      userEmail: order.userEmail,
      userName: shipping.name || 'Valued Athlete',
      items: parsedItems,
      totalAmount: order.totalAmount,
      checkoutUrl: 'https://sharersgym.com/checkout',
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        shippingDetails: {
          ...shipping,
          abandonedRecoverySent: true,
          abandonedRecoverySentAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Abandoned cart reminder sent to ${order.userEmail}`,
    })
  } catch (error) {
    console.error('[Manual Abandoned Cart Error]:', error)
    return NextResponse.json({ error: 'Failed to send recovery email' }, { status: 500 })
  }
}
