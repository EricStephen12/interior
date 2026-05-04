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
