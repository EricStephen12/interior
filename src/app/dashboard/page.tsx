'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useMembership } from '@/lib/membership-context'
import MemberPass from '@/components/MemberPass'
import { Activity, Clock, Award, ChevronRight, Play } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    const { state, checkIn, resetMembership } = useMembership()

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
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-16 md:mb-24"
                >
                    <p className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4">THE MEMBER PROTOCOL</p>
                    <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-luxury text-primary leading-none tracking-tighter">
                        THE <br />
                        <span className="text-accent italic font-light">DASHBOARD.</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Member Pass - Left/Sticky on Desktop */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 order-2 lg:order-1">
                        <MemberPass />

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => checkIn('Daily Protocol')}
                            disabled={state.remainingCredits <= 0}
                            className="w-full mt-12 btn-elite group py-8 text-white shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center gap-4">
                                <Play className="w-5 h-5 fill-current" />
                                SIMULATE ENTRANCE SCAN
                            </span>
                        </motion.button>

                        <div className="flex flex-col items-center gap-4 mt-6">
                            <p className="text-[10px] font-black text-text-muted tracking-widest uppercase text-center">
                                * Subtracts 1 session upon entry
                            </p>
                            <button
                                onClick={resetMembership}
                                className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors pt-4 underline"
                            >
                                Reset Pass & Refill Credits
                            </button>
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
                                    value="BLACK"
                                    desc="Obsidian Member level"
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

                            {/* Recovery Banner */}
                            <motion.div
                                variants={item}
                                className="relative overflow-hidden bg-primary p-12 md:p-20 text-white"
                            >
                                <div className="relative z-10 space-y-8 max-w-xl">
                                    <p className="text-[10px] font-black tracking-[0.5em] text-accent-light uppercase">RECOVERY LOUNGE</p>
                                    <h3 className="text-4xl sm:text-5xl md:text-7xl text-luxury leading-none">Accelerate <br /> Recovery.</h3>
                                    <p className="text-white/60 font-medium leading-relaxed">
                                        The work doesn't end when the set does. Recovery is where the body actually changes — and this protocol makes sure you don't leave that part to chance.
                                    </p>
                                    <button className="text-[10px] font-black tracking-[0.5em] uppercase border-b-2 border-accent pb-4 hover:tracking-[0.8em] transition-all duration-700">
                                        BOOK RECOVERY &rarr;
                                    </button>
                                </div>
                                {/* Decorative background logo */}
                                <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none translate-x-1/2">
                                    <span className="text-[30vw] font-black leading-none">SHARERS</span>
                                </div>
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
        <div className="bg-white p-10 border border-primary/5 shadow-sm group hover:border-accent/20 transition-all duration-700">
            <div className="flex justify-between items-start mb-8">
                <Icon className="w-8 h-8 text-accent opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" strokeWidth={1.5} />
                <span className="text-[10px] font-black tracking-widest text-text-muted">{label}</span>
            </div>
            <div className="space-y-2">
                <p className="text-5xl font-black text-primary tracking-tighter">{value}</p>
                <p className="text-[10px] font-black text-text-muted tracking-widest uppercase">{desc}</p>
            </div>
        </div>
    )
}
