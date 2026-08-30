import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

const PAYMENT_SETTING_KEYS = [
  'payment_kingspay_enabled',
  'payment_kingspay_secret_key',
  'payment_kingspay_env',
  'payment_kingspay_app_url',
  'espees_exchange_rate',
  'payment_manual_enabled',
  'payment_manual_bank_name',
  'payment_manual_account_name',
  'payment_manual_account_number',
  'payment_manual_instructions',
] as const

const DEFAULT_PAYMENT_SETTINGS: Record<string, string> = {
  payment_kingspay_enabled: 'true',
  payment_kingspay_secret_key: process.env.KINGSPAY_SECRET_KEY || '',
  payment_kingspay_env: process.env.KINGSPAY_ENVIRONMENT || 'production',
  payment_kingspay_app_url: process.env.APP_URL || '',
  espees_exchange_rate: '2050',
  payment_manual_enabled: 'true',
  payment_manual_bank_name: 'Zenith Bank',
  payment_manual_account_name: 'SHARERS GYM ATELIER LTD',
  payment_manual_account_number: '1223456789',
  payment_manual_instructions: 'Please transfer the exact order amount. Use your Full Name or Phone Number as the payment reference.',
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rows = await prisma.storeSetting.findMany({
      where: { key: { in: [...PAYMENT_SETTING_KEYS] } }
    })

    const settings: Record<string, string> = { ...DEFAULT_PAYMENT_SETTINGS }
    for (const row of rows) {
      settings[row.key] = row.value
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    console.error('Failed to fetch payment settings:', error)
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
    }

    // Upsert each provided key into storeSetting using a single transaction
    const upsertOps = Object.entries(settings).map(([key, value]) => {
      const stringVal = String(value ?? '')
      return prisma.storeSetting.upsert({
        where: { key },
        update: { value: stringVal },
        create: { key, value: stringVal }
      })
    })

    if (upsertOps.length > 0) {
      await prisma.$transaction(upsertOps)
    }

    return NextResponse.json({ success: true, message: 'Payment settings saved successfully' })
  } catch (error: any) {
    console.error('Failed to save payment settings:', error)
    return NextResponse.json({ error: 'Failed to save payment settings' }, { status: 500 })
  }
}
