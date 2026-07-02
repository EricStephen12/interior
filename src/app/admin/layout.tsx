import { 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  MessageSquare,
  Truck
} from 'lucide-react'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AdminMobileNav from "@/components/AdminMobileNav"

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
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Members', href: '/admin/users', icon: Users },
    { name: 'Support', href: '/admin/support', icon: MessageSquare },
    { name: 'Scanner', href: '/admin/scanner', icon: Settings },
    { name: 'Delivery', href: '/admin/delivery', icon: Truck },
  ]

  return (
    <div className="admin-layout-container">
      <AdminMobileNav />
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-bg"></div>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            SHARERS <br />
            <span className="admin-logo-sub">Admin Vault</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.name === 'Logout' ? '#' : item.href}
              className="admin-nav-item"
            >
              <item.icon className="admin-nav-icon" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-account-container">
             <UserButton />
             <span className="admin-account-text">Account</span>
          </div>
          <Link
            href="/"
            className="admin-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main pt-16 md:pt-0">
        <div className="admin-main-bg"></div>
        {children}
      </main>
    </div>
  )
}
