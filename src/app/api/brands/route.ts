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
    const brand = await prisma.brand.create({ data: { name } })
    return NextResponse.json({ success: true, brand })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
