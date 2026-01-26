'use client';

import React from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="space-y-12 font-sans selection:bg-secondary">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-4 block underline decoration-accent/20 underline-offset-8">Order History</span>
          <h1 className="text-5xl font-black text-primary tracking-tight">
            {isAdmin ? 'Store Dispatch' : 'Vault Trajectory'}
          </h1>
          <p className="text-slate-400 font-light mt-4 uppercase tracking-widest text-xs">
            {isAdmin ? 'Manage and fulfill global order essences.' : 'Trace the path of your curated investment pieces.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-white border border-primary/5 rounded-none font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary transition-all shadow-xl shadow-black/5">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
          {isAdmin && (
            <button className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-accent text-white rounded-none font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl">
              Export Dossier
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-none border border-primary/5 shadow-2xl shadow-black/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/10">
            <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <th className="px-10 py-8 border-b border-primary/5">Identity</th>
              {isAdmin && <th className="px-10 py-8 border-b border-primary/5">Patron</th>}
              <th className="px-10 py-8 border-b border-primary/5">Timeline</th>
              <th className="px-10 py-8 border-b border-primary/5">Condition</th>
              <th className="px-10 py-8 border-b border-primary/5">Valuation</th>
              <th className="px-10 py-8 border-b border-primary/5 text-right">Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-secondary/10 transition-colors group">
                <td className="px-10 py-8 font-black text-primary tabular-nums">
                  #EXR-BP-{100 + i}
                </td>
                {isAdmin && (
                  <td className="px-10 py-8">
                    <div>
                      <p className="font-bold text-primary">Patron Name {i}</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mt-1">Global Registry</p>
                    </div>
                  </td>
                )}
                <td className="px-10 py-8 text-[11px] font-medium text-slate-500 uppercase tracking-widest tabular-nums">
                  Oct {20 + i}, 2026
                </td>
                <td className="px-10 py-8">
                  <StatusBadge status={i === 1 ? 'delivered' : i === 2 ? 'shipped' : 'processing'} />
                </td>
                <td className="px-10 py-8 font-black text-primary tabular-nums">
                  $ {i},145.00
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="p-4 bg-white text-slate-300 hover:text-accent hover:bg-primary rounded-none transition-all shadow-sm border border-primary/5">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isAdmin && (
        <div className="bg-primary rounded-none p-16 text-white shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
            <div className="max-w-xl">
              <h3 className="text-4xl text-luxury mb-6">Awaiting <br /><span className="text-accent italic">Essence?</span></h3>
              <p className="text-white/60 font-light text-lg leading-relaxed">Our logistics team ensures every investment essence is handled with white-glove precision. Vault protocols are typically finalized within 48 laboratory hours for global zones.</p>
            </div>
            <button className="whitespace-nowrap px-10 py-6 bg-accent hover:bg-white hover:text-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-none transition-all duration-700 shadow-2xl">
              Initiate Dispatch Protocol
            </button>
          </div>
          <Package className="absolute right-[-40px] top-[-40px] w-96 h-96 opacity-[0.02] group-hover:rotate-12 transition-transform duration-[2s]" />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "text-accent bg-accent/10 border border-accent/20",
    processing: "text-slate-400 bg-slate-50 border border-slate-200",
    shipped: "text-primary bg-secondary/30 border border-primary/10",
    delivered: "text-primary bg-primary/5 border border-primary/10",
    cancelled: "text-red-800 bg-red-50 border border-red-100",
  }[status] || "";

  const icon = {
    pending: <Clock className="w-3 h-3" />,
    processing: <Loader2 className="w-3 h-3 animate-spin" />,
    shipped: <Truck className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  }[status];

  return (
    <span className={`flex items-center gap-3 w-fit px-5 py-2 rounded-none text-[9px] font-black uppercase tracking-widest ${styles}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
