import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const packs = await prisma.creditPack.findMany({ orderBy: { price: 'asc' } })
    return NextResponse.json({ packs })
  } catch {
    return NextResponse.json({ packs: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { name, credits, price, description, isPopular } = await req.json()
    const pack = await prisma.creditPack.create({
      data: {
        name: name.toUpperCase(),
        credits: parseInt(credits),
        price: parseFloat(price),
        description,
        isPopular: !!isPopular
      }
    })
    return NextResponse.json({ success: true, pack })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.creditPack.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
