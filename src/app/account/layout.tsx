'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Package,
  Grid,
  Ruler,
  Settings,
  LogOut,
  Home,
  User,
  Heart,
  History,
  Percent,
  MapPin,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-2 border-primary/20 border-t-accent rounded-none animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'ADMIN';
  const isManagementRoute = pathname.startsWith('/account/products') ||
    pathname.startsWith('/account/brands') ||
    pathname.startsWith('/account/promotions') ||
    pathname.startsWith('/account/delivery-locations') ||
    pathname.startsWith('/account/categories') ||
    pathname.startsWith('/account/sizes');

  if (!isAdmin && isManagementRoute) {
    router.push('/account');
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-primary/5">
      <div className="p-8 border-b border-primary/5 flex items-center justify-between">
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary p-2.5 rounded-none group-hover:bg-accent transition-all duration-500 shadow-xl">
              <Home className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-primary tracking-[0.2em] uppercase">
              SHARERS
            </h1>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent underline decoration-accent/20 underline-offset-4">
            {isAdmin ? 'Lab Authority' : 'Member Registry'}
          </p>
        </Link>
        <button className="md:hidden p-2 text-primary" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {isAdmin ? (
          <>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 mt-2">
              Store Management
            </p>
            <NavItem href="/account" icon={LayoutDashboard} active={pathname === '/account'} onClick={() => setIsSidebarOpen(false)}>Overview</NavItem>
            <NavItem href="/account/products" icon={ShoppingBag} active={pathname.startsWith('/account/products')} onClick={() => setIsSidebarOpen(false)}>Products</NavItem>
            <NavItem href="/account/brands" icon={Tags} active={pathname.startsWith('/account/brands')} onClick={() => setIsSidebarOpen(false)}>Brands</NavItem>
            <NavItem href="/account/promotions" icon={Percent} active={pathname.startsWith('/account/promotions')} onClick={() => setIsSidebarOpen(false)}>Promotions</NavItem>
            <NavItem href="/account/delivery-locations" icon={MapPin} active={pathname.startsWith('/account/delivery-locations')} onClick={() => setIsSidebarOpen(false)}>Logistics</NavItem>
            <NavItem href="/account/categories" icon={Grid} active={pathname.startsWith('/account/categories')} onClick={() => setIsSidebarOpen(false)}>Categories</NavItem>
            <NavItem href="/account/sizes" icon={Ruler} active={pathname.startsWith('/account/sizes')} onClick={() => setIsSidebarOpen(false)}>Global Sizes</NavItem>
            <NavItem href="/account/orders" icon={Package} active={pathname.startsWith('/account/orders')} onClick={() => setIsSidebarOpen(false)}>All Orders</NavItem>
          </>
        ) : (
          <>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 mt-2">
              Your Account
            </p>
            <NavItem href="/account" icon={User} active={pathname === '/account'} onClick={() => setIsSidebarOpen(false)}>Profile</NavItem>
            <NavItem href="/account/orders" icon={History} active={pathname.startsWith('/account/orders')} onClick={() => setIsSidebarOpen(false)}>My Orders</NavItem>
            <NavItem href="/account/wishlist" icon={Heart} active={pathname.startsWith('/account/wishlist')} onClick={() => setIsSidebarOpen(false)}>Favorites</NavItem>
          </>
        )}

        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
            Settings
          </p>
          <NavItem href="/account/settings" icon={Settings} active={pathname.startsWith('/account/settings')} onClick={() => setIsSidebarOpen(false)}>Settings</NavItem>
        </div>
      </nav>

      <div className="p-8 border-t border-primary/5 bg-secondary/10">
        <div className="px-6 py-4 mb-6 bg-white border border-primary/5 rounded-none shadow-sm">
          <p className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">Authenticated via</p>
          <p className="text-[11px] font-medium text-primary truncate tabular-nums">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 px-6 py-4 w-full text-[10px] font-black uppercase tracking-[0.3em] text-red-800 bg-white border border-red-50 hover:bg-red-50 transition-all rounded-none"
        >
          <LogOut className="w-5 h-5" />
          Exit Registry
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white text-primary font-sans selection:bg-secondary">
      {/* Desktop Sidebar */}
      <aside className="w-80 hidden md:flex flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-primary/5 p-6 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center gap-4">
            <div className="bg-primary p-2 shadow-xl">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-primary tracking-[0.2em] uppercase text-xl">SHARERS</span>
          </Link>
          <button className="p-2 text-primary" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </header>

        <main className="flex-1 overflow-auto relative bg-secondary/20">
          <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, children, active, onClick }: { href: string; icon: React.ElementType; children: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-[0.3em] rounded-none transition-all duration-700 group border-l-4
        ${active
          ? 'bg-primary text-white border-accent shadow-2xl'
          : 'text-slate-400 border-transparent hover:bg-secondary/30 hover:text-primary'}`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-700 ${active ? 'text-accent' : 'group-hover:scale-110'}`} />
      {children}
    </Link>
  );
}
