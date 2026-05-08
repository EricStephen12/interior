import prisma from '@/lib/prisma'

export async function syncUserWithClerk(clerkUser: any) {
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses[0].emailAddress
  const userCount = await prisma.user.count()
  const role = userCount === 0 ? 'ADMIN' : 'CUSTOMER'

  // First, try to find by clerkId
  let user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } })

  // If not found by clerkId, try to find by email and "claim" the account
  if (!user) {
    user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: { clerkId: clerkUser.id, name: clerkUser.fullName }
      })
    }
  }

  // If still not found, create it
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name: clerkUser.fullName,
        role: role as any,
        credits: 0,
        tier: 'NONE',
      }
    })
  } else {
    // If found, just update name/email
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        email,
        name: clerkUser.fullName
      }
    })
  }

  return user
}
