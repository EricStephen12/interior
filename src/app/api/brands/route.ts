import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    return NextResponse.json({ brands })
  } catch (error) {
    return NextResponse.json({ brands: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const brand = await prisma.brand.create({ 
      data: { 
        name,
        slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`
      } 
    })
    return NextResponse.json({ success: true, brand })
  } catch (error) {
    console.error('Brand POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    
    // Check if brand is in use
    const products = await prisma.product.count({ where: { brandId: id } })
    if (products > 0) {
      return NextResponse.json({ error: 'Cannot delete brand while it has products. Delete or move the products first.' }, { status: 400 })
    }

    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
