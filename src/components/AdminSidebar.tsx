'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FileText, 
  Users, 
  MessageSquare, 
  Palette, 
  QrCode, 
  Truck, 
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  CreditCard
} from 'lucide-react'
import { UserButton } from "@clerk/nextjs"
import { t } from '@/lib/theme'

export const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Theme Studio', href: '/admin/theme', icon: Palette },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Orders', href: '/admin/orders', icon: Package },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Members', href: '/admin/users', icon: Users },
  { name: 'Support', href: '/admin/support', icon: MessageSquare },
  { name: 'Scanner', href: '/admin/scanner', icon: QrCode },
  { name: 'Delivery', href: '/admin/delivery', icon: Truck },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (item: typeof adminNavItems[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    // Sidebar wrapper — bg & border from admin palette tokens
    <aside
      className="h-full hidden md:flex flex-col border-r relative shrink-0 select-none z-20"
      style={{
        width: t.admin.sidebar.width,
        backgroundColor: t.admin.sidebar.bg,
        borderColor: t.admin.sidebar.borderColor,
        color: t.colors.admin.text,
      }}
    >
      {/* Brand Header */}
      <div
        className="p-6 flex items-center justify-between border-b"
        style={{ borderColor: t.admin.sidebar.borderColor }}
      >
        <Link href="/admin" className="flex items-center gap-3 group">
          {/* Logo badge — indigo-tinted, rounded corners */}
          <div
            className="w-9 h-9 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"
            style={{
              borderRadius: t.radius.sm,
              backgroundColor: t.colors.admin.navActive,
              border: `${t.border.width.DEFAULT} solid ${t.colors.admin.navActiveBorder}`,
              color: t.colors.admin.iconActive,
              boxShadow: t.shadow.sm,
            }}
          >
            SG
          </div>
          <div>
            <div
              className="font-extrabold text-sm uppercase"
              style={{ letterSpacing: t.tracking.wide, color: t.colors.white }}
            >
              Sharers Gym
            </div>
            <div
              className="font-semibold uppercase flex items-center gap-1.5 mt-0.5"
              style={{ fontSize: t.fontSize.label, letterSpacing: t.tracking.widest, color: t.colors.admin.textMuted }}
            >
              {/* Active status dot */}
              <span
                style={{
                  width: t.admin.activeDot.size,
                  height: t.admin.activeDot.size,
                  borderRadius: t.admin.activeDot.borderRadius,
                  backgroundColor: t.colors.admin.success,
                  display: 'inline-block',
                }}
              />
              Admin Console
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Section label */}
        <div
          className="px-3 pb-2 font-bold uppercase"
          style={{ fontSize: t.fontSize.label, letterSpacing: t.tracking.widest, color: t.colors.admin.textMuted }}
        >
          Management
        </div>
        {adminNavItems.map((item) => {
          const active = isActive(item)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center justify-between transition-all"
              style={{
                padding: `${t.admin.nav.paddingYSm} ${t.admin.nav.paddingX}`,
                borderRadius: t.admin.nav.borderRadius,
                fontSize: t.admin.nav.fontSize,
                fontWeight: 600,
                transitionDuration: '200ms',
                // Active vs inactive coloring — from theme admin tokens
                backgroundColor: active ? t.colors.admin.navActive : 'transparent',
                color: active ? t.colors.white : t.colors.admin.textMuted,
                border: active
                  ? `${t.border.width.DEFAULT} solid ${t.colors.admin.navActiveBorder}`
                  : `${t.border.width.DEFAULT} solid ${t.border.color.transparent}`,
                boxShadow: active ? t.shadow.adminNav : 'none',
              }}
              // hover handled by Tailwind since inline style can't do hover
              // — still using className for hover states
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = t.colors.admin.navHover
                  ;(e.currentTarget as HTMLElement).style.color = t.colors.admin.text
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = t.colors.admin.textMuted
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="w-4 h-4 transition-colors"
                  style={{ color: active ? t.colors.admin.iconActive : t.colors.admin.textMuted }}
                />
                <span>{item.name}</span>
              </div>
              {active && (
                // Active indicator dot
                <div
                  className="animate-pulse"
                  style={{
                    width: t.admin.activeDot.size,
                    height: t.admin.activeDot.size,
                    borderRadius: t.admin.activeDot.borderRadius,
                    backgroundColor: t.colors.admin.iconActive,
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer / User Profile & Back to Storefront */}
      <div
        className="p-4 space-y-3 border-t"
        style={{
          backgroundColor: t.admin.footer.bg,
          borderColor: t.admin.sidebar.borderColor,
        }}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="flex flex-col">
              <span
                className="font-bold leading-tight"
                style={{ fontSize: t.fontSize.bodyXs, color: t.colors.admin.text }}
              >
                Admin User
              </span>
              <span
                className="flex items-center gap-1 font-medium"
                style={{ fontSize: t.fontSize.label, color: t.colors.admin.textMuted }}
              >
                <ShieldCheck className="w-3 h-3" style={{ color: t.colors.admin.success }} />
                Verified Admin
              </span>
            </div>
          </div>
        </div>

        {/* Back to Storefront */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full font-semibold transition-all"
          style={{
            padding: `${t.admin.nav.paddingYSm} 12px`,
            fontSize: t.fontSize.bodyXs,
            color: t.colors.admin.text,
            backgroundColor: t.colors.admin.navHover,
            border: `${t.border.width.DEFAULT} solid rgba(71,85,105,0.6)`,
            borderRadius: t.admin.nav.borderRadius,
            boxShadow: t.shadow.sm,
            transitionDuration: t.transition.fast,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(30,41,59,1)'
            ;(e.currentTarget as HTMLElement).style.color = t.colors.white
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = t.colors.admin.navHover
            ;(e.currentTarget as HTMLElement).style.color = t.colors.admin.text
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Storefront
        </Link>
      </div>
    </aside>
  )
}
