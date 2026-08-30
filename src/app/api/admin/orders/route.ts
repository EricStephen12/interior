import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // We fetch all orders but sort them by most recent
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    // If verifying a manual transfer order to PAID, automatically activate credits/pass for the member
    if (
      status === 'PAID' && 
      (existingOrder.status === 'PENDING_VERIFICATION' || existingOrder.status === 'PENDING')
    ) {
      const shipping = existingOrder.shippingDetails as any
      const email = existingOrder.userEmail
      const creditAmount = shipping?.creditAmount ? parseInt(shipping.creditAmount.toString()) : 0
      const hasMembership = !!shipping?.hasMembership

      if (email && (creditAmount > 0 || hasMembership)) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user) {
          await prisma.user.update({
            where: { email },
            data: {
              credits: { increment: creditAmount > 0 ? creditAmount : 30 },
              tier: hasMembership ? 'PRO' : user.tier === 'NONE' ? 'ACTIVE' : user.tier
            }
          })
          console.log(`Auto-credited ${creditAmount || 30} passes to ${email} upon bank transfer verification.`)
        }
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
