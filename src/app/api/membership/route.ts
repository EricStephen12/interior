import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'
import { syncUserWithClerk } from '@/lib/services/user'

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
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ user: null, orders: [] }, { status: 200 })

    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {}

    const clerkEmail = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          ...(clerkEmail ? [{ email: { equals: clerkEmail, mode: 'insensitive' as const } }] : [])
        ]
      },
      include: { 
        checkIns: { orderBy: { date: 'desc' } }
      }
    })

    if (user && user.clerkId !== userId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId }
      }).catch(() => {})
    }

    // Fallback: If user is not synced in DB yet, sync now
    if (!user && clerkUser) {
      const synced = await syncUserWithClerk(clerkUser)
      if (synced) {
        user = await prisma.user.findUnique({
          where: { id: synced.id },
          include: { 
            checkIns: { orderBy: { date: 'desc' } }
          }
        })
      }
    }

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const email = user.email

    const orders = await prisma.order.findMany({
      where: { 
        userEmail: { equals: email, mode: 'insensitive' }
      },
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

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let user;
    
    if (memberId) {
      // Admin scanning someone else's pass
      const callerUser = await prisma.user.findUnique({ where: { clerkId: userId } })
      if (callerUser?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized Admin' }, { status: 403 })
      
      user = await prisma.user.findUnique({
        where: { memberId },
        include: { checkIns: { orderBy: { date: 'desc' }, take: 1 } }
      })
    } else {
      // User scanning their own pass
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { checkIns: { orderBy: { date: 'desc' }, take: 1 } }
      })
    }

    if (!user) return NextResponse.json({ error: 'User/Pass not found in system.' }, { status: 404 })
    if (user.credits <= 0) {
      return NextResponse.json({ 
        error: 'Pass has 0 credits remaining. Please top up to enter.',
        noCredits: true,
        user: {
          name: user.name,
          email: user.email,
          credits: user.credits,
          memberId: user.memberId
        }
      }, { status: 400 })
    }

    const email = user.email

    // Double-tap guard: same member scanned twice within 2 minutes
    const lastCheckIn = user.checkIns[0]
    if (lastCheckIn) {
      const minutesSinceLast = (Date.now() - new Date(lastCheckIn.date).getTime()) / 60000
      if (minutesSinceLast < COOLDOWN_MINUTES) {
        return NextResponse.json({
          error: 'Pass was already scanned just now. Member is already checked in.',
          alreadyCheckedIn: true,
          user: {
            name: user.name,
            email: user.email,
            credits: user.credits,
            memberId: user.memberId
          }
        }, { status: 409 })
      }
    }

    // Determine if the member has an hourly pass or a day pass
    const latestOrder = await prisma.order.findFirst({
      where: {
        userEmail: { equals: email, mode: 'insensitive' },
        status: { in: ['COMPLETED', 'PAID', 'DELIVERED', 'PENDING_VERIFICATION'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    let isHourly = false
    let detectedPlanName = ''

    if (latestOrder) {
      let items: any[] = []
      if (Array.isArray(latestOrder.items)) {
        items = latestOrder.items
      } else if (typeof latestOrder.items === 'string') {
        try {
          const parsed = JSON.parse(latestOrder.items)
          items = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          items = [{ name: latestOrder.items }]
        }
      }

      for (const item of items) {
        const rawName = (item.name || '').trim()
        const lower = rawName.toLowerCase()
        if (lower.includes('hour') || lower.includes('hr') || lower.includes('session')) {
          isHourly = true
          detectedPlanName = rawName
          break
        } else if (lower.includes('day') || lower.includes('month') || lower.includes('pass')) {
          isHourly = false
          detectedPlanName = rawName
          break
        }
      }
    }

    if (detectedPlanName.includes('(') && detectedPlanName.includes(')')) {
      const match = detectedPlanName.match(/^(.*?)\s*\((.*?)\)$/)
      if (match) {
        const inside = match[2].trim()
        if (inside.toLowerCase().includes('hour') || inside.toLowerCase().includes('day') || inside.toLowerCase().includes('pass') || inside.toLowerCase().includes('session')) {
          detectedPlanName = inside
        } else {
          detectedPlanName = `${match[1].trim()} Pass`
        }
      }
    }

    const checkInLabel = isHourly ? 'Hourly Session' : 'Day Pass'

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { decrement: 1 },
        checkIns: { create: { protocol: protocol || `${checkInLabel} Check-in` } }
      },
      include: { checkIns: { orderBy: { date: 'desc' } } }
    })

    const credits = updatedUser.credits
    const unitLabel = credits === 1 ? (isHourly ? 'Hour' : 'Day') : (isHourly ? 'Hours' : 'Days')

    // Email alert exactly at 7 credits (First Warning)
    if (credits === EMAIL_THRESHOLD) {
      emailService.sendEmail({
        to: email,
        subject: `${credits} ${unitLabel.toLowerCase()} remaining — SHARERS GYM`,
        html: lowCreditEmail(updatedUser.name || 'Member', credits)
      }).catch(() => {})
    }

    // Final Email alert exactly at 2 credits (Final Warning)
    if (credits === 2) {
      emailService.sendEmail({
        to: email,
        subject: `FINAL WARNING: ${credits} ${unitLabel.toLowerCase()} left — SHARERS GYM`,
        html: lowCreditEmail(updatedUser.name || 'Member', credits)
      }).catch(() => {})
    }

    const orders = await prisma.order.findMany({
      where: { 
        userEmail: { equals: email, mode: 'insensitive' }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      orders,
      isHourly,
      passType: isHourly ? 'HOURLY PASS' : 'DAY PASS',
      planName: detectedPlanName || `${isHourly ? 'Hourly' : 'Day'} Pass`,
      unitLabel,
      creditsRemaining: credits,
      lowCredit: credits <= EMAIL_THRESHOLD
    })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
