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
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight">
            {isAdmin ? 'Store Dispatch' : 'Order Trajectory'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAdmin ? 'Manage and fulfill global order essences.' : 'Trace the path of your curated comfort.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-all shadow-xl shadow-blue-900/5">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
          {isAdmin && (
            <button className="flex items-center gap-2 px-6 py-4 bg-blue-950 hover:bg-sky-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-950/20">
              Export Dossier
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-950/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <th className="px-8 py-6">Identity</th>
              {isAdmin && <th className="px-8 py-6">Recipient</th>}
              <th className="px-8 py-6">Timeline</th>
              <th className="px-8 py-6">Condition</th>
              <th className="px-8 py-6">Value</th>
              <th className="px-8 py-6 text-right">Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 font-black text-blue-950">
                  #SBB-2024-{100 + i}
                </td>
                {isAdmin && (
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-blue-950">Patron Name {i}</p>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Abuja Zone</p>
                    </div>
                  </td>
                )}
                <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Oct {20 + i}, 2026
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={i === 1 ? 'delivered' : i === 2 ? 'shipped' : 'processing'} />
                </td>
                <td className="px-8 py-6 font-black text-blue-950">
                  ₦ 145,000
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-3 bg-slate-50 text-slate-300 hover:text-sky-600 hover:bg-white rounded-xl transition-all shadow-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isAdmin && (
        <div className="bg-blue-950 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-blue-950/20 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="max-w-md">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Awaiting Essence?</h3>
              <p className="text-sky-100 font-medium">Our logistics team ensures every mattress essence is handled with white-glove care. Delivery protocols are typically finalized within 48 hours for Abuja zones.</p>
            </div>
            <button className="whitespace-nowrap px-8 py-4 bg-sky-600 hover:bg-white hover:text-sky-600 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl">
              Contact Dispatch Protocol
            </button>
          </div>
          <Package className="absolute right-[-20px] top-[-20px] w-64 h-64 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "text-amber-500 bg-amber-50",
    processing: "text-blue-500 bg-blue-50",
    shipped: "text-sky-500 bg-sky-50",
    delivered: "text-emerald-500 bg-emerald-50",
    cancelled: "text-rose-500 bg-rose-50",
  }[status] || "";

  const icon = {
    pending: <Clock className="w-3 h-3" />,
    processing: <Loader2 className="w-3 h-3 animate-spin" />,
    shipped: <Truck className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  }[status];

  return (
    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${styles}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
