import { 
  ShoppingBag, 
  FileText, 
  Users, 
  Settings, 
  LayoutDashboard,
  LogOut,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Members', href: '/admin/users', icon: Users },
    { name: 'Scanner', href: '/admin/scanner', icon: Settings },
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
