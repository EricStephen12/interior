'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMembership, getActivePassInfo } from '@/lib/membership-context'
import { useCart } from '@/lib/cart-context'
import { useCustomization } from '@/lib/customization-context'
import MemberPass from '@/components/MemberPass'
import { Activity, Clock, Award, ChevronRight, ShoppingBag, Printer, Trophy, Truck } from 'lucide-react'
import Link from 'next/link'
import TopupCredits from '@/components/TopupCredits'
import { useUser } from '@clerk/nextjs'

/**
 * Robustly parses and formats order items whether stored as
 * an array of objects, JSON string, or legacy plain text.
 */
function formatOrderItems(items: any): string {
    if (!items) return 'Access Pass / Product Order'
    let parsed = items
    if (typeof items === 'string') {
        const trimmed = items.trim()
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                parsed = JSON.parse(trimmed)
            } catch {
                return trimmed
            }
        } else {
            return trimmed
        }
    }
    if (Array.isArray(parsed)) {
        if (parsed.length === 0) return 'Access Pass / Product Order'
        return parsed.map((item: any) => {
            const qty = item.quantity || item.qty || 1
            const name = item.name || item.title || item.label || 'Pass / Product'
            const variant = item.size || item.sizeLabel || item.variant || ''
            return `${qty}x ${name}${variant ? ` (${variant})` : ''}`
        }).join(', ')
    }
    if (typeof parsed === 'object') {
        if (parsed.name) return `${parsed.quantity || 1}x ${parsed.name}`
        if (parsed.label) return parsed.label
    }
    return 'Access Pass / Product Order'
}

export default function DashboardPage() {
    const { state } = useMembership()
    const activePlan = getActivePassInfo(state)
    const { isLoaded, isSignedIn, user } = useUser()
    const { clearCart } = useCart()
    const { get } = useCustomization()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'GOOD MORNING'
        if (hour < 17) return 'GOOD AFTERNOON'
        return 'GOOD EVENING'
    }

    // Dynamic Customizable Athlete Milestone Logic from Theme Studio
    const t1Name = get('milestone.tier1.name', 'ROOKIE ATHLETE')
    const t1Target = parseInt(get('milestone.tier1.target', '10')) || 10
    const t1Perk = get('milestone.tier1.perk', 'Complimentary Energy Drink at Reception')

    const t2Name = get('milestone.tier2.name', 'IRON MEMBER')
    const t2Target = parseInt(get('milestone.tier2.target', '25')) || 25
    const t2Perk = get('milestone.tier2.perk', 'Complimentary Recovery & Protein Shake')

    const t3Name = get('milestone.tier3.name', 'ELITE TITAN')
    const t3Target = parseInt(get('milestone.tier3.target', '50')) || 50
    const t3Perk = get('milestone.tier3.perk', 'VIP Protein Smoothie + Guest Day Pass')

    const t4Name = get('milestone.tier4.name', 'SHARERS LEGEND')
    const t4Target = parseInt(get('milestone.tier4.target', '100')) || 100
    const t4Perk = get('milestone.tier4.perk', 'Free 1-Month VIP Black Pass Top-Up')

    const sessionCount = state.checkInHistory.length
    let athleteTier = t1Name
    let tierIcon = '🥉'
    let nextTarget = t1Target
    let nextPerk = t1Perk

    if (sessionCount >= t3Target) {
        athleteTier = t4Name
        tierIcon = '👑'
        nextTarget = t4Target
        nextPerk = t4Perk
    } else if (sessionCount >= t2Target) {
        athleteTier = t3Name
        tierIcon = '🥇'
        nextTarget = t3Target
        nextPerk = t3Perk
    } else if (sessionCount >= t1Target) {
        athleteTier = t2Name
        tierIcon = '🥈'
        nextTarget = t2Target
        nextPerk = t2Perk
    }

    const progressPercent = Math.min(100, Math.round((sessionCount / Math.max(1, nextTarget)) * 100))
    const sessionsRemaining = Math.max(0, nextTarget - sessionCount)

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search.includes('payment=success')) {
            clearCart()
        }
    }, [clearCart])

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            window.location.href = '/sign-in?redirect_url=/dashboard'
        }
    }, [isLoaded, isSignedIn])

    if (!isLoaded || !isSignedIn) return (
        <div className="min-h-screen bg-secondary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    )

    const container: any = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item: any = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <div className="min-h-screen bg-secondary pt-20 sm:pt-28 lg:pt-32 pb-16 px-3 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Editorial Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 mb-6 sm:mb-10 lg:mb-12">
                    <div>
                        <p className="text-[10px] font-black tracking-[0.25em] sm:tracking-[0.4em] text-accent uppercase mb-2 sm:mb-3">MEMBER DASHBOARD</p>
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-luxury text-primary leading-tight sm:leading-none tracking-tight">
                            {getGreeting()} <br />
                            <span className="text-xl sm:text-3xl lg:text-5xl text-accent italic font-light">{user?.firstName || 'MEMBER'}.</span>
                        </h1>
                    </div>
                    <div className="shrink-0">
                        <TopupCredits />
                    </div>
                </div>

                {/* Pending Verification Notice */}
                {state.orderHistory.some(o => o.status === 'PENDING_VERIFICATION') && (
                    <div className="mb-8 p-4 sm:p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900">
                                    Manual Bank Transfer Awaiting Verification
                                </h4>
                                <p className="text-[11px] sm:text-xs text-amber-800/90 leading-relaxed max-w-2xl">
                                    Your bank transfer order is currently being reviewed by our front desk. Once confirmed, your gym access credits and pass will be automatically activated.
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-amber-200/70 text-amber-950 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0">
                            In Review
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Member Pass - At top on Mobile (order-1), Left/Sticky on Desktop (lg:col-span-4) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 order-1 lg:order-1 mb-2 lg:mb-0">
                        <MemberPass />
                        <div className="flex flex-col items-center gap-2 mt-4 sm:mt-6">
                            <p className="text-[9px] sm:text-[10px] font-black text-text-muted tracking-[0.3em] uppercase text-center border-t border-primary/5 pt-4 w-full">
                                ACCESS SECURED • DIGITAL PASS
                            </p>
                        </div>
                    </div>

                    {/* Stats & History - Below Pass on Mobile (order-2), Right on Desktop (lg:col-span-8) */}
                    <div className="lg:col-span-8 order-2 lg:order-2">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-10 sm:space-y-14"
                        >

                            {/* Performance Meters (3-Column compact layout on both mobile and desktop) */}
                            <motion.div variants={item} className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                                <StatCard
                                    label="STATUS"
                                    value={state.remainingCredits > 0 ? 'ACTIVE' : (state.totalCredits > 0 ? 'EXPIRED' : 'INACTIVE')}
                                    desc={state.remainingCredits > 0 ? 'Entry cleared' : 'Top-up needed'}
                                    icon={Award}
                                    valueColor={state.remainingCredits > 0 ? 'text-emerald-600' : 'text-rose-500'}
                                />
                                <StatCard
                                    label="PASS BALANCE"
                                    value={`${state.remainingCredits} / ${state.totalCredits}`}
                                    desc="Available check-ins"
                                    icon={Clock}
                                />
                                <StatCard
                                    label="SESSIONS"
                                    value={state.checkInHistory.length.toString()}
                                    desc="Workouts logged"
                                    icon={Activity}
                                />
                            </motion.div>

                            {/* Athlete Loyalty & Milestone Progress */}
                            <motion.div variants={item} className="p-4 sm:p-6 md:p-8 bg-white border border-primary/10 shadow-xs rounded-xl sm:rounded-none">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-lg sm:text-xl">{tierIcon}</span>
                                            <h4 className="text-sm sm:text-base font-black tracking-tight text-primary uppercase">
                                                {athleteTier}
                                            </h4>
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-accent/15 text-accent rounded-full">
                                                {sessionCount} Workouts
                                            </span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                                            Next Milestone Perk: <strong className="text-primary font-bold">{nextPerk}</strong>
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="text-[10px] sm:text-[11px] font-black text-accent uppercase tracking-wider">
                                            {sessionsRemaining === 0 ? '🏆 Milestone Complete!' : `${sessionsRemaining} workout${sessionsRemaining === 1 ? '' : 's'} to unlock perk`}
                                        </span>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-2 sm:h-2.5 bg-secondary overflow-hidden rounded-full border border-primary/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent to-red-500 transition-all duration-1000 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </motion.div>

                            {/* Activity Log - Editorial List */}
                            <motion.div variants={item} className="space-y-6 sm:space-y-8">
                                <div className="flex items-end justify-between border-b border-primary/10 pb-4 sm:pb-6">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl text-luxury text-primary">Activity <span className="text-accent italic">Log.</span></h3>
                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-text-muted">DOOR SCANS</span>
                                </div>

                                {state.checkInHistory.length === 0 ? (
                                    <div className="py-12 sm:py-16 text-center border border-dashed border-primary/10 rounded-xl sm:rounded-none bg-white/50">
                                        <p className="text-text-muted font-medium mb-6 text-xs sm:text-sm">You haven't stepped in yet. Time to get to work.</p>
                                        <Link href="/products">
                                            <button className="text-[10px] font-black text-accent tracking-[0.3em] uppercase border-b border-accent pb-1.5 hover:text-primary transition-colors">GET STARTED &rarr;</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {state.checkInHistory.map((checkIn, idx) => (
                                            <motion.div
                                                key={checkIn.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group flex items-center justify-between p-4 sm:p-6 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-300 rounded-lg sm:rounded-none"
                                            >
                                                <div className="flex items-center gap-4 sm:gap-8 min-w-0">
                                                    <span className="text-[10px] font-black text-accent/40 tabular-nums shrink-0">
                                                        {String(state.checkInHistory.length - idx).padStart(2, '0')}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h4 className={`text-sm sm:text-base font-bold transition-colors truncate ${checkIn.protocol === 'MISSED' ? 'text-red-500' : 'text-primary group-hover:text-accent'}`}>
                                                            {checkIn.protocol === 'MISSED' ? 'MISSED SESSION' : `SHARERS ${checkIn.protocol}`}
                                                        </h4>
                                                        <p className="text-[9px] sm:text-[10px] font-bold text-text-muted tracking-wider uppercase mt-0.5">
                                                            {new Date(checkIn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                                    <span className={`px-3 sm:px-4 py-1.5 text-[8px] sm:text-[9px] font-black tracking-widest uppercase rounded ${checkIn.protocol === 'MISSED' ? 'bg-red-500/10 text-red-500' : 'bg-secondary text-primary'}`}>
                                                        -1 CREDIT
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 hidden sm:block" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Order History - Editorial List */}
                            <motion.div variants={item} className="space-y-6 sm:space-y-8">
                                <div className="flex items-end justify-between border-b border-primary/10 pb-4 sm:pb-6">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl text-luxury text-primary">Order <span className="text-accent italic">History.</span></h3>
                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-text-muted">PURCHASE RECORDS</span>
                                </div>

                                {state.orderHistory.length === 0 ? (
                                    <div className="py-12 sm:py-16 text-center border border-dashed border-primary/10 rounded-xl sm:rounded-none bg-white/50">
                                        <p className="text-text-muted font-medium mb-6 text-xs sm:text-sm">No purchases on record yet. Explore the collection.</p>
                                        <Link href="/products">
                                            <button className="text-[10px] font-black text-accent tracking-[0.3em] uppercase border-b border-accent pb-1.5 hover:text-primary transition-colors">VIEW COLLECTION &rarr;</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {state.orderHistory.map((order, idx) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-300 gap-4 rounded-lg sm:rounded-none"
                                            >
                                                <div className="flex items-start sm:items-center gap-3 sm:gap-6 min-w-0">
                                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary flex items-center justify-center shrink-0 rounded">
                                                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm sm:text-base font-bold text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">
                                                            {formatOrderItems(order.items)}
                                                        </h4>
                                                        <p className="text-[9px] sm:text-[10px] font-black text-text-muted tracking-wider uppercase mt-1">
                                                            REF: {order.id.substring(0, 8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                                                    <span className="px-3 py-1.5 bg-secondary text-[9px] sm:text-[10px] font-black tracking-wider text-primary uppercase rounded">
                                                        ₦{order.totalAmount.toLocaleString()}
                                                    </span>
                                                    {order.status === 'PENDING_VERIFICATION' ? (
                                                        <div className="px-2.5 py-1.5 text-[8px] sm:text-[9px] font-black tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300 rounded flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                                            In Review
                                                        </div>
                                                    ) : (
                                                        <div className={`px-2.5 py-1.5 text-[8px] sm:text-[9px] font-black tracking-wider uppercase rounded ${
                                                            ['COMPLETED', 'PAID', 'DELIVERED'].includes(order.status) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                            order.status === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                            'bg-orange-50 text-orange-700 border border-orange-200'
                                                        }`}>
                                                            {order.status}
                                                        </div>
                                                    )}

                                                    {/* Visual Package Tracking Link */}
                                                    <Link
                                                        href={`/track/${order.id}`}
                                                        className="px-2.5 py-1.5 bg-secondary hover:bg-primary hover:text-white text-primary text-[8px] sm:text-[9px] font-black tracking-wider uppercase flex items-center gap-1 transition-colors border border-primary/10 rounded"
                                                        title="Track Package Live"
                                                    >
                                                        <Truck className="w-3 h-3 text-accent" />
                                                        <span>Track</span>
                                                    </Link>

                                                    {/* Printable Official Receipt Link */}
                                                    <Link
                                                        href={`/receipt/${order.id}`}
                                                        target="_blank"
                                                        className="px-2.5 py-1.5 bg-secondary hover:bg-primary hover:text-white text-primary text-[8px] sm:text-[9px] font-black tracking-wider uppercase flex items-center gap-1 transition-colors border border-primary/10 rounded"
                                                        title="Download Official Receipt"
                                                    >
                                                        <Printer className="w-3 h-3 text-accent" />
                                                        <span>Receipt</span>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, desc, icon: Icon, valueColor }: { label: string, value: string, desc: string, icon: any, valueColor?: string }) {
    return (
        <div className="bg-white p-3 sm:p-5 md:p-6 lg:p-8 border border-primary/5 shadow-xs group hover:border-accent/20 transition-all duration-500 flex flex-col justify-between rounded-lg sm:rounded-none">
            <div className="flex items-center justify-between gap-1 mb-2 sm:mb-4">
                <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-accent opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 shrink-0" strokeWidth={1.5} />
                <span className="text-[7px] sm:text-[9px] md:text-[10px] font-black tracking-wider text-text-muted uppercase truncate">{label}</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
                <p className={`font-black tracking-tighter uppercase leading-none ${value.length > 8 ? 'text-xs sm:text-lg md:text-2xl' : 'text-sm sm:text-2xl md:text-3xl lg:text-4xl'} ${valueColor || 'text-primary'}`}>{value}</p>
                <p className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-text-muted tracking-wider uppercase truncate">{desc}</p>
            </div>
        </div>
    )
}
