import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return NextResponse.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length })
  } catch (error) {
    console.error('GET /api/reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in to leave a review' }, { status: 401 })
    }

    const { productId, rating, comment } = await req.json()

    if (!productId || !rating || !comment?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    // Prevent duplicate reviews per user per product
    const existing = await prisma.review.findFirst({
      where: { productId, userEmail: user.primaryEmailAddress?.emailAddress || '' }
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 })
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userEmail: user.primaryEmailAddress?.emailAddress || 'anonymous',
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
        rating: parseInt(rating.toString()),
        comment: comment.trim()
      }
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('POST /api/reviews error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
