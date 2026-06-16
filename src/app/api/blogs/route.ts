import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { userId } = await auth()
    const authorId = userId || 'admin'

    const blog = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content || '',
        coverImg: data.coverImg || null,
        published: data.published ?? false,
        authorId,
      }
    })
    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json()
    const blog = await prisma.blogPost.update({ where: { id }, data: updateData })
    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
