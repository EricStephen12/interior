import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const locations = await prisma.deliveryLocation.findMany({
      where: { isActive: true },
      orderBy: { basePrice: 'asc' }
    })
    
    // If db is empty, provide a fallback
    if (locations.length === 0) {
      return NextResponse.json({
        locations: [
          { id: 'intl', name: 'Priority Shipping (Express)', basePrice: 15000 },
          { id: 'domestic', name: 'Standard Domestic Delivery', basePrice: 5000 },
          { id: 'pickup', name: 'Pick up at the Gym', basePrice: 0 }
        ]
      })
    }

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Failed to fetch delivery locations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
