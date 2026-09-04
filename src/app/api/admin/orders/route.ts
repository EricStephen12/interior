import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { emailService } from '@/lib/services/email'

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
        const name = shipping?.name || 'Valued Member'
        const phone = shipping?.phone || ''
        const addCredits = creditAmount > 0 ? creditAmount : 30

        await prisma.user.upsert({
          where: { email },
          update: {
            phone: phone || undefined,
            credits: { increment: addCredits },
            tier: hasMembership ? 'PRO' : undefined
          },
          create: {
            email,
            phone,
            clerkId: 'guest_' + Date.now(),
            name,
            credits: addCredits,
            tier: hasMembership ? 'PRO' : 'NONE'
          }
        })
        console.log(`Auto-credited ${addCredits} passes to ${email} upon bank transfer verification.`)
      }

      // Send Order Confirmation email to customer now that bank payment is confirmed
      let parsedItems: any[] = []
      if (Array.isArray(existingOrder.items)) {
        parsedItems = existingOrder.items
      } else if (typeof existingOrder.items === 'string') {
        try {
          const parsed = JSON.parse(existingOrder.items)
          parsedItems = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          parsedItems = [{ name: 'Order Items', quantity: 1, price: existingOrder.totalAmount }]
        }
      }

      emailService.sendOrderConfirmationEmail({
        orderId: existingOrder.id,
        userEmail: existingOrder.userEmail,
        userName: shipping?.name || 'Valued Member',
        items: parsedItems,
        totalAmount: existingOrder.totalAmount,
        shippingAddress: shipping?.address,
        paymentMethod: 'Bank Transfer (Verified)',
      }).catch((err) => console.error('[Email Error] Order verification email:', err))

      emailService.triggerResendEvent({
        name: 'order.paid',
        email: existingOrder.userEmail,
        data: {
          orderId: existingOrder.id,
          totalAmount: existingOrder.totalAmount,
          verifiedByAdmin: true,
        },
      }).catch(() => {})
    } else if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      // Send Order Status Update Email
      emailService.sendOrderStatusUpdateEmail({
        orderId: existingOrder.id,
        userEmail: existingOrder.userEmail,
        userName: (existingOrder.shippingDetails as any)?.name || 'Valued Member',
        newStatus: status,
      }).catch((err) => console.error('[Email Error] Status update email:', err))

      emailService.triggerResendEvent({
        name: `order.${status.toLowerCase()}`,
        email: existingOrder.userEmail,
        data: {
          orderId: existingOrder.id,
          newStatus: status,
        },
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
