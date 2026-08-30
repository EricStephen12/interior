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

  // Look up user by clerkId in DB first (extremely fast local check)
  let user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  let email = user?.email || undefined

  // Fallback: If not in DB yet, query Clerk API and sync
  if (!user) {
    try {
      const clerkUser = await currentUser()
      email = clerkUser?.emailAddresses[0]?.emailAddress
      if (clerkUser) {
        user = await prisma.user.findUnique({
          where: { email: email || 'undefined' }
        })
        if (user) {
          // Sync clerkId
          user = await prisma.user.update({
            where: { id: user.id },
            data: { clerkId: userId }
          })
        }
      }
    } catch (error) {
      console.error("Clerk API Error fetching user details:", error)
    }
  }

  // HARD OVERRIDE FOR THE OWNER
  const isOwner = email === (process.env.ADMIN_EMAIL || 'sharersgymtest@gmail.com')
  const isAdmin = user?.role === 'ADMIN' || isOwner

  if (!isAdmin) {
    console.log(`ACCESS DENIED for ${email || 'unknown'}. Role in DB: ${user?.role}`)
    redirect('/')
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
