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
    const size = await prisma.size.create({ data: { label } })
    return NextResponse.json({ success: true, size })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.size.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
