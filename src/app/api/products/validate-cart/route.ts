import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { itemIds } = await req.json()
    
    if (!itemIds || !Array.isArray(itemIds)) {
      return NextResponse.json({ validIds: [] })
    }

    // Check which IDs still exist in the database
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: itemIds }
      },
      select: { id: true }
    })

    const validIds = existingProducts.map(p => p.id)

    return NextResponse.json({ validIds })
  } catch (error) {
    console.error('Cart validation error:', error)
    return NextResponse.json({ error: 'Failed to validate cart' }, { status: 500 })
  }
}
