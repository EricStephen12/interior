'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TopupCredits() {
  const [isOpen, setIsOpen] = useState(false)
  const [packs, setPacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'HOURS' | 'DAYS'>('ALL')
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch('/api/credit-packs')
        .then((r) => r.json())
        .then((data) => {
          setPacks(data.packs || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [isOpen])

  const isHourlyPack = (pack: any) => {
    const name = (pack.name || '').toLowerCase()
    const desc = (pack.description || '').toLowerCase()
    return name.includes('hour') || name.includes('hr') || desc.includes('hour') || desc.includes('session')
  }

  const cleanDescription = (desc: string | null) => {
    if (!desc) return 'Full gym and equipment access included.'
    return desc
      .replace(/^\[hourly\]\s*/i, '')
      .replace(/^\[daily\]\s*/i, '')
      .replace(/^\[membership\]\s*/i, '')
      .trim()
  }

  const formatPlanTier = (name: string) => {
    if (!name) return ''
    return name
      .replace(/\//g, ' • ')
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ')
  }

  const filteredPacks = packs.filter((p) => {
    if (filter === 'ALL') return true
    if (filter === 'HOURS') return isHourlyPack(p)
    if (filter === 'DAYS') return !isHourlyPack(p)
    return true
  })

  const handleSelect = (pack: any) => {
    const isHourly = isHourlyPack(pack)
    const unit = isHourly ? 'hours' : 'days'
    const params = new URLSearchParams({
      type: 'credits',
      amount: pack.credits.toString(),
      unit: unit,
      price: pack.price.toString(),
      label: pack.name,
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <>
      {/* Sleek Minimal Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#f20d0d] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-[0.99]"
      >
        <Plus className="w-3.5 h-3.5" />
        Get Access Pass
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">
                    Official Passes
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    Gym Access Passes
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select an hourly training session or full monthly membership.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors -mr-1 -mt-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Segmented Filter Control */}
              <div className="px-6 pt-4 pb-2">
                <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-lg text-center">
                  {[
                    { id: 'ALL', label: 'All Passes' },
                    { id: 'HOURS', label: 'Hourly' },
                    { id: 'DAYS', label: 'Day & Month' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as any)}
                      className={`py-1.5 text-xs font-semibold transition-all rounded-md ${
                        filter === f.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passes List */}
              <div className="px-6 py-3 space-y-2.5 overflow-y-auto flex-1 min-h-0">
                {loading ? (
                  <div className="py-16 flex justify-center">
                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                  </div>
                ) : filteredPacks.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      No passes found in this category
                    </p>
                  </div>
                ) : (
                  filteredPacks.map((pack) => {
                    const isHourly = isHourlyPack(pack)
                    const durationText = isHourly
                      ? `${pack.credits} ${pack.credits === 1 ? 'Hour Access' : 'Hours Access'}`
                      : `${pack.credits} ${pack.credits === 1 ? 'Day Pass' : 'Days Pass'}`

                    return (
                      <div
                        key={pack.id}
                        onClick={() => handleSelect(pack)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between gap-4 ${
                          pack.isPopular
                            ? 'border-slate-900 bg-slate-900/[0.02] hover:bg-slate-900/[0.04]'
                            : 'border-slate-200/80 hover:border-slate-400 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          {/* Tags row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                              {isHourly ? 'Hourly' : 'Membership'}
                            </span>
                            {pack.isPopular && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-sm">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Plan duration title */}
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                            {durationText}
                          </h3>

                          {/* Subtitle / tier name */}
                          <p className="text-[11px] font-medium text-slate-600 truncate">
                            {formatPlanTier(pack.name)}
                          </p>

                          {/* Description */}
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {cleanDescription(pack.description)}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right shrink-0">
                          <p className="text-base sm:text-lg font-mono font-bold text-slate-900">
                            ₦{Number(pack.price).toLocaleString()}
                          </p>
                          <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                            Select
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Instant QR Pass Activation
                </span>
                <span className="font-mono text-[10px]">Secure Payment</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
