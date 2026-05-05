import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive code' }, { status: 404 })
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      discount: promo.discount,
      code: promo.code 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
