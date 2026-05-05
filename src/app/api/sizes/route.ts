import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({ orderBy: { label: 'asc' } })
    return NextResponse.json({ sizes })
  } catch (error) {
    return NextResponse.json({ sizes: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { label } = await req.json()
    if (!label) return NextResponse.json({ error: 'Label is required' }, { status: 400 })
    
    const size = await prisma.size.create({ data: { label: label.trim() } })
    return NextResponse.json({ success: true, size })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This size already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create size' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    
    // Check if size is in use
    const products = await prisma.product.count({ where: { sizeId: id } })
    if (products > 0) {
      return NextResponse.json({ error: 'Cannot delete size while it is used by products. Delete or move the products first.' }, { status: 400 })
    }

    await prisma.size.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
