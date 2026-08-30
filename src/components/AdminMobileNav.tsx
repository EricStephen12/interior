'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react'
import { UserButton } from "@clerk/nextjs"
import { adminNavItems } from './AdminSidebar'
import { t } from '@/lib/theme'

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (item: typeof adminNavItems[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 backdrop-blur-md"
        style={{
          height: t.spacing.adminHeaderHeight,
          backgroundColor: t.admin.sidebar.bg,
          borderBottom: `${t.border.width.DEFAULT} solid ${t.admin.sidebar.borderColor}`,
          zIndex: t.zIndex.adminMobileBar,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo badge */}
          <div
            className="w-8 h-8 flex items-center justify-center font-black text-xs"
            style={{
              borderRadius: t.radius.sm,
              backgroundColor: t.colors.admin.navActive,
              border: `${t.border.width.DEFAULT} solid ${t.colors.admin.navActiveBorder}`,
              color: t.colors.admin.iconActive,
            }}
          >
            SG
          </div>
          <div>
            <span
              className="font-bold uppercase block"
              style={{ fontSize: t.fontSize.bodyXs, letterSpacing: t.tracking.wide, color: t.colors.white }}
            >
              Sharers Gym
            </span>
            <span
              className="font-medium"
              style={{ fontSize: t.fontSize.label, letterSpacing: t.tracking.wide, color: t.colors.admin.textMuted }}
            >
              Admin Console
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 transition-colors"
          style={{ color: t.colors.admin.text, borderRadius: t.radius.sm }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.colors.admin.navHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: t.zIndex.adminBackdrop }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar Drawer */}
      <div
        className="md:hidden fixed inset-y-0 left-0 flex flex-col"
        style={{
          width: t.admin.sidebar.widthDrawer,
          backgroundColor: t.admin.sidebar.bg,
          borderRight: `${t.border.width.DEFAULT} solid ${t.admin.sidebar.borderColor}`,
          zIndex: t.zIndex.adminDrawer,
          boxShadow: t.shadow['2xl'],
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: `transform 300ms ease-in-out`,
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{
            height: t.spacing.adminHeaderHeight,
            borderBottom: `${t.border.width.DEFAULT} solid ${t.admin.sidebar.borderColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center font-black text-xs"
              style={{
                borderRadius: t.radius.sm,
                backgroundColor: t.colors.admin.navActive,
                border: `${t.border.width.DEFAULT} solid ${t.colors.admin.navActiveBorder}`,
                color: t.colors.admin.iconActive,
              }}
            >
              SG
            </div>
            <div>
              <span
                className="font-bold uppercase block"
                style={{ fontSize: t.fontSize.bodyXs, letterSpacing: t.tracking.wide, color: t.colors.white }}
              >
                Sharers Gym
              </span>
              <span
                className="font-medium"
                style={{ fontSize: t.fontSize.label, color: t.colors.admin.textMuted }}
              >
                Admin Console
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 transition-colors"
            style={{ color: t.colors.admin.textMuted, borderRadius: t.radius.sm }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = t.colors.admin.navHover
              ;(e.currentTarget as HTMLElement).style.color = t.colors.white
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = t.colors.admin.textMuted
            }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
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
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between transition-all"
                style={{
                  padding: `${t.admin.nav.paddingYLg} ${t.admin.nav.paddingX}`,
                  borderRadius: t.admin.nav.borderRadius,
                  fontSize: t.admin.nav.fontSize,
                  fontWeight: 600,
                  transitionDuration: '200ms',
                  backgroundColor: active ? t.colors.admin.navActive : 'transparent',
                  color: active ? t.colors.white : t.colors.admin.textMuted,
                  border: active
                    ? `${t.border.width.DEFAULT} solid ${t.colors.admin.navActiveBorder}`
                    : `${t.border.width.DEFAULT} solid ${t.border.color.transparent}`,
                }}
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
                <div className="flex items-center gap-3.5">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: active ? t.colors.admin.iconActive : t.colors.admin.textMuted }}
                  />
                  <span>{item.name}</span>
                </div>
                {active && (
                  <div
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

        {/* Footer */}
        <div
          className="p-4 space-y-3 shrink-0 border-t"
          style={{
            backgroundColor: t.admin.footer.bg,
            borderColor: t.admin.sidebar.borderColor,
          }}
        >
          <div className="flex items-center gap-3 px-2 py-1">
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
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full font-semibold transition-all"
            style={{
              padding: `${t.admin.nav.paddingYSm} 12px`,
              fontSize: t.fontSize.bodyXs,
              color: t.colors.admin.text,
              backgroundColor: t.colors.admin.navHover,
              border: `${t.border.width.DEFAULT} solid rgba(71,85,105,0.6)`,
              borderRadius: t.admin.nav.borderRadius,
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
      </div>
    </>
  )
}
