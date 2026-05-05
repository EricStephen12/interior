import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ promos })
  } catch {
    return NextResponse.json({ promos: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { code, discount, expiresAt } = await req.json()
    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    })
    return NextResponse.json({ success: true, promo })
  } catch (error) {
    return NextResponse.json({ error: 'Code already exists or invalid data' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.promoCode.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
