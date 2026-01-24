'use client';

import React from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Heart,
  History,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-950 tracking-tight">
            Greetings, {user.name || 'Elite Member'}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {isAdmin
              ? "Here's the latest performance update for Smart Best Brands."
              : "Review your curated collection and order trajectory."}
          </p>
        </div>
        {isAdmin && (
          <div className="px-6 py-3 bg-blue-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-950/20">
            System Operational
          </div>
        )}
      </div>

      {isAdmin ? <AdminOverview /> : <CustomerOverview />}
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Listing Value"
          value="₦ 4,200,000"
          change="+12% vs LY"
          icon={DollarSign}
          color="blue-950"
        />
        <StatCard
          title="Procurement Volume"
          value="156"
          change="+8% vs Last Month"
          icon={Package}
          color="sky"
        />
        <StatCard
          title="Active Essences"
          value="48"
          change="12 Low Stock Items"
          icon={ShoppingBag}
          color="blue-950"
        />
        <StatCard
          title="Patron Base"
          value="2,400"
          change="+144 Since Monday"
          icon={Users}
          color="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Orders for Admin */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-950/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">Recent Orders</h2>
            <Link href="/account/orders" className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:text-blue-950 transition-colors">View All &rarr;</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-white font-black text-xs">
                    AB
                  </div>
                  <div>
                    <p className="font-bold text-blue-950">Adebayo {i}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase">₦ 145,000 &bull; 2 items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Dispatched</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black uppercase tracking-widest">Critical Alerts</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Inventory Exhaustion</p>
                <p className="text-sm font-bold mb-4">Vitafoam Grandeur (King Size) is currently below minimum safety stock levels.</p>
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-blue-950 transition-all">Resolve Essence</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerOverview() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Active Orders"
          value="02"
          change="Last updated today"
          icon={Package}
          color="blue-950"
        />
        <StatCard
          title="Points Earned"
          value="4,850"
          change="Titanium Member Status"
          icon={TrendingUp}
          color="sky"
        />
        <StatCard
          title="Curated Favorites"
          value="12"
          change="Synced across devices"
          icon={Heart}
          color="blue-950"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Orders for Customer */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-950/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">Delivery Trajectory</h2>
            <Link href="/account/orders" className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:text-blue-950 transition-colors">History &rarr;</Link>
          </div>
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-950 shadow-sm transition-transform group-hover:scale-110">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1">Order #SBB-2024-001</p>
                    <h3 className="text-lg font-black text-blue-950">Vitafoam Grandeur Mattress</h3>
                    <p className="text-xs text-slate-400 font-bold">In Transit - Expected Arrival in 2 Days</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-blue-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-blue-950/10">
                  Track Delivery
                </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <History className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-sky-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-sky-600/20">
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 leading-tight">Elite Support <br /> Concierge</h3>
            <p className="text-sky-100 text-sm font-medium mb-8">Access priority support for all your interior essence requirements.</p>
            <button className="w-full py-4 bg-white text-sky-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-950 hover:text-white transition-all">Initiate Protocol</button>
          </div>

          <Link href="/products" className="block p-8 bg-slate-100 rounded-[2rem] border border-slate-200 group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-blue-950 uppercase tracking-widest">New Arrivals</p>
                <p className="text-xs text-slate-400 font-medium">Explore latest essences</p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 group-hover:text-blue-950 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string | number, icon: React.ElementType, color: string }) {
  const isBlue = color === 'blue-950';

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-blue-950/5 hover:shadow-xl hover:shadow-blue-950/10 transition-all group">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl transition-all duration-500 ${isBlue ? 'bg-blue-950 text-white group-hover:bg-sky-600' : 'bg-sky-100 text-sky-600 group-hover:bg-blue-950 group-hover:text-white'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-blue-950 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}
