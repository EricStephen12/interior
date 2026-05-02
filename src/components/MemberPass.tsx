'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useMembership } from '@/lib/membership-context'
import { QrCode, Shield, Activity, Calendar } from 'lucide-react'

export default function MemberPass() {
    const { state } = useMembership()

    return (
        <div className="max-w-md mx-auto relative group">
            {/* Editorial Card Effect */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[3/4] bg-primary rounded-none overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 opacity-20">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0],
                            y: [0, -20, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -40, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-light/30 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black tracking-[0.4em] text-accent">OFFICIAL PASS</p>
                            <h2 className="text-2xl font-black tracking-tight">SHARERS GYM</h2>
                        </div>
                        <Shield className="w-8 h-8 text-accent opacity-50" />
                    </div>

                    {/* QR Container - The "Scanner" */}
                    <div className="flex flex-col items-center justify-center space-y-6 flex-1 py-12">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-6 bg-white rounded-none shadow-2xl group/qr"
                        >
                            {/* Fake QR Alignment Markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent -translate-x-2 -translate-y-2"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent translate-x-2 -translate-y-2"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent -translate-x-2 translate-y-2"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent translate-x-2 translate-y-2"></div>

                            <QrCode className="w-48 h-48 text-primary" strokeWidth={1.5} />

                            {/* Scanning Animation Line */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-accent/30 z-20"
                            />
                        </motion.div>

                        <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">ID: {state.memberId}</p>
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                            <div>
                                <p className="text-[9px] font-black tracking-widest text-accent uppercase mb-1">AVAILABILITY</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black">{state.remainingCredits}</span>
                                    <span className="text-lg font-bold text-white/50 lowercase">/ {state.totalCredits} days</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black tracking-widest text-white/40 mb-1 uppercase">MEMBER LEVEL</p>
                                <p className="text-sm font-black text-white uppercase">{state.tier === 'NONE' ? 'BASIC' : `${state.tier} ELITE`}</p>
                            </div>
                        </div>

                        {/* Holographic Finish Tag */}
                        <div className="h-6 w-full relative overflow-hidden bg-white/5 rounded-none flex items-center justify-center">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            />
                            <span className="text-[8px] font-black tracking-[0.6em] text-white/20">AUTHENTICATED DIGITAL ASSET</span>
                        </div>
                    </div>
                </div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none"></div>
            </motion.div>

            {/* Decorative Drop Shadow for Card */}
            <div className="absolute -inset-4 bg-accent/20 blur-[60px] -z-10 group-hover:bg-accent/30 transition-all duration-700 opacity-20"></div>
        </div>
    )
}
