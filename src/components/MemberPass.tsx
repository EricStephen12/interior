'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useMembership } from '@/lib/membership-context'
import { Shield } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function MemberPass() {
    const { state } = useMembership()
    
    // The value to be encoded in the QR code - unique to each member
    const passValue = `SHARERS_PASS_${state.memberId || 'PENDING'}`

    return (
        <div className="w-full max-w-sm mx-auto relative group">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-primary overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
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
                        className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-accent blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -40, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-accent-light/30 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 p-5 sm:p-8 flex flex-col text-white font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 sm:mb-8">
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-[10px] font-black tracking-[0.4em] text-accent">OFFICIAL PASS</p>
                            <h2 className="text-lg sm:text-2xl font-black tracking-tight">SHARERS GYM</h2>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent opacity-50" />
                    </div>

                    {/* QR Container */}
                    <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-6 sm:py-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative p-4 sm:p-6 bg-white shadow-2xl"
                        >
                            {/* QR Alignment Markers */}
                            <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] sm:border-t-4 border-l-[3px] sm:border-l-4 border-accent -translate-x-1.5 sm:-translate-x-2 -translate-y-1.5 sm:-translate-y-2" />
                            <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] sm:border-t-4 border-r-[3px] sm:border-r-4 border-accent translate-x-1.5 sm:translate-x-2 -translate-y-1.5 sm:-translate-y-2" />
                            <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] sm:border-b-4 border-l-[3px] sm:border-l-4 border-accent -translate-x-1.5 sm:-translate-x-2 translate-y-1.5 sm:translate-y-2" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] sm:border-b-4 border-r-[3px] sm:border-r-4 border-accent translate-x-1.5 sm:translate-x-2 translate-y-1.5 sm:translate-y-2" />

                            <div className="p-2 sm:p-3 bg-white">
                                <QRCodeSVG 
                                    value={passValue} 
                                    size={160}
                                    level="H"
                                    includeMargin={false}
                                    className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48"
                                />
                            </div>

                            {/* Scanning Animation */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-accent/30 z-20"
                            />
                        </motion.div>

                        <p className="text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] text-white/40 uppercase">ID: {state.memberId}</p>
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex justify-between items-end border-t border-white/10 pt-4 sm:pt-6">
                            <div>
                                <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-accent uppercase mb-1">AVAILABILITY</p>
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-2xl sm:text-4xl font-black">{state.remainingCredits}</span>
                                    <span className="text-xs sm:text-lg font-bold text-white/50 lowercase">/ {state.totalCredits} days</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-white/40 mb-1 uppercase">MEMBER LEVEL</p>
                                <p className="text-[10px] sm:text-sm font-black text-white uppercase">{state.tier === 'NONE' ? 'BASIC' : state.tier}</p>
                            </div>
                        </div>

                        {/* Holographic Tag */}
                        <div className="h-5 sm:h-6 w-full relative overflow-hidden bg-white/5 flex items-center justify-center">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            />
                            <span className="text-[6px] sm:text-[8px] font-black tracking-[0.4em] sm:tracking-[0.6em] text-white/20">AUTHENTICATED DIGITAL ASSET</span>
                        </div>
                    </div>
                </div>

                {/* Grain Overlay */}
                <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
            </motion.div>

            {/* Glow */}
            <div className="absolute -inset-4 bg-accent/20 blur-[60px] -z-10 group-hover:bg-accent/30 transition-all duration-700 opacity-20" />
        </div>
    )
}
