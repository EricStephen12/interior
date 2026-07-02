import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser, auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    const isOwner = email === (process.env.ADMIN_EMAIL || 'sharersgymtest@gmail.com')

    if (user?.role !== 'ADMIN' && !isOwner) return null

    return user || { id: 'owner', email, role: 'ADMIN' }
  } catch (error) {
    console.error('Admin guard error:', error)
    return null
  }
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const settings = await prisma.storeSetting.findMany()
    const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {})
    return NextResponse.json({ settings: settingsMap })
  } catch (error: any) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const setting = await prisma.storeSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })

    return NextResponse.json({ success: true, setting })
  } catch (error: any) {
    console.error('Update setting error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update setting' }, { status: 500 })
  }
}
