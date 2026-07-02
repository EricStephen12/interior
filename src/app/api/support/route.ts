import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

// Helper: verify the caller is an ADMIN using the same fail-closed guard as the layout
async function requireAdmin() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    const isOwner = email === (process.env.ADMIN_EMAIL || 'sharersgymtest@gmail.com')

    if (user?.role !== 'ADMIN' && !isOwner) return null

    return user || { id: 'owner', email, role: 'ADMIN' }
  } catch (error) {
    console.error('Admin guard error:', error)
    return null // Fail closed on any error (DB failure, Clerk failure, etc)
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    if (!data.message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        email: data.email || null,
        name: data.name || null,
        message: data.message,
        chatHistory: data.chatHistory || null,
        source: data.source || 'CHAT',
        status: 'OPEN'
      }
    })

    return NextResponse.json({ success: true, ticket })
  } catch (error: any) {
    console.error('Support ticket error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create ticket' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const ticket = await prisma.supportTicket.findUnique({ where: { id } })
      return NextResponse.json({ ticket })
    }

    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const { id, status } = data
    
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    await prisma.supportTicket.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 })
  }
}

