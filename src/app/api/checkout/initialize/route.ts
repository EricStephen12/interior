import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userEmail, phone, totalAmount, items, hasMembership, creditAmount, name } = body

    if (!items || totalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { userId } = await auth()
    const email = userEmail

    if (!email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
    }

    const secretKey = process.env.KINGSPAY_SECRET_KEY
    if (!secretKey) {
      console.error('KINGSPAY_SECRET_KEY is not defined in environment variables')
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    const reqUrl = new URL(req.url)
    const proto = req.headers.get('x-forwarded-proto') || reqUrl.protocol.replace(':', '')
    const host = req.headers.get('x-forwarded-host') || reqUrl.host
    const origin = `${proto}://${host}`

    // Convert amount to cents/kobo string (e.g. 1000 = ₦10.00)
    const amountInCents = Math.round(totalAmount * 100).toString()

    // Construct dynamic description with item names
    let description = 'SHARERS GYM Order'
    if (Array.isArray(items) && items.length > 0) {
      const names = items.map((i: any) => `${i.name || 'Item'} (x${i.quantity || 1})`).join(', ')
      description = `SHARERS GYM: ${names}`
    }
    if (description.length > 255) {
      description = description.substring(0, 252) + '...'
    }

    const orderId = crypto.randomUUID()

    const kingsPayPayload = {
      amount: amountInCents,
      currency: 'NGN',
      description,
      environment: process.env.KINGSPAY_ENVIRONMENT || 'test',
      merchant_callback_url: `${origin}/api/checkout/callback?merchantOrderId=${orderId}`,
      merchant_webhook_url: `${origin}/api/webhooks/kingspay`,
      payment_type: 'african',
      email: email,
      metadata: {
        userEmail: email,
        phone: phone || '',
        name: name || 'Guest Member',
        totalAmount,
        items,
        hasMembership: !!hasMembership,
        creditAmount: creditAmount || 0,
        clerkId: userId || null
      }
    }

    console.log('Initializing KingsPay payment with payload:', JSON.stringify(kingsPayPayload, null, 2))

    const response = await fetch('https://api.kingspay-gs.com/api/payment/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kingsPayPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('KingsPay payment initialization failed:', response.status, errorText)
      return NextResponse.json({ error: 'Failed to initialize payment with KingsPay' }, { status: 520 })
    }

    const resData = await response.json()
    console.log('KingsPay initialization response:', JSON.stringify(resData, null, 2))

    // Handle standard variations in KingsPay JSON responses
    const paymentId = resData.id || resData.payment_id || resData.data?.id || resData.data?.payment_id
    if (!paymentId) {
      console.error('KingsPay response did not contain a payment ID:', resData)
      return NextResponse.json({ error: 'Invalid response from payment gateway' }, { status: 500 })
    }

    // Create order as 'PENDING' using the generated local order ID and storing the KingsPay payment ID
    const order = await prisma.order.create({
      data: {
        id: orderId,
        kingspayId: paymentId,
        userEmail: email,
        totalAmount,
        items: items,
        status: 'PENDING'
      } as any
    })

    // Construct the redirect URL for KingsPay checkout interface
    const redirectUrl = `https://kingspay-gs.com/payment?id=${paymentId}`

    return NextResponse.json({
      success: true,
      paymentId,
      redirectUrl,
      orderId: order.id
    })
  } catch (error) {
    console.error('Checkout initialization error:', error)
    return NextResponse.json({ error: 'Failed to process checkout initialization' }, { status: 500 })
  }
}
