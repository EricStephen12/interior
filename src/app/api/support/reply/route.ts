import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { ticketId, message } = data

    if (!ticketId || !message) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Update replies array
    const currentReplies = (ticket.replies as any[]) || []
    const newReplies = [...currentReplies, { 
      content: message, 
      role: 'admin', 
      date: new Date().toISOString() 
    }]

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { 
        replies: newReplies,
        status: 'IN_PROGRESS'
      }
    })

    // Send email to user if email exists
    if (ticket.email) {
      await emailService.sendEmail({
        to: ticket.email,
        subject: 'SHARERS GYM Support: New Message Regarding Your Ticket',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eee; padding: 40px;">
            <h2 style="font-size: 18px; font-weight: 900; letter-spacing: 2px; color: #1a1a1a; text-transform: uppercase; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Support Protocol</h2>
            <p style="color: #444; line-height: 1.6; margin-top: 24px;">Hi ${ticket.name || 'Member'},</p>
            <p style="color: #444; line-height: 1.6;">Our team has replied to your inquiry:</p>
            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #6366f1; margin: 24px 0; font-style: italic;">
              "${message}"
            </div>
            <p style="color: #444; line-height: 1.6;">You can view this and reply directly by opening the chat on <a href="https://sharersgym.com" style="color: #6366f1; font-weight: bold;">sharersgym.com</a>.</p>
            <p style="margin-top: 40px; font-size: 10px; font-weight: 900; color: #999; letter-spacing: 4px; text-transform: uppercase;">SHARERS GYM • Lagos</p>
          </div>
        `
      }).catch(err => console.error('Email reply error:', err))
    }

    return NextResponse.json({ success: true, ticket: updatedTicket })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
