'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Zap, ArrowRight, Loader2, Clock, Calendar, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { t } from '@/lib/theme'

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
                .then(r => r.json())
                .then(data => {
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

    const filteredPacks = packs.filter(p => {
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
            label: pack.name
        })
        router.push(`/checkout?${params.toString()}`)
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 bg-accent text-white px-8 py-4 text-xs font-black uppercase tracking-[0.25em] hover:bg-primary transition-all shadow-2xl active:scale-95 shimmer-btn rounded"
                style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
            >
                <Plus className="w-4 h-4" />
                Get Access Pass (Hours / Days)
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 backdrop-blur-md bg-black/60"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-2xl bg-white p-6 sm:p-10 rounded-2xl overflow-hidden shadow-2xl border border-primary/10"
                        >
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 p-2 text-primary/30 hover:text-primary transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block mb-2">Sharers Official Passes</span>
                                <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tight font-heading">
                                    Gym Access <span className="text-accent italic font-light lowercase">Passes.</span>
                                </h2>
                                <p className="text-xs font-medium text-text-muted mt-1">
                                    Choose an hourly training session or full day/monthly membership pass.
                                </p>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[
                                    { id: 'ALL', label: 'All Passes' },
                                    { id: 'HOURS', label: '⏱️ Hourly Sessions' },
                                    { id: 'DAYS', label: '📅 Day & Month Passes' },
                                ].map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id as any)}
                                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                                            filter === f.id
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-secondary/40 text-text-muted hover:text-primary hover:bg-secondary'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                                {loading ? (
                                    <div className="py-20 flex justify-center">
                                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                    </div>
                                ) : filteredPacks.length === 0 ? (
                                    <div className="text-center py-16 bg-secondary/10 rounded-xl border border-dashed border-primary/10">
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No passes found in this category.</p>
                                    </div>
                                ) : (
                                    filteredPacks.map((pack) => {
                                        const isHourly = isHourlyPack(pack)
                                        return (
                                            <button
                                                key={pack.id}
                                                onClick={() => handleSelect(pack)}
                                                className={`w-full group flex items-center justify-between p-5 border-2 rounded-xl transition-all relative overflow-hidden text-left
                                                    ${pack.isPopular 
                                                        ? 'border-accent bg-accent/5 shadow-sm' 
                                                        : 'border-primary/10 bg-white hover:border-accent/40 hover:bg-secondary/20'}`}
                                            >
                                                <div className="relative z-10 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-primary uppercase tracking-wider">{pack.name}</span>
                                                        <span className={`text-[9px] font-black px-2 py-0.5 uppercase rounded ${
                                                            isHourly ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                                                        }`}>
                                                            {isHourly ? '⏱️ Hourly Session' : '📅 Day Pass'}
                                                        </span>
                                                        {pack.isPopular && (
                                                            <span className="text-[9px] font-black bg-accent text-white px-2 py-0.5 uppercase rounded">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-black text-primary tabular-nums">
                                                        {pack.credits} {isHourly ? (pack.credits === 1 ? 'Hour Access' : 'Hours Access') : (pack.credits === 1 ? 'Day Pass' : 'Days Pass')}
                                                    </h3>
                                                    <p className="text-[11px] font-medium text-text-muted">{pack.description || 'Full Arena & Biomechanics Access'}</p>
                                                </div>
                                                <div className="text-right relative z-10 shrink-0">
                                                    <p className="text-lg font-black text-primary tabular-nums font-mono">₦{pack.price.toLocaleString()}</p>
                                                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-accent uppercase tracking-wider mt-1 group-hover:translate-x-1 transition-transform">
                                                        Select <ArrowRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-primary/5 flex items-center justify-between text-[11px] text-text-muted font-medium">
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    Instant Digital QR Pass Activation
                                </span>
                                <span>Verified Payment Gateway</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
