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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses[0]?.emailAddress

  // Find user by clerkId or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: userId || 'undefined' },
        { email: email || 'undefined' }
      ]
    }
  })

  // HARD OVERRIDE FOR THE OWNER
  const isOwner = email === 'sharersgymtest@gmail.com'
  const isAdmin = user?.role === 'ADMIN' || isOwner

  if (!isAdmin) {
    console.log(`ACCESS DENIED for ${email}. Role in DB: ${user?.role}`)
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
      <main className="admin-main">
        <div className="admin-main-bg"></div>
        {children}
      </main>
    </div>
  )
}
