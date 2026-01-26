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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-primary/5">
        <div>
          <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-4 block underline decoration-accent/20 underline-offset-8">Member Profile</span>
          <h1 className="text-5xl md:text-7xl text-luxury text-primary">
            Greetings, <span className="text-accent italic">{user.name || 'Elite Member'}</span>
          </h1>
          <p className="text-slate-400 font-light mt-6 uppercase tracking-widest text-xs">
            {isAdmin
              ? "Laboratory Performance Protocol: Active."
              : "Review your curated vault and investment trajectory."}
          </p>
        </div>
        {isAdmin && (
          <div className="px-8 py-4 bg-primary text-white rounded-none text-[10px] font-black uppercase tracking-[0.3em] shadow-[20px_20px_60px_rgba(0,0,0,0.1)] border-l-4 border-accent">
            Core Operational
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
          title="Total Inventory Value"
          value="$ 1.2M"
          change="+12% vs LY"
          icon={DollarSign}
          color="primary"
        />
        <StatCard
          title="Essence Procurement"
          value="452"
          change="+8% vs Last Month"
          icon={Package}
          color="accent"
        />
        <StatCard
          title="Active Vault Items"
          value="89"
          change="5 Low Stock"
          icon={ShoppingBag}
          color="primary"
        />
        <StatCard
          title="Patron Registry"
          value="1,240"
          change="+12 Since Monday"
          icon={Users}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Orders for Admin */}
        <div className="bg-white rounded-none p-10 border border-primary/5 shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-primary uppercase tracking-[0.3em]">Recent Transactions</h2>
            <Link href="/account/orders" className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-primary transition-colors">View Vault &rarr;</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-secondary/10 rounded-none hover:bg-secondary/20 transition-all cursor-pointer group border-l-2 border-transparent hover:border-accent">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-none bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {i}
                  </div>
                  <div>
                    <p className="font-bold text-primary tracking-tight">Vault Registry #{i}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase">$ {i},500 &bull; 1 Essence</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">Dispatched</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-primary rounded-none p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-xl font-black uppercase tracking-[0.3em]">Critical Protocol</h2>
            <div className="w-2 h-2 bg-accent rounded-full animate-ping shadow-[0_0_10px_#d4af37]" />
          </div>
          <div className="space-y-8 relative z-10">
            {[1, 2].map((i) => (
              <div key={i} className="pb-8 border-b border-white/5 last:border-0 last:pb-0">
                <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4 underline decoration-accent/20 underline-offset-4">Vault Alert</p>
                <p className="text-base font-light leading-relaxed mb-6 opacity-80">EXRICX Diamond Petal Necklace (1.0ct) is nearing procurement depletion in the London lab.</p>
                <button className="text-[9px] font-black uppercase tracking-[0.4em] px-6 py-3 border border-white/10 rounded-none hover:bg-white hover:text-primary transition-all">Restock Protocol</button>
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
          change="Express Protocol"
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Registry Points"
          value="4,850"
          change="Titanium Status"
          icon={TrendingUp}
          color="accent"
        />
        <StatCard
          title="Vault Favorites"
          value="12"
          change="Encrypted Sink"
          icon={Heart}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Orders for Customer */}
        <div className="lg:col-span-8 bg-white rounded-none p-10 border border-primary/5 shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-primary uppercase tracking-[0.3em]">Delivery Trajectory</h2>
            <Link href="/account/orders" className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-primary transition-colors">Logistics Registry &rarr;</Link>
          </div>
          <div className="space-y-8">
            <div className="p-10 bg-secondary/10 rounded-none border border-primary/5 relative overflow-hidden group editorial-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center text-primary shadow-xl transition-all duration-700 group-hover:scale-105 border border-primary/5">
                    <Package className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Vault Protocol #EXR-BP-881</p>
                    <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">EXRICX Diamond Petal Necklace</h3>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-widest opacity-60">Status: In Secure Transit • 48h Remaining</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-primary text-white rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500 shadow-2xl">
                  Track Protocol
                </button>
              </div>
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <History className="w-48 h-48" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 space-y-8">
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-accent rounded-none p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-xl font-black uppercase tracking-[0.4em] mb-6 leading-[1.2] relative z-10">Elite Concierge <br /> Protocol</h3>
              <p className="text-white/80 text-sm font-light mb-10 leading-relaxed relative z-10">Access priority private laboratory support for all your essence requirements.</p>
              <button className="w-full py-5 bg-primary text-white rounded-none font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-primary transition-all relative z-10">Initiate Protocol</button>
            </div>

            <Link href="/products" className="block p-10 bg-secondary/20 rounded-none border border-primary/5 group relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">New Arrivals</p>
                  <p className="text-xs text-text-muted font-light uppercase tracking-widest oapcity-60">Explore latest essences</p>
                </div>
                <ArrowRight className="w-6 h-6 text-accent group-hover:translate-x-2 transition-all duration-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string | number, icon: React.ElementType, color: string }) {
  const isPrimary = color === 'primary';

  return (
    <div className="bg-white p-10 rounded-none border border-primary/5 shadow-2xl shadow-black/5 hover:border-accent/40 transition-all duration-700 group relative overflow-hidden">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className={`p-5 rounded-none transition-all duration-700 shadow-xl ${isPrimary ? 'bg-primary text-white group-hover:bg-accent' : 'bg-secondary text-primary group-hover:bg-primary group-hover:text-white'}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-accent uppercase tracking-widest bg-secondary/50 px-4 py-2 rounded-none border border-primary/5">
          <TrendingUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">{title}</p>
        <h3 className="text-4xl font-light text-primary tabular-nums tracking-tighter">{value}</h3>
      </div>
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-700 group-hover:w-full"></div>
    </div>
  );
}
