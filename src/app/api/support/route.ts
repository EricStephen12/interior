import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
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
