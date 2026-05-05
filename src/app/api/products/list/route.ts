import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { brand: true, categories: { include: { category: true } } }
    })
    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
