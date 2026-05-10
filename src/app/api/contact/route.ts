import { NextResponse } from 'next/server'
import { emailService } from '@/lib/services/email'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, phone, subject, message } = data

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a1a; margin-bottom: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">New Contact Submission</h2>
        <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef;">
          <p style="margin-bottom: 12px; color: #495057;"><strong>Name:</strong> ${name}</p>
          <p style="margin-bottom: 12px; color: #495057;"><strong>Email:</strong> ${email}</p>
          <p style="margin-bottom: 12px; color: #495057;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p style="margin-bottom: 12px; color: #495057;"><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e9ecef;">
            <p style="margin-bottom: 8px; color: #495057; font-weight: bold;">Message:</p>
            <p style="color: #212529; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      </div>
    `

    await emailService.sendEmail({
      to: process.env.CONTACT_EMAIL || 'support@sharersgym.com', 
      subject: `[Contact Form] ${subject} - ${name}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
