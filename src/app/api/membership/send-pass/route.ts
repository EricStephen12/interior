import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { emailService } from '@/lib/services/email'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to email your pass' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { qrCodeDataUrl, planName: overridePlanName } = body

    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {}

    const clerkEmail = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          ...(clerkEmail ? [{ email: { equals: clerkEmail, mode: 'insensitive' as const } }] : []),
        ],
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User membership profile not found' }, { status: 404 })
    }

    const memberId = user.memberId || user.id.slice(0, 8).toUpperCase()
    const userName = user.name || clerkUser?.fullName || 'Valued Member'
    const planName = overridePlanName || (user.tier === 'BLACK' ? 'VIP All-Access Membership' : `${user.credits} Session Pass`)
    const credits = user.credits || 0
    const tier = user.tier || 'STANDARD'

    // Send the Member Pass email via Resend
    const resendResult = await emailService.sendMemberPassEmail({
      userEmail: user.email,
      userName,
      memberId,
      planName,
      credits,
      tier,
      qrCodeDataUrl,
    })

    // Trigger Resend Automation Event
    await emailService.triggerResendEvent({
      name: 'member.pass_delivered',
      email: user.email,
      data: {
        memberId,
        userName,
        planName,
        credits,
        tier,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Pass and QR Code sent to ${user.email}`,
      email: user.email,
      resendId: (resendResult as any)?.data?.id,
    })
  } catch (error: any) {
    console.error('[API Send Pass Error]:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to email pass' },
      { status: 500 }
    )
  }
}
