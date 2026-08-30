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

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 })
    }

    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true, count: updates.length })
  } catch (error: any) {
    console.error('Batch update settings error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
  }
}
