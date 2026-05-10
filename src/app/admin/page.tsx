import Link from 'next/link'
import { 
  ShoppingBag, 
  FileText, 
  Users, 
  Package, 
  QrCode,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Activity,
  MessageSquare
} from 'lucide-react'

import prisma from '@/lib/prisma'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const params = await searchParams;
  const filter = params.filter || 'all-time';

  let dateFilter = {};
  const now = new Date();
  if (filter === 'daily') {
    dateFilter = { gte: new Date(now.setHours(0, 0, 0, 0)) };
  } else if (filter === 'weekly') {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    dateFilter = { gte: lastWeek };
  } else if (filter === 'monthly') {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    dateFilter = { gte: lastMonth };
  }

  const dateQuery = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
  const checkInQuery = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

  const productCount = await prisma.product.count({ where: dateQuery })
  const blogCount = await prisma.blogPost.count({ where: dateQuery })
  const userCount = await prisma.user.count({ where: dateQuery })
  const orderCount = await prisma.order.count({ where: dateQuery })
  const totalRevenue = await prisma.order.aggregate({ where: dateQuery, _sum: { totalAmount: true } })
  const totalCheckIns = await prisma.checkIn.count({ where: checkInQuery })
  
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    where: dateQuery
  })
  const recentMembers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { name: true, email: true, tier: true, credits: true, createdAt: true },
    where: dateQuery
  })

  // @ts-ignore
  const ticketCount = prisma.supportTicket ? await prisma.supportTicket.count({ where: { status: 'OPEN', ...dateQuery } }) : 0
  
  const stats = [
    { name: 'Revenue', value: `₦${(totalRevenue._sum.totalAmount || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { name: 'Orders', value: orderCount.toString(), icon: ShoppingBag, color: 'text-accent' },
    { name: 'Pending Support', value: ticketCount.toString(), icon: MessageSquare, color: 'text-red-500' },
    { name: 'Members', value: userCount.toString(), icon: Users, color: 'text-blue-500' },
    { name: 'Check-ins', value: totalCheckIns.toString(), icon: Activity, color: 'text-purple-500' },
    { name: 'Articles', value: blogCount.toString(), icon: FileText, color: 'text-pink-500' },
  ]

  const quickActions = [
    { name: 'Access Scanner', href: '/admin/scanner', icon: QrCode },
    { name: 'Support Desk', href: '/admin/support', icon: MessageSquare },
    { name: 'Manage Products', href: '/admin/products', icon: Package },
    { name: 'Manage Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'View Members', href: '/admin/users', icon: Users },
  ]

  return (
    <div className="admin-page-container">
      <div className="admin-header flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="admin-title">
            Admin <span className="text-accent italic font-light lowercase">Registry.</span>
          </h1>
          <p className="admin-subtitle">Manage the SHARERS ecosystem.</p>
        </div>
        
        {/* Analytics Filter */}
        <div className="flex bg-white border border-primary/5 p-1">
          {[
            { label: 'Today', value: 'daily' },
            { label: '7 Days', value: 'weekly' },
            { label: '30 Days', value: 'monthly' },
            { label: 'All-Time', value: 'all-time' }
          ].map((f) => (
            <Link
              key={f.value}
              href={`/admin?filter=${f.value}`}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                filter === f.value 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-muted hover:text-primary hover:bg-secondary/50'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-4 sm:p-6 border border-primary/5 group hover:border-accent/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
              <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
            </div>
            <p className="text-lg sm:text-2xl font-black text-primary tracking-tight tabular-nums">{item.value}</p>
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

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Orders */}
        <div className="admin-pulse-card">
          <h3 className="admin-pulse-header">
            <ShoppingBag className="w-4 h-4 text-accent" /> Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 sm:p-4 border border-primary/5 bg-white">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-primary truncate">{order.userEmail}</p>
                  <p className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs sm:text-sm font-black text-primary tabular-nums">₦{order.totalAmount.toLocaleString()}</p>
                  <p className="text-[9px] sm:text-[10px] text-accent uppercase tracking-widest flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3"/> {order.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-[10px] uppercase tracking-widest text-text-muted border border-dashed border-primary/10">
                No recent transactions
              </div>
            )}
          </div>
        </div>

        {/* Recent Members */}
        <div className="admin-pulse-card">
          <h3 className="admin-pulse-header">
            <Users className="w-4 h-4 text-accent" /> New Members
          </h3>
          <div className="space-y-3">
            {recentMembers.length > 0 ? recentMembers.map((member, i) => (
              <div key={i} className="flex justify-between items-center p-3 sm:p-4 border border-primary/5 bg-white">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-primary truncate">{member.name || 'Unnamed'}</p>
                  <p className="text-[9px] sm:text-[10px] text-text-muted truncate">{member.email}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className={`text-[8px] sm:text-[9px] font-black px-2 py-0.5 uppercase tracking-widest ${
                    member.tier === 'BLACK' ? 'bg-primary text-white' :
                    member.tier === 'NONE' ? 'bg-slate-100 text-slate-400' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {member.tier}
                  </span>
                  <p className="text-[9px] text-text-muted mt-1 flex items-center justify-end gap-1">
                    <CreditCard className="w-2.5 h-2.5" /> {member.credits} credits
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-[10px] uppercase tracking-widest text-text-muted border border-dashed border-primary/10">
                No members yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
