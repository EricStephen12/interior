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
    
    if (!name || !credits || !price) {
      return NextResponse.json({ error: 'Name, credits, and price are required' }, { status: 400 })
    }

    const pack = await prisma.creditPack.create({
      data: {
        name: name.toUpperCase().trim(),
        credits: parseInt(credits),
        price: parseFloat(price),
        description: description?.trim() || null,
        isPopular: !!isPopular
      }
    })
    return NextResponse.json({ success: true, pack })
  } catch (error) {
    console.error('Credit Pack POST error:', error)
    return NextResponse.json({ error: 'Failed to create pack. Ensure numbers are valid.' }, { status: 400 })
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
