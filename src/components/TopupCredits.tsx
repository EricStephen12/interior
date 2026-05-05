'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TopupCredits() {
    const [isOpen, setIsOpen] = useState(false)
    const [packs, setPacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
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

    const handleSelect = (pack: any) => {
        const params = new URLSearchParams({
            type: 'credits',
            amount: pack.credits.toString(),
            price: pack.price.toString(),
            label: pack.name
        })
        router.push(`/checkout?${params.toString()}`)
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 bg-accent text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-2xl active:scale-95"
            >
                <Plus className="w-4 h-4" />
                Top Up Credits
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-8 sm:p-12 overflow-hidden"
                        >
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-8 right-8 p-2 text-primary/10 hover:text-primary transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-12">
                                <Zap className="w-10 h-10 text-accent mx-auto mb-6" />
                                <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Purchase <span className="text-accent italic font-light lowercase">Credits.</span></h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Fuel your membership protocol</p>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className="py-20 flex justify-center">
                                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                    </div>
                                ) : packs.length === 0 ? (
                                    <p className="text-center py-20 text-[10px] font-black text-slate-400 uppercase tracking-widest">No credit packs configured.</p>
                                ) : (
                                    packs.map((pack) => (
                                        <button
                                            key={pack.id}
                                            onClick={() => handleSelect(pack)}
                                            className={`w-full group flex items-center justify-between p-6 border-2 transition-all relative overflow-hidden
                                                ${pack.isPopular 
                                                    ? 'border-accent bg-accent/5' 
                                                    : 'border-primary/5 bg-secondary/10 hover:border-accent/40'}`}
                                        >
                                            <div className="text-left relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">{pack.name}</span>
                                                    {pack.isPopular && <span className="text-[7px] font-black bg-accent text-white px-2 py-0.5 uppercase">Featured</span>}
                                                </div>
                                                <h3 className="text-2xl font-black text-primary tabular-nums mt-1">{pack.credits} Credits</h3>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">{pack.description || 'Verified Performance Access'}</p>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <p className="text-xl font-bold text-primary tabular-nums">₦{pack.price.toLocaleString()}</p>
                                                <div className="flex items-center justify-end gap-2 text-[8px] font-black text-accent uppercase tracking-widest mt-2 group-hover:translate-x-2 transition-transform">
                                                    Select <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <p className="mt-12 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                Protocol verified transactions only
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
