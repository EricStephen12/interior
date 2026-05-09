'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Menu, X, ArrowLeft,
  LayoutDashboard, ShoppingBag, FileText, Users, MessageSquare, Settings, Truck
} from 'lucide-react'
import { UserButton } from "@clerk/nextjs"

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false)

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
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary border-b border-white/10 flex items-center justify-between px-4 z-[9990]">
        <div className="text-white font-playfair font-black tracking-widest uppercase">
          SHARERS <span className="text-accent text-[10px] ml-2">Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/70 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9995]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar Drawer */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-primary z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="text-white font-playfair font-black tracking-widest uppercase">
            SHARERS
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <item.icon className="w-5 h-5 text-accent" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 space-y-6 shrink-0">
          <div className="flex items-center gap-4 px-4">
             <UserButton />
             <span className="text-xs font-black tracking-[0.2em] text-white/40 uppercase">Account</span>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-accent border border-accent/20 rounded-lg hover:bg-accent hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </>
  )
}
