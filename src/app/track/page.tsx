import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Truck, Search, ShieldCheck, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function TrackLookupPage({ searchParams }: PageProps) {
  const { id } = await searchParams

  if (id && id.trim()) {
    redirect(`/track/${encodeURIComponent(id.trim())}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl relative overflow-hidden">
        {/* Top Crimson Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#f20d0d] via-red-600 to-[#f20d0d]" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-[#f20d0d] shadow-sm">
            <Truck className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f20d0d] block mb-1">
            Sharers Gym Logistics
          </span>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight font-heading">
            Track Your Package
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
            Enter your Order ID, KingsPay Reference, or Invoice Number to view real-time atelier dispatch status.
          </p>
        </div>

        <form action="/track" method="GET" className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="id"
              placeholder="e.g. cme0xyz... or SG-INV-1234"
              className="w-full px-5 py-4 pl-12 rounded-2xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f20d0d] focus:border-transparent transition-all shadow-inner"
              required
              autoFocus
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#f20d0d] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-[0.99]"
          >
            <span>Track Order Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security & Assistance Callout */}
        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Verified Atelier Dispatch</span>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-[#f20d0d] hover:underline">
            View My Orders →
          </Link>
        </div>
      </div>
    </div>
  )
}
