import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

// Explicitly define the supported payment types
const SUPPORTED_PAYMENT_METHODS = ['kingspay', 'espees'] as const
type SupportedPaymentMethod = typeof SUPPORTED_PAYMENT_METHODS[number]

// Map our frontend payment method names to KingsPay payment_type values
const PAYMENT_TYPE_MAP: Record<SupportedPaymentMethod, string> = {
  kingspay: 'african',
  espees: 'espees',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userEmail, phone, totalAmount, items, hasMembership, creditAmount, name, paymentMethod, shippingAddress, deliveryZone } = body

    if (!items || totalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fix 1: Reject unsupported payment methods explicitly instead of silently falling back
    if (!paymentMethod || !SUPPORTED_PAYMENT_METHODS.includes(paymentMethod as SupportedPaymentMethod)) {
      console.error(`Unsupported payment method received: "${paymentMethod}"`)
      return NextResponse.json(
        { error: `Unsupported payment method: "${paymentMethod}". Supported methods are: ${SUPPORTED_PAYMENT_METHODS.join(', ')}` },
        { status: 400 }
      )
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

    // Require KINGSPAY_ENVIRONMENT to be explicitly configured — validate against known allowed values
    const ALLOWED_ENVIRONMENTS = ['production', 'test'] as const
    const kingsPayEnvironment = process.env.KINGSPAY_ENVIRONMENT
    if (!kingsPayEnvironment) {
      console.error('KINGSPAY_ENVIRONMENT is not defined in environment variables')
      return NextResponse.json({ error: 'Payment gateway environment is not configured' }, { status: 500 })
    }
    if (!ALLOWED_ENVIRONMENTS.includes(kingsPayEnvironment as typeof ALLOWED_ENVIRONMENTS[number])) {
      console.error(`Invalid KINGSPAY_ENVIRONMENT value: "${kingsPayEnvironment}". Must be one of: ${ALLOWED_ENVIRONMENTS.join(', ')}`)
      return NextResponse.json({ error: 'Payment gateway environment is misconfigured' }, { status: 500 })
    }

    // Use APP_URL env var and parse via URL constructor so we always get a clean origin
    // (strips any path, query string, or trailing slash — safe for callback URLs)
    const appUrlRaw = process.env.APP_URL
    if (!appUrlRaw) {
      console.error('APP_URL is not defined in environment variables')
      return NextResponse.json({ error: 'Application URL is not configured' }, { status: 500 })
    }
    const origin = new URL(appUrlRaw).origin

    // Default to cart total
    let effectiveTotal = totalAmount

    // Dynamic Espees Exchange Rate Calculation
    if (paymentMethod === 'espees') {
      const rateSetting = await prisma.storeSetting.findUnique({
        where: { key: 'espees_exchange_rate' }
      })
      const exchangeRate = rateSetting ? parseFloat(rateSetting.value) || 2050 : 2050
      
      // Calculate equivalent Espees (e.g. ₦10,250 / 2050 = 5 ESP)
      effectiveTotal = totalAmount / exchangeRate
    }

    // Convert effective amount to cents/kobo string (e.g. 5 ESP = 500 cents)
    let amountInCents = Math.round(effectiveTotal * 100).toString()

    // KingsPay API strictly requires a minimum of 200 (₦2.00 / 2 ESP).
    // To prevent test orders from failing, silently bump any tiny amounts up to the minimum required.
    if (parseInt(amountInCents) < 200) {
      amountInCents = "200"
    }

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
      amount: parseInt(amountInCents),
      currency: paymentMethod === 'espees' ? 'ESP' : 'NGN',
      description,
      merchant_callback_url: `${origin}/api/checkout/callback?merchantOrderId=${orderId}`,
      merchant_webhook_url: `${origin}/api/webhooks/kingspay`,
      payment_type: PAYMENT_TYPE_MAP[paymentMethod as SupportedPaymentMethod],
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
        status: 'PENDING',
        shippingDetails: shippingAddress ? {
          name: name,
          phone: phone,
          address: shippingAddress,
          zone: deliveryZone
        } : null
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
  } catch (error: any) {
    console.error('Checkout initialization error:', error)
    return NextResponse.json({ 
      error: 'Failed to process checkout initialization',
      details: error?.message || String(error)
    }, { status: 500 })
  }
}

