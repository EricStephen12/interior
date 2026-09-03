'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMembership, getActivePassInfo } from '@/lib/membership-context'
import { useCart } from '@/lib/cart-context'
import MemberPass from '@/components/MemberPass'
import { Activity, Clock, Award, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import TopupCredits from '@/components/TopupCredits'
import { useUser } from '@clerk/nextjs'

export default function DashboardPage() {
    const { state } = useMembership()
    const activePlan = getActivePassInfo(state)
    const { isLoaded, isSignedIn, user } = useUser()
    const { clearCart } = useCart()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'GOOD MORNING'
        if (hour < 17) return 'GOOD AFTERNOON'
        return 'GOOD EVENING'
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search.includes('payment=success')) {
            clearCart()
        }
    }, [clearCart])

    if (!isLoaded) return (
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
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <div className="min-h-screen bg-secondary pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Editorial Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 sm:mb-32">
                        <div>
                            <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-6">MEMBER DASHBOARD</p>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-luxury text-primary leading-none tracking-tighter">
                                {getGreeting()} <br />
                                <span className="text-2xl sm:text-4xl lg:text-5xl text-accent italic font-light">{user?.firstName || 'MEMBER'}.</span>
                            </h1>
                        </div>
                        <div className="pb-4">
                            <TopupCredits />
                        </div>
                    </div>

                    {/* Pending Verification Notice */}
                    {state.orderHistory.some(o => o.status === 'PENDING_VERIFICATION') && (
                        <div className="mb-12 p-6 sm:p-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-amber-900">
                                        Manual Bank Transfer Awaiting Verification
                                    </h4>
                                    <p className="text-xs text-amber-800/80 leading-relaxed max-w-2xl">
                                        Your bank transfer order is currently being reviewed by our front desk. Once confirmed, your gym access credits and pass will be automatically activated.
                                    </p>
                                </div>
                            </div>
                            <span className="px-3.5 py-1.5 bg-amber-200/60 text-amber-950 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                                In Review
                            </span>
                        </div>
                    )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Member Pass - Left/Sticky on Desktop */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 order-2 lg:order-1">
                        <MemberPass />
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <p className="text-[10px] font-black text-text-muted tracking-[0.4em] uppercase text-center border-t border-primary/5 pt-8 w-full">
                                ACCESS SECURED • DIGITAL PASS
                            </p>
                        </div>
                    </div>

                    {/* Stats & History - Right */}
                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-20"
                        >

                            {/* Performance Meters */}
                            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard
                                    label="MEMBER STATUS"
                                    value={state.remainingCredits > 0 ? 'ACTIVE' : (state.totalCredits > 0 ? 'EXPIRED' : 'INACTIVE')}
                                    desc={state.remainingCredits > 0 ? 'Cleared for gym entrance' : 'Top-up needed for entry'}
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
                                    desc="Workouts completed"
                                    icon={Activity}
                                />
                            </motion.div>

                            {/* Activity Log - Editorial List */}
                            <motion.div variants={item} className="space-y-12">
                                <div className="flex items-end justify-between border-b border-primary/10 pb-8">
                                    <h3 className="text-3xl sm:text-4xl text-luxury text-primary">Activity <span className="text-accent italic">Log.</span></h3>
                                    <span className="text-[10px] font-black tracking-widest text-text-muted hidden sm:block">DOOR SCANS</span>
                                </div>

                                {state.checkInHistory.length === 0 ? (
                                    <div className="py-20 text-center border border-dashed border-primary/10">
                                        <p className="text-text-muted font-medium mb-8">You haven't stepped in yet. Time to get to work.</p>
                                        <Link href="/products">
                                            <button className="text-[10px] font-black text-accent tracking-[0.4em] uppercase border-b border-accent pb-2">GET STARTED &rarr;</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {state.checkInHistory.map((checkIn, idx) => (
                                            <motion.div
                                                key={checkIn.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500"
                                            >
                                                <div className="flex items-center gap-10">
                                                    <span className="text-[10px] font-black text-accent/30 tabular-nums">0{state.checkInHistory.length - idx}</span>
                                                    <div>
                                                        <h4 className={`text-xl font-bold transition-colors ${checkIn.protocol === 'MISSED' ? 'text-red-500' : 'text-primary group-hover:text-accent'}`}>
                                                            {checkIn.protocol === 'MISSED' ? 'MISSED SESSION' : `SHARERS ${checkIn.protocol}`}
                                                        </h4>
                                                        <p className="text-[10px] font-black text-text-muted tracking-widest uppercase mt-1">
                                                            {new Date(checkIn.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 sm:mt-0 flex items-center gap-4">
                                                    <span className={`px-5 py-2 text-[9px] font-black tracking-widest uppercase ${checkIn.protocol === 'MISSED' ? 'bg-red-500/10 text-red-500' : 'bg-secondary text-primary'}`}>
                                                        -1 CREDIT
                                                    </span>
                                                    <ChevronRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                            {/* Order History - Editorial List */}
                            <motion.div variants={item} className="space-y-12">
                                <div className="flex items-end justify-between border-b border-primary/10 pb-8">
                                    <h3 className="text-3xl sm:text-4xl text-luxury text-primary">Order <span className="text-accent italic">History.</span></h3>
                                    <span className="text-[10px] font-black tracking-widest text-text-muted hidden sm:block">PURCHASE RECORDS</span>
                                </div>

                                {state.orderHistory.length === 0 ? (
                                    <div className="py-20 text-center border border-dashed border-primary/10">
                                        <p className="text-text-muted font-medium mb-8">No purchases on record. Explore the collection.</p>
                                        <Link href="/products">
                                            <button className="text-[10px] font-black text-accent tracking-[0.4em] uppercase border-b border-accent pb-2">VIEW COLLECTION &rarr;</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {state.orderHistory.map((order, idx) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white border border-primary/5 hover:border-accent/20 transition-all duration-500"
                                            >
                                                <div className="flex items-center gap-10">
                                                    <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                                                        <ShoppingBag className="w-5 h-5 text-accent" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                                                            {typeof order.items === 'string' ? order.items : 
                                                             Array.isArray(order.items) ? order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') : 
                                                             'Product Order'}
                                                        </h4>
                                                        <p className="text-[10px] font-black text-text-muted tracking-widest uppercase mt-1">
                                                            REF: {order.id.substring(0, 8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 sm:mt-0 flex items-center gap-4">
                                                    <span className="px-5 py-2 bg-secondary text-[9px] font-black tracking-widest text-primary uppercase">
                                                        ₦{order.totalAmount.toLocaleString()}
                                                    </span>
                                                    {order.status === 'PENDING_VERIFICATION' ? (
                                                        <div className="px-4 py-2 text-[9px] font-black tracking-widest uppercase bg-amber-100 text-amber-900 border border-amber-300 rounded flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                                            Pending Verification
                                                        </div>
                                                    ) : (
                                                        <div className={`px-4 py-2 text-[8px] font-black tracking-widest uppercase ${
                                                            ['COMPLETED', 'PAID', 'DELIVERED'].includes(order.status) ? 'bg-green-50 text-green-600' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                                                            order.status === 'FAILED' ? 'bg-red-50 text-red-600' :
                                                            'bg-orange-50 text-orange-600'
                                                        }`}>
                                                            {order.status}
                                                        </div>
                                                    )}
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
        <div className="bg-white p-6 sm:p-10 border border-primary/5 shadow-sm group hover:border-accent/20 transition-all duration-700">
            <div className="flex justify-between items-start mb-8">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" strokeWidth={1.5} />
                <span className="text-[10px] font-black tracking-widest text-text-muted">{label}</span>
            </div>
            <div className="space-y-2">
                <p className={`font-black tracking-tighter uppercase leading-tight ${value.length > 12 ? 'text-xl sm:text-2xl md:text-3xl' : 'text-2xl sm:text-4xl md:text-5xl'} ${valueColor || 'text-primary'}`}>{value}</p>
                <p className="text-[10px] font-black text-text-muted tracking-widest uppercase">{desc}</p>
            </div>
        </div>
    )
}
