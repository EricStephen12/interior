import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { emailService } from '@/lib/services/email'

// GET — check if current user has submitted a fitness profile
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ hasProfile: false }, { status: 200 })

    const clerkUser = await currentUser().catch(() => null)
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || ''

    let profile = await (prisma as any).fitnessProfile.findUnique({
      where: { userId },
    }).catch(() => null)

    if (!profile && userEmail) {
      profile = await (prisma as any).fitnessProfile.findFirst({
        where: { userEmail },
      }).catch(() => null)
    }

    return NextResponse.json({ hasProfile: !!profile, profile })
  } catch (err) {
    console.error('[FitnessProfile GET] Error:', err)
    return NextResponse.json({ hasProfile: false }, { status: 200 })
  }
}

// POST — submit fitness profile
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const clerkUser = await currentUser().catch(() => null)
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || ''
    const userName = clerkUser?.fullName || clerkUser?.firstName || 'Member'

    const body = await req.json()

    // 1. Save or update the FitnessProfile in database
    const profile = await (prisma as any).fitnessProfile.upsert({
      where: { userId },
      update: {
        userEmail: userEmail || body.userEmail || undefined,
        userName: userName || body.userName || undefined,
        ...body,
        updatedAt: new Date(),
      },
      create: {
        userId,
        userEmail: userEmail || body.userEmail || '',
        userName: userName || body.userName || 'Member',
        ...body,
      },
    })

    // 2. Sync phone number to User record if provided
    if (userEmail && body.phone) {
      await prisma.user.updateMany({
        where: { email: userEmail },
        data: { phone: body.phone },
      }).catch(() => {})
    }

    // 3. Dispatch intake notification email to gym management
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'sharersmall@gmail.com'
      const goalsList = Array.isArray(body.fitnessGoals) ? body.fitnessGoals.join(', ') : 'Not specified'

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="border-bottom: 2px solid #f20d0d; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="margin: 0; color: #0f172a; font-size: 18px; text-transform: uppercase;">📋 New Client Fitness Profile</h2>
            <p style="margin: 4px 0 0; color: #64748b; font-size: 12px;">Submitted via Sharers Gym Onboarding</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Client Name:</td><td>${userName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${userEmail}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${body.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Age / Gender:</td><td>${body.age || 'N/A'} / ${body.gender || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Height / Weight:</td><td>${body.height || 'N/A'} / ${body.weight || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Experience Level:</td><td>${body.fitnessLevel || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Membership Type:</td><td>${body.membershipType || 'Standard'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Preferred Time:</td><td>${body.preferredTrainingTime || 'Flexible'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Fitness Goals:</td><td>${goalsList}</td></tr>
            ${body.specificGoal ? `<tr><td style="padding: 6px 0; font-weight: bold;">Specific Goal:</td><td>${body.specificGoal}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; font-weight: bold;">Past Injury / Pain:</td><td>${body.currentPainOrInjury ? `⚠️ YES (${body.painDetails || 'No details'})` : 'No'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Doctor Limitation:</td><td>${body.doctorAdviceLimit ? `⚠️ YES (${body.doctorAdviceDetails || 'No details'})` : 'No'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Medical Condition:</td><td>${body.medicalCondition ? `⚠️ YES (${body.medicalDetails || 'No details'})` : 'No'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Medication:</td><td>${body.currentMedication ? `YES (${body.medicationDetails || 'No details'})` : 'No'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Allergies:</td><td>${body.allergies ? `⚠️ YES (${body.allergyDetails || 'No details'})` : 'No'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Signed By:</td><td>${body.signatureName || userName}</td></tr>
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <a href="https://sharersgym.com/admin/fitness-profiles" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 10px 20px; font-size: 11px; font-weight: bold; text-decoration: none; border-radius: 4px; text-transform: uppercase;">
              View in Admin Dashboard
            </a>
          </div>
        </div>
      `

      await emailService.sendEmail({
        to: adminEmail,
        subject: `📋 New Member Fitness Profile: ${userName} (${userEmail})`,
        html: emailHtml,
      })
    } catch (mailErr) {
      console.warn('[FitnessProfile Email] Could not send admin notification:', mailErr)
    }

    return NextResponse.json({ success: true, profile })
  } catch (err) {
    console.error('[FitnessProfile POST] Error:', err)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
