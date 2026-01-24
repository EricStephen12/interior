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
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-950 p-2 rounded-lg group-hover:bg-sky-600 transition-colors">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-950">
              Smart Best
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isAdmin ? 'Admin Dashboard' : 'Customer Account'}
            </p>
          </div>
        </Link>
        <button className="md:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
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

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 mb-4 bg-slate-50 rounded-xl">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Logged in as</p>
          <p className="text-[10px] font-bold text-blue-950 truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col flex-shrink-0">
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
              className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-950 p-1.5 rounded-lg">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-blue-950 tracking-tight">Smart Best</span>
          </Link>
          <button className="p-2 text-blue-950" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto relative bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
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
      className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 group
        ${active
          ? 'bg-blue-950 text-white shadow-xl shadow-blue-950/10'
          : 'text-gray-500 hover:bg-gray-100 hover:text-blue-950'}`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-500 ${active ? '' : 'group-hover:scale-110'}`} />
      {children}
    </Link>
  );
}
