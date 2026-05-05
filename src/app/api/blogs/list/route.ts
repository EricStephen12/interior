import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ blogs })
  } catch {
    return NextResponse.json({ blogs: [] })
  }
}
