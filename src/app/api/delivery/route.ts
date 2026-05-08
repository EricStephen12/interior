import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const locations = await prisma.deliveryLocation.findMany({
      orderBy: { basePrice: 'asc' }
    })
    return NextResponse.json({ locations })
  } catch (error) {
    return NextResponse.json({ locations: [] })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const location = await prisma.deliveryLocation.create({
      data: {
        name: data.name,
        basePrice: parseFloat(data.basePrice),
        isActive: data.isActive ?? true
      }
    })
    return NextResponse.json({ success: true, location })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const { id, ...rest } = data
    const location = await prisma.deliveryLocation.update({
      where: { id },
      data: {
        name: rest.name,
        basePrice: parseFloat(rest.basePrice),
        isActive: rest.isActive
      }
    })
    return NextResponse.json({ success: true, location })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update delivery location' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await prisma.deliveryLocation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete delivery location' }, { status: 500 })
  }
}
