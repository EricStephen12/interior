import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const FALLBACK_ZONES = [
  { id: 'intl', name: 'Priority Shipping (Express)', basePrice: 15000 },
  { id: 'domestic', name: 'Standard Domestic Delivery', basePrice: 5000 },
  { id: 'pickup', name: 'Pick up at the Gym', basePrice: 0 }
]

export async function GET() {
  try {
    const locations = await prisma.deliveryLocation.findMany({
      where: { isActive: true },
      orderBy: { basePrice: 'asc' }
    })
    return NextResponse.json({ locations: locations.length > 0 ? locations : FALLBACK_ZONES })
  } catch {
    return NextResponse.json({ locations: FALLBACK_ZONES })
  }
}
