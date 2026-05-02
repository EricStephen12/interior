import Link from 'next/link'
import { 
  ShoppingBag, 
  FileText, 
  Users, 
  Package, 
  QrCode,
  CheckCircle2
} from 'lucide-react'

import prisma from '@/lib/prisma'

export default async function AdminDashboard() {
  const productCount = await prisma.product.count()
  const blogCount = await prisma.blogPost.count()
  const userCount = await prisma.user.count()
  const orderCount = await prisma.order.count()
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  const stats = [
    { name: 'Total Orders', value: orderCount.toString(), icon: ShoppingBag },
    { name: 'Total Products', value: productCount.toString(), icon: Package },
    { name: 'Total Users', value: userCount.toString(), icon: Users },
  ]

  const quickActions = [
    { name: 'Access Scanner', href: '/admin/scanner', icon: QrCode },
    { name: 'Manage Products', href: '/admin/products', icon: Package },
    { name: 'Manage Blogs', href: '/admin/blogs', icon: FileText },
  ]

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">
          Command <span className="text-accent italic font-light lowercase">Center.</span>
        </h1>
        <p className="admin-subtitle">Manage the SHARERS ecosystem.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((item) => (
          <div key={item.name} className="admin-stat-card">
            <div className="admin-stat-header">
              <p className="admin-stat-title">{item.name}</p>
              <item.icon className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-end justify-between">
              <p className="admin-stat-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="admin-section-title">Core Tools</h3>
        <div className="admin-actions-grid">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="admin-action-card"
            >
              <div className="admin-action-icon-wrapper">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="admin-action-text">
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders & System Status */}
      <div className="admin-status-grid">
        <div className="admin-pulse-card">
          <h3 className="admin-pulse-header">
            <ShoppingBag className="w-4 h-4 text-accent" /> Recent Transactions
          </h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-4 border border-primary/5 bg-white">
                <div>
                  <p className="text-xs font-bold text-primary">{order.userEmail}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-playfair font-black text-primary tabular-nums">₦{order.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-accent uppercase tracking-widest flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3"/> {order.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-[10px] uppercase tracking-widest text-text-muted border border-dashed border-primary/10">
                No recent transactions
              </div>
            )}
          </div>
        </div>

        <div className="admin-status-card">
          <h3 className="admin-section-title">System Status</h3>
          <div className="admin-status-list">
            <div className="admin-status-item">
              <span className="admin-status-label">Database</span>
              <span className="admin-status-indicator" title="Healthy"></span>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Auth (Clerk)</span>
              <span className="admin-status-indicator" title="Healthy"></span>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Storage</span>
              <span className="admin-status-indicator" title="Healthy"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
