import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  try {
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        checkIns: {
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Membership GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { action, protocol, memberId } = await req.json()

    if (action === 'CHECK_IN') {
      const clerkUser = await currentUser()
      const email = clerkUser?.emailAddresses[0]?.emailAddress

      if (!email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      if (user.credits <= 0) return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })

      // Deduct credit and add history
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { decrement: 1 },
          checkIns: {
            create: {
              protocol: protocol || 'Daily Protocol'
            }
          }
        },
        include: {
          checkIns: {
            orderBy: { date: 'desc' }
          }
        }
      })

      return NextResponse.json({ success: true, user: updatedUser })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Membership POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
