import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: [
            'payment_kingspay_enabled',
            'espees_exchange_rate',
            'payment_manual_enabled',
            'payment_manual_bank_name',
            'payment_manual_account_name',
            'payment_manual_account_number',
            'payment_manual_instructions',
          ]
        }
      }
    })

    const map: Record<string, string> = {}
    for (const r of rows) {
      map[r.key] = r.value
    }

    const kingspayEnabled = map['payment_kingspay_enabled'] !== 'false'
    const manualEnabled = map['payment_manual_enabled'] !== 'false'
    const espeesExchangeRate = parseFloat(map['espees_exchange_rate'] || '2050') || 2050

    const manualBank = {
      bankName: map['payment_manual_bank_name'] || 'Zenith Bank',
      accountName: map['payment_manual_account_name'] || 'SHARERS GYM ATELIER LTD',
      accountNumber: map['payment_manual_account_number'] || '1223456789',
      instructions: map['payment_manual_instructions'] || 'Please transfer the exact order amount. Use your Full Name or Phone Number as the payment reference.',
    }

    return NextResponse.json({
      kingspayEnabled,
      manualEnabled,
      espeesExchangeRate,
      manualBank,
    })
  } catch (error) {
    console.error('Failed to get public payment methods:', error)
    return NextResponse.json({
      kingspayEnabled: true,
      manualEnabled: true,
      espeesExchangeRate: 2050,
      manualBank: {
        bankName: 'Zenith Bank',
        accountName: 'SHARERS GYM ATELIER LTD',
        accountNumber: '1223456789',
        instructions: 'Please transfer the exact order amount.',
      }
    })
  }
}
