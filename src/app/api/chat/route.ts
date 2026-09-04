import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const FALLBACK = "Our support team is currently offline. Please reach out at sharersmall@gmail.com and we'll get back to you shortly."

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })
    if (typeof message !== 'string' || message.length > 500) return NextResponse.json({ error: 'Message too long' }, { status: 400 })

    // Cap and validate history to prevent unbounded payloads being forwarded to Groq
    const MAX_HISTORY = 8
    const MAX_HISTORY_MSG_LENGTH = 500
    const safeHistory = Array.isArray(history)
      ? history
          .slice(-MAX_HISTORY) // Keep only the last N messages
          .filter((h: any) =>
            h &&
            typeof h === 'object' &&
            ['user', 'assistant'].includes(h.role) &&
            typeof h.content === 'string'
          )
          .map((h: any) => ({
            role: h.role,
            content: String(h.content).substring(0, MAX_HISTORY_MSG_LENGTH) // Truncate each message
          }))
      : []


    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ reply: FALLBACK })

    // Fetch real-time data from DB to prevent "old data" issues
    const [products, deliveryZones, emailSetting, phoneSetting] = await Promise.all([
      prisma.product.findMany({ select: { name: true, price: true } }),
      prisma.deliveryLocation.findMany({ where: { isActive: true } }),
      prisma.storeSetting.findUnique({ where: { key: 'section.footer.email' } }),
      prisma.storeSetting.findUnique({ where: { key: 'section.footer.phone' } })
    ]);

    const activeEmail = emailSetting?.value || 'sharersmall@gmail.com';
    const activePhone = phoneSetting?.value || '+234 808 906 2085';

    const productsList = products.map((p: any) => `${p.name} (₦${p.price.toLocaleString()})`).join(', ');
    const deliveryList = deliveryZones.map((d: any) => `${d.name}: ₦${d.basePrice.toLocaleString()}`).join(', ');

    const systemPrompt = `You are the SHARERS GYM customer support assistant. Be helpful, direct, and elite.
Today's Date: ${new Date().toLocaleDateString()}

LATEST STORE DATA:
- Products: ${productsList || "Memberships, Apparel, Training"}
- Delivery Methods: ${deliveryList || "Pickup at Gym (Free)"}

CORE INFO:
- Premium fitness gym in Lagos, Nigeria
- Digital pass credit system for memberships
- Hours: Mon-Fri 5AM-11PM, Sat 6AM-10PM, Sun 7AM-8PM
- Email: ${activeEmail}
- Phone: ${activePhone}
- Dashboard at /dashboard, Products at /products

RULES:
1. Be concise (2 sentences max). 
2. Use real data provided above. 
3. If a customer is frustrated or the query is complex, tell them you are opening a support ticket for the admin and direct them to /contact.
4. Never make up data.`

    const candidateModels = ['groq/compound-mini', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b']
    let reply = ''

    for (const model of candidateModels) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...(history || []).slice(-8),
              { role: 'user', content: message }
            ],
            temperature: 0.5,
            max_tokens: 200,
          })
        })

        if (res.ok) {
          const data = await res.json()
          reply = data.choices?.[0]?.message?.content?.trim() || ''
          if (reply) break
        }
      } catch (err) {
        console.warn(`[Chat AI] Model ${model} failed, trying next:`, err)
      }
    }

    if (!reply) {
      return NextResponse.json({ reply: "I'm having trouble right now. Please try again or reach us at sharersmall@gmail.com." })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: "Something went wrong. Contact us at sharersmall@gmail.com." })
  }
}
