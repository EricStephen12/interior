import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const revalidate = 60

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: { 
        key: { 
          in: [
            'banner_enabled', 'banner_message', 'banner_code',
            'section.banner.enabled', 'section.banner.message', 'section.banner.code'
          ] 
        } 
      }
    })

    const map = settings.reduce((acc: any, s) => ({ ...acc, [s.key]: s.value }), {})

    const enabled = map['section.banner.enabled'] !== undefined 
      ? map['section.banner.enabled'] === 'true' 
      : map.banner_enabled === 'true'

    const message = map['section.banner.message'] || map.banner_message || ''
    const code = map['section.banner.code'] || map.banner_code || ''

    return NextResponse.json({
      enabled,
      message,
      code
    })
  } catch {
    return NextResponse.json({ enabled: false, message: '', code: '' })
  }
}
