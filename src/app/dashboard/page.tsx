'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useMembership } from '@/lib/membership-context'
import MemberPass from '@/components/MemberPass'
import { Activity, Clock, Award, ChevronRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import TopupCredits from '@/components/TopupCredits'
import { useUser } from '@clerk/nextjs'

export default function DashboardPage() {
    const { state } = useMembership()
    const { isLoaded, isSignedIn, user } = useUser()

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
                            <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-6">THE MEMBER PROTOCOL</p>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-luxury text-primary leading-none tracking-tighter">
                                WELCOME <br />
                                <span className="text-2xl sm:text-4xl lg:text-5xl text-accent italic font-light">{user?.firstName || 'MEMBER'}.</span>
                            </h1>
                        </div>
                        <div className="pb-4">
                            <TopupCredits />
                        </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Member Pass - Left/Sticky on Desktop */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 order-2 lg:order-1">
                        <MemberPass />
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <p className="text-[10px] font-black text-text-muted tracking-[0.4em] uppercase text-center border-t border-primary/5 pt-8 w-full">
                                ACCESS SECURED • DIGITAL PROTOCOL
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
                                    label="CREDIT STATUS"
                                    value={`${state.remainingCredits} / ${state.totalCredits}`}
                                    desc="Total sessions active"
                                    icon={Clock}
                                />
                                <StatCard
                                    label="ACCESS TIER"
                                    value={state.tier === 'NONE' ? 'BASIC' : state.tier}
                                    desc={`${state.tier} Member level`}
                                    icon={Award}
                                />
                                <StatCard
                                    label="PROTOCOLS"
                                    value={state.checkInHistory.length.toString()}
                                    desc="Total completed sessions"
                                    icon={Activity}
                                />
                            </motion.div>

                            {/* Activity Log - Editorial List */}
                            <motion.div variants={item} className="space-y-12">
                                <div className="flex items-end justify-between border-b border-primary/10 pb-8">
                                    <h3 className="text-3xl sm:text-4xl text-luxury text-primary">Protocol <span className="text-accent italic">History.</span></h3>
                                    <span className="text-[10px] font-black tracking-widest text-text-muted hidden sm:block">LATEST UPDATES</span>
                                </div>

                                {state.checkInHistory.length === 0 ? (
                                    <div className="py-20 text-center border border-dashed border-primary/10">
                                        <p className="text-text-muted font-medium mb-8">You haven't stepped in yet. Time to get to work.</p>
                                        <Link href="/products">
                                            <button className="text-[10px] font-black text-accent tracking-[0.4em] uppercase border-b border-accent pb-2">START THE PROTOCOL &rarr;</button>
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
                                                        <h4 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">SHARERS {checkIn.protocol}</h4>
                                                        <p className="text-[10px] font-black text-text-muted tracking-widest uppercase mt-1">
                                                            {new Date(checkIn.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 sm:mt-0 flex items-center gap-4">
                                                    <span className="px-5 py-2 bg-secondary text-[9px] font-black tracking-widest text-primary uppercase">-1 CREDIT</span>
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
                                                    <div className={`px-4 py-2 text-[8px] font-black tracking-widest uppercase ${order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {order.status}
                                                    </div>
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

function StatCard({ label, value, desc, icon: Icon }: { label: string, value: string, desc: string, icon: any }) {
    return (
        <div className="bg-white p-6 sm:p-10 border border-primary/5 shadow-sm group hover:border-accent/20 transition-all duration-700">
            <div className="flex justify-between items-start mb-8">
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" strokeWidth={1.5} />
                <span className="text-[10px] font-black tracking-widest text-text-muted">{label}</span>
            </div>
            <div className="space-y-2">
                <p className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tighter">{value}</p>
                <p className="text-[10px] font-black text-text-muted tracking-widest uppercase">{desc}</p>
            </div>
        </div>
    )
}
