import { NextResponse } from 'next/server'

const SYSTEM_PROMPTS: Record<string, string> = {
  product: 'You are a premium copywriter for SHARERS GYM. Enhance the given product description to sound confident, direct, and luxury. Keep it short (2-3 sentences). No fluff. Voice: raw, honest, premium.',
  blog: 'You are an editorial writer for SHARERS GYM. Enhance the given text to be engaging and compelling. Keep the same meaning but make it more editorial. Max 3 sentences. Voice: confident, real.',
  general: 'You are a copywriter for SHARERS GYM. Improve the given text to sound more professional and engaging while keeping it authentic. Max 3 sentences.'
}

export async function POST(req: Request) {
  try {
    const { text, type } = await req.json()
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: (SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.general) + ' CRITICAL: Return ONLY the raw enhanced text. Do not include any conversational filler, markdown formatting, JSON, or quotes.' },
          { role: 'user', content: `Enhance this text:\n\n"${text}"` }
        ],
        temperature: 0.7,
        max_tokens: 300,
      })
    })

    if (!res.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await res.json()
    let enhancedText = data.choices?.[0]?.message?.content?.trim() || text

    // Try to parse if it returned JSON accidentally
    try {
      if (enhancedText.startsWith('{') && enhancedText.endsWith('}')) {
        const parsed = JSON.parse(enhancedText)
        enhancedText = parsed.enhanced || parsed.text || parsed.description || enhancedText
      }
    } catch (e) {}

    // Clean up any surrounding quotes
    enhancedText = enhancedText.replace(/^["']|["']$/g, '').trim()

    return NextResponse.json({ enhanced: enhancedText })
  } catch {
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 })
  }
}
