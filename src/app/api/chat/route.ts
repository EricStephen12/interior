import { NextResponse } from 'next/server'

const SYSTEM_MESSAGE = `You are the SHARERS GYM customer support assistant. Be helpful, direct, and professional.

Key info:
- Premium fitness gym in Lagos, Nigeria
- Digital pass credit system for memberships
- Products: Memberships, Training, Recovery, Apparel, Nutrition
- Hours: Mon-Fri 5AM-11PM, Sat 6AM-10PM, Sun 7AM-8PM
- Contact: ops@sharersgym.com
- Dashboard at /dashboard, Products at /products, Sign in at /sign-in

Rules: Be concise (2-3 sentences max). If unsure, direct to ops@sharersgym.com. Never make up pricing.`

const FALLBACK = "Our support team is currently offline. Please reach out at ops@sharersgym.com and we'll get back to you shortly."

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ reply: FALLBACK })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_MESSAGE },
          ...(history || []).slice(-8),
          { role: 'user', content: message }
        ],
        temperature: 0.6,
        max_tokens: 200,
      })
    })

    if (!res.ok) return NextResponse.json({ reply: "I'm having trouble right now. Please try again or reach us at ops@sharersgym.com." })

    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content?.trim() || "Sorry, try again." })
  } catch {
    return NextResponse.json({ reply: "Something went wrong. Contact us at ops@sharersgym.com." })
  }
}
