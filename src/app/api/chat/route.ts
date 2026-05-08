import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const FALLBACK = "Our support team is currently offline. Please reach out at ops@sharersgym.com and we'll get back to you shortly."

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ reply: FALLBACK })

    // Fetch real-time data from DB to prevent "old data" issues
    const [products, deliveryZones] = await Promise.all([
      prisma.product.findMany({ select: { name: true, price: true } }),
      prisma.deliveryLocation.findMany({ where: { isActive: true } })
    ]);

    const productsList = products.map(p => `${p.name} (₦${p.price.toLocaleString()})`).join(', ');
    const deliveryList = deliveryZones.map(d => `${d.name}: ₦${d.basePrice.toLocaleString()}`).join(', ');

    const systemPrompt = `You are the SHARERS GYM customer support assistant. Be helpful, direct, and elite.
Today's Date: ${new Date().toLocaleDateString()}

LATEST STORE DATA:
- Products: ${productsList || "Memberships, Apparel, Training"}
- Delivery Methods: ${deliveryList || "Pickup at Gym (Free)"}

CORE INFO:
- Premium fitness gym in Lagos, Nigeria
- Digital pass credit system for memberships
- Hours: Mon-Fri 5AM-11PM, Sat 6AM-10PM, Sun 7AM-8PM
- Contact: support@sharersgym.com
- Dashboard at /dashboard, Products at /products

RULES:
1. Be concise (2 sentences max). 
2. Use real data provided above. 
3. If a customer is frustrated or the query is complex, tell them you are opening a support ticket for the admin and direct them to /contact.
4. Never make up data.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-8),
          { role: 'user', content: message }
        ],
        temperature: 0.5,
        max_tokens: 200,
      })
    })

    if (!res.ok) return NextResponse.json({ reply: "I'm having trouble right now. Please try again or reach us at ops@sharersgym.com." })

    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content?.trim() || "Sorry, try again." })
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: "Something went wrong. Contact us at ops@sharersgym.com." })
  }
}
