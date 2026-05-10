import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

import { emailService } from '@/lib/services/email'

const COOLDOWN_MINUTES = 2
const EMAIL_THRESHOLD = 7
const SMS_THRESHOLD = 2

function lowCreditEmail(name: string, credits: number) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="font-size: 20px; font-weight: 800; color: #1a1a1a;">Hey ${name},</h2>
      <p style="color: #555; line-height: 1.6;">
        You have <strong>${credits} credit${credits !== 1 ? 's' : ''}</strong> remaining on your SHARERS pass.
        Top up soon to keep your access uninterrupted.
      </p>
      <a href="https://sharersgym.com/products" 
         style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1a1a1a; color: #fff; text-decoration: none; font-weight: 700; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
        TOP UP NOW
      </a>
      <p style="margin-top: 24px; color: #999; font-size: 12px;">— SHARERS GYM</p>
    </div>
  `
}

export async function GET() {
  try {
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        checkIns: { orderBy: { date: 'desc' } }
      }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const orders = await prisma.order.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ user, orders })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { action, protocol, memberId } = await req.json()
    if (action !== 'CHECK_IN') return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let user;
    
    if (memberId) {
      // Admin scanning someone else's pass
      const callerUser = await prisma.user.findUnique({ where: { email } })
      if (callerUser?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 403 })
      
      user = await prisma.user.findUnique({
        where: { memberId },
        include: { checkIns: { orderBy: { date: 'desc' }, take: 1 } }
      })
    } else {
      // User scanning their own pass
      user = await prisma.user.findUnique({
        where: { email },
        include: { checkIns: { orderBy: { date: 'desc' }, take: 1 } }
      })
    }

    if (!user) return NextResponse.json({ error: 'User/Pass not found' }, { status: 404 })
    if (user.credits <= 0) return NextResponse.json({ error: 'No credits remaining. Please top up your pass.' }, { status: 400 })

    // Double-tap guard: same member scanned twice within 2 minutes
    const lastCheckIn = user.checkIns[0]
    if (lastCheckIn) {
      const minutesSinceLast = (Date.now() - new Date(lastCheckIn.date).getTime()) / 60000
      if (minutesSinceLast < COOLDOWN_MINUTES) {
        return NextResponse.json({
          error: 'Just scanned — wait a moment before scanning again.',
          alreadyCheckedIn: true
        }, { status: 409 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { decrement: 1 },
        checkIns: { create: { protocol: protocol || 'Daily Protocol' } }
      },
      include: { checkIns: { orderBy: { date: 'desc' } } }
    })

    const credits = updatedUser.credits

    // Email alert exactly at 7 credits (First Warning)
    if (credits === EMAIL_THRESHOLD) {
      emailService.sendEmail({
        to: email,
        subject: `${credits} credits remaining — SHARERS GYM`,
        html: lowCreditEmail(updatedUser.name || 'Member', credits)
      }).catch(() => {})
    }

    // Final Email alert exactly at 2 credits (Final Warning)
    if (credits === 2) {
      emailService.sendEmail({
        to: email,
        subject: `FINAL WARNING: ${credits} credits left — SHARERS GYM`,
        html: lowCreditEmail(updatedUser.name || 'Member', credits)
      }).catch(() => {})
    }

    const orders = await prisma.order.findMany({
      where: { userEmail: email },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      orders,
      creditsRemaining: credits,
      lowCredit: credits <= EMAIL_THRESHOLD
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
