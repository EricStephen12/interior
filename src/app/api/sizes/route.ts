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
