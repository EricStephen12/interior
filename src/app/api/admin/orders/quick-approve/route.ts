import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService, verifyQuickApproveToken } from '@/lib/services/email'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const token = searchParams.get('token')

  const renderResponse = ({
    title,
    message,
    success = false,
    orderIdText = '',
    memberEmail = '',
    creditsAdded = 0,
  }: {
    title: string
    message: string
    success?: boolean
    orderIdText?: string
    memberEmail?: string
    creditsAdded?: number
  }) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} • Sharers Gym Admin</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #020617;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
          }
          .card {
            background: #0b0f19;
            border: 1px solid ${success ? '#22c55e' : '#ef4444'};
            border-radius: 12px;
            max-width: 480px;
            width: 100%;
            padding: 36px 28px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          }
          .icon-badge {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: ${success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
            color: ${success ? '#22c55e' : '#ef4444'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 20px;
            border: 1px solid ${success ? '#22c55e' : '#ef4444'};
          }
          h1 {
            font-size: 20px;
            font-weight: 800;
            margin: 0 0 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff;
          }
          p {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.6;
            margin: 0 0 24px;
          }
          .details {
            background: #131b2e;
            border: 1px solid #1e293b;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
            text-align: left;
            font-size: 13px;
          }
          .details div {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #1e293b;
          }
          .details div:last-child {
            border-bottom: none;
          }
          .label {
            color: #64748b;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 1px;
          }
          .val {
            color: #f8fafc;
            font-weight: 600;
          }
          .btn {
            display: inline-block;
            background: #f20d0d;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 800;
            font-size: 12px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            transition: opacity 0.2s;
          }
          .btn:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-badge">
            ${success ? '✓' : '✕'}
          </div>
          <h1>${title}</h1>
          <p>${message}</p>
          ${orderIdText ? `
            <div class="details">
              <div><span class="label">Order ID</span><span class="val">#${orderIdText.slice(-8).toUpperCase()}</span></div>
              ${memberEmail ? `<div><span class="label">Member</span><span class="val">${memberEmail}</span></div>` : ''}
              ${creditsAdded > 0 ? `<div><span class="label">Credits Added</span><span class="val" style="color: #22c55e;">+${creditsAdded} SESSIONS</span></div>` : ''}
              <div><span class="label">Status</span><span class="val" style="color: #22c55e;">PAID & ACTIVE</span></div>
            </div>
          ` : ''}
          <a href="https://sharersgym.com/admin/orders" class="btn">View in Admin Orders</a>
        </div>
      </body>
      </html>
    `
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  if (!orderId || !token) {
    return renderResponse({
      title: 'Invalid Request',
      message: 'Missing order ID or verification security token.',
      success: false,
    })
  }

  // Verify HMAC signature
  if (!verifyQuickApproveToken(orderId, token)) {
    return renderResponse({
      title: 'Verification Failed',
      message: 'Security token is invalid or expired. Please verify directly via the admin console.',
      success: false,
    })
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!existingOrder) {
      return renderResponse({
        title: 'Order Not Found',
        message: `Order #${orderId.slice(-8).toUpperCase()} could not be located in the database.`,
        success: false,
      })
    }

    if (existingOrder.status === 'PAID' || existingOrder.status === 'COMPLETED') {
      return renderResponse({
        title: 'Already Verified',
        message: 'This order has already been verified and the member passes have already been activated.',
        success: true,
        orderIdText: existingOrder.id,
        memberEmail: existingOrder.userEmail,
      })
    }

    // Mark PAID
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    })

    // Auto-credit user passes
    const shipping = existingOrder.shippingDetails as any
    const email = existingOrder.userEmail
    const creditAmount = shipping?.creditAmount ? parseInt(shipping.creditAmount.toString()) : 0
    const hasMembership = !!shipping?.hasMembership
    const addCredits = creditAmount > 0 ? creditAmount : 30

    if (email && (creditAmount > 0 || hasMembership)) {
      const name = shipping?.name || 'Valued Member'
      const phone = shipping?.phone || ''

      await prisma.user.upsert({
        where: { email },
        update: {
          phone: phone || undefined,
          credits: { increment: addCredits },
          tier: hasMembership ? 'PRO' : undefined,
        },
        create: {
          email,
          phone,
          clerkId: 'guest_' + Date.now(),
          name,
          credits: addCredits,
          tier: hasMembership ? 'PRO' : 'NONE',
        },
      })
    }

    // Decrement stock for ordered physical products
    let parsedItems: any[] = []
    if (Array.isArray(existingOrder.items)) {
      parsedItems = existingOrder.items
    } else if (typeof existingOrder.items === 'string') {
      try {
        const parsed = JSON.parse(existingOrder.items)
        parsedItems = Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        parsedItems = []
      }
    }

    for (const item of parsedItems) {
      const pId = item.productId || item.id
      const qty = item.quantity || 1
      if (pId) {
        try {
          const updateResult = await prisma.product.updateMany({
            where: { id: pId, stock: { gte: qty } },
            data: { stock: { decrement: qty } },
          })
          if (updateResult.count > 0) {
            const product = await prisma.product.findUnique({
              where: { id: pId },
              select: { id: true, name: true, stock: true },
            })
            if (product && product.stock <= 3) {
              emailService.sendLowStockAlert({
                productName: product.name,
                remainingStock: product.stock,
                productId: product.id,
              }).catch(() => {})
            }
          } else {
            console.warn(`[Stock Collision Guard] Quick approve for order ${existingOrder.id}: Item ${item.name} had insufficient inventory to decrement.`)
          }
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${pId}:`, stockErr)
        }
      }
    }

    // Send customer confirmation email
    emailService.sendOrderConfirmationEmail({
      orderId: existingOrder.id,
      userEmail: existingOrder.userEmail,
      userName: shipping?.name || 'Valued Member',
      items: parsedItems.length > 0 ? parsedItems : [{ name: 'Gym Access / Items', quantity: 1, price: existingOrder.totalAmount }],
      totalAmount: existingOrder.totalAmount,
      shippingAddress: shipping?.address,
      paymentMethod: 'Bank Transfer (1-Click Verified)',
    }).catch((err) => console.error('[QuickApprove] Confirmation email failed:', err))

    // Trigger Resend Automation Event
    emailService.triggerResendEvent({
      name: 'order.paid',
      email: existingOrder.userEmail,
      data: {
        orderId: existingOrder.id,
        totalAmount: existingOrder.totalAmount,
        verifiedViaQuickApprove: true,
      },
    }).catch(() => {})

    return renderResponse({
      title: 'Payment Verified!',
      message: 'The bank transfer was approved, the member account was credited, and the customer receipt email has been dispatched.',
      success: true,
      orderIdText: existingOrder.id,
      memberEmail: existingOrder.userEmail,
      creditsAdded: addCredits,
    })
  } catch (error: any) {
    console.error('Quick approve error:', error)
    return renderResponse({
      title: 'Server Error',
      message: error?.message || 'An unexpected error occurred during verification.',
      success: false,
    })
  }
}
