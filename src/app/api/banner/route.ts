import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: { key: { in: ['banner_enabled', 'banner_message', 'banner_code'] } }
    })

    const map = settings.reduce((acc: any, s) => ({ ...acc, [s.key]: s.value }), {})

    return NextResponse.json({
      enabled: map.banner_enabled === 'true',
      message: map.banner_message || '',
      code: map.banner_code || ''
    })
  } catch {
    return NextResponse.json({ enabled: false, message: '', code: '' })
  }
}
