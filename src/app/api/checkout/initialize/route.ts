import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// Explicitly define the supported payment types
const SUPPORTED_PAYMENT_METHODS = ['kingspay', 'espees', 'manual_transfer'] as const
type SupportedPaymentMethod = typeof SUPPORTED_PAYMENT_METHODS[number]

// Map our frontend payment method names to KingsPay payment_type values
const PAYMENT_TYPE_MAP: Record<'kingspay' | 'espees', string> = {
  kingspay: 'african',
  espees: 'espees',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      userEmail, 
      phone, 
      totalAmount, 
      items, 
      hasMembership, 
      creditAmount, 
      name, 
      paymentMethod, 
      shippingAddress, 
      deliveryZone,
      transferReference 
    } = body

    if (!items || totalAmount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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

    // Load store payment settings from DB with fallback
    const settingsRows = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            'payment_kingspay_secret_key',
            'payment_kingspay_env',
            'payment_kingspay_app_url',
            'espees_exchange_rate',
            'payment_manual_bank_name',
            'payment_manual_account_name',
            'payment_manual_account_number',
          ]
        }
      }
    })

    const dbSettings: Record<string, string> = {}
    for (const r of settingsRows) {
      dbSettings[r.key] = r.value
    }

    const orderId = crypto.randomUUID()

    // ─────────────────────────────────────────────────────────────
    // BRANCH A: MANUAL BANK TRANSFER
    // ─────────────────────────────────────────────────────────────
    if (paymentMethod === 'manual_transfer') {
      const order = await prisma.order.create({
        data: {
          id: orderId,
          userEmail: email,
          totalAmount,
          items: items,
          status: 'PENDING_VERIFICATION',
          shippingDetails: {
            name: name || 'Valued Member',
            phone: phone || '',
            address: shippingAddress || 'N/A',
            zone: deliveryZone || null,
            paymentType: 'MANUAL_BANK_TRANSFER',
            transferReference: transferReference || 'Pending Confirmation',
            creditAmount: creditAmount || 0,
            hasMembership: !!hasMembership,
            bankDetails: {
              bankName: dbSettings['payment_manual_bank_name'] || 'Zenith Bank',
              accountName: dbSettings['payment_manual_account_name'] || 'SHARERS GYM ATELIER LTD',
              accountNumber: dbSettings['payment_manual_account_number'] || '1223456789',
            }
          }
        } as any
      })

      return NextResponse.json({
        success: true,
        manualTransfer: true,
        orderId: order.id,
        message: 'Order created and awaiting manual bank transfer verification.'
      })
    }

    // ─────────────────────────────────────────────────────────────
    // BRANCH B: KINGSPAY (CARD & ESPEES)
    // ─────────────────────────────────────────────────────────────
    const secretKey = dbSettings['payment_kingspay_secret_key'] || process.env.KINGSPAY_SECRET_KEY
    if (!secretKey) {
      console.error('KingsPay Secret Key is not configured')
      return NextResponse.json({ error: 'Payment gateway configuration error. Please configure KingsPay API keys in Admin Settings.' }, { status: 500 })
    }

    const kingsPayEnvironment = dbSettings['payment_kingspay_env'] || process.env.KINGSPAY_ENVIRONMENT || 'production'

    // App URL resolution
    const appUrlRaw = (dbSettings['payment_kingspay_app_url'] || process.env.APP_URL || 'http://localhost:3000').trim()
    let origin = 'http://localhost:3000'
    try {
      const formattedAppUrl = appUrlRaw.startsWith('http://') || appUrlRaw.startsWith('https://') 
        ? appUrlRaw 
        : `https://${appUrlRaw}`
      origin = new URL(formattedAppUrl).origin
    } catch {
      origin = 'http://localhost:3000'
    }

    // Default to cart total
    let effectiveTotal = totalAmount

    // Dynamic Espees Exchange Rate Calculation
    if (paymentMethod === 'espees') {
      const exchangeRate = parseFloat(dbSettings['espees_exchange_rate'] || '2050') || 2050
      effectiveTotal = totalAmount / exchangeRate
    }

    // Convert effective amount to cents/kobo string (e.g. 5 ESP = 500 cents)
    let amountInCents = Math.round(effectiveTotal * 100).toString()

    // KingsPay API minimum requirement
    if (parseInt(amountInCents) < 200) {
      amountInCents = "200"
    }

    let description = 'SHARERS GYM Order'
    if (Array.isArray(items) && items.length > 0) {
      const names = items.map((i: any) => `${i.name || 'Item'} (x${i.quantity || 1})`).join(', ')
      description = `SHARERS GYM: ${names}`
    }
    if (description.length > 255) {
      description = description.substring(0, 252) + '...'
    }

    const kingsPayPayload = {
      amount: parseInt(amountInCents),
      currency: paymentMethod === 'espees' ? 'ESP' : 'NGN',
      description,
      merchant_callback_url: `${origin}/api/checkout/callback?merchantOrderId=${orderId}`,
      merchant_webhook_url: `${origin}/api/webhooks/kingspay`,
      payment_type: PAYMENT_TYPE_MAP[paymentMethod as 'kingspay' | 'espees'],
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
    const paymentId = resData.id || resData.payment_id || resData.data?.id || resData.data?.payment_id
    if (!paymentId) {
      console.error('KingsPay response did not contain a payment ID:', resData)
      return NextResponse.json({ error: 'Invalid response from payment gateway' }, { status: 500 })
    }

    // Create order as 'PENDING'
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
          zone: deliveryZone,
          paymentType: 'KINGSPAY'
        } : null
      } as any
    })

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
