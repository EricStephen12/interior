import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AdminMobileNav from "@/components/AdminMobileNav"
import AdminSidebar from "@/components/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/')
  }

  let clerkUser = null
  try {
    clerkUser = await currentUser()
  } catch (err) {
    console.error("Clerk currentUser error:", err)
  }

  const clerkEmail = (clerkUser?.emailAddresses?.[0]?.emailAddress || '').toLowerCase()

  // Look up user by clerkId in DB first
  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  // If not found by clerkId, look up by email and sync clerkId
  if (!user && clerkEmail) {
    user = await prisma.user.findFirst({
      where: { email: { equals: clerkEmail, mode: 'insensitive' } }
    })
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: userId }
      }).catch(() => user)
    }
  }

  const email = (user?.email || clerkEmail).toLowerCase()
  const isOwner = email === (process.env.ADMIN_EMAIL || 'sharersgymtest@gmail.com').toLowerCase()
  const isAdmin = user?.role === 'ADMIN' || isOwner

  if (!isAdmin) {
    console.log(`ACCESS DENIED for ${email || 'unknown'}. Role in DB: ${user?.role}`)
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden font-sans">
      <AdminMobileNav />
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-[#fafafa] relative min-w-0">
        {children}
      </main>
    </div>
  )
}
