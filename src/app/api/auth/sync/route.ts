import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { syncUserWithClerk } from '@/lib/services/user'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await syncUserWithClerk(user)
    return NextResponse.json({ user: dbUser })
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
