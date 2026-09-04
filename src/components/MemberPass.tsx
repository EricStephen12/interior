'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMembership, getActivePassInfo } from '@/lib/membership-context'
import { Shield, Download, QrCode, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { t } from '@/lib/theme'
import { useToast } from '@/components/ToastProvider'

export default function MemberPass() {
    const { state } = useMembership()
    const activePlan = getActivePassInfo(state)
    const { showToast } = useToast()
    const [isEmailing, setIsEmailing] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [isDownloadingCard, setIsDownloadingCard] = useState(false)

    // Hidden QR canvas ref used for extracting image data
    const qrCanvasRef = useRef<HTMLCanvasElement | null>(null)
    
    // The unique access value encoded in the QR code
    const passValue = `SHARERS_PASS_${state.memberId || 'PENDING'}`

    /**
     * Download Member ID Card (Custom High-Resolution Graphic)
     */
    const handleDownloadIdCard = async () => {
        setIsDownloadingCard(true)
        try {
            const qrCanvas = qrCanvasRef.current
            if (!qrCanvas) {
                showToast('Unable to capture QR code for card', 'error')
                setIsDownloadingCard(false)
                return
            }

            // Create off-screen canvas for high-res ID Card (600x920)
            const canvas = document.createElement('canvas')
            canvas.width = 600
            canvas.height = 920
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                showToast('Canvas rendering unsupported', 'error')
                setIsDownloadingCard(false)
                return
            }

            // 1. Background gradient (Obsidian luxury theme)
            const bgGrad = ctx.createLinearGradient(0, 0, 600, 920)
            bgGrad.addColorStop(0, '#0a0b0e')
            bgGrad.addColorStop(0.5, '#12151d')
            bgGrad.addColorStop(1, '#08090c')
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, 600, 920)

            // 2. Card Outer Border & Gold accent rim
            ctx.strokeStyle = '#222736'
            ctx.lineWidth = 4
            ctx.strokeRect(20, 20, 560, 880)

            ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
            ctx.lineWidth = 1.5
            ctx.strokeRect(28, 28, 544, 864)

            // Gold Corner Target Brackets
            const drawBracket = (x: number, y: number, dirX: number, dirY: number) => {
                ctx.strokeStyle = '#d4af37'
                ctx.lineWidth = 3.5
                ctx.beginPath()
                ctx.moveTo(x, y + dirY * 24)
                ctx.lineTo(x, y)
                ctx.lineTo(x + dirX * 24, y)
                ctx.stroke()
            }
            drawBracket(34, 34, 1, 1)
            drawBracket(566, 34, -1, 1)
            drawBracket(34, 886, 1, -1)
            drawBracket(566, 886, -1, -1)

            // 3. Header Badge: Plan Type
            const badgeText = activePlan.isHourly
                ? 'HOURLY ACCESS PASS'
                : activePlan.planType === 'MEMBERSHIP'
                ? 'VIP ALL-ACCESS PASS'
                : 'DAY ACCESS PASS'

            ctx.fillStyle = 'rgba(212, 175, 55, 0.15)'
            ctx.fillRect(200, 56, 200, 26)
            ctx.strokeStyle = '#d4af37'
            ctx.lineWidth = 1
            ctx.strokeRect(200, 56, 200, 26)

            ctx.fillStyle = '#d4af37'
            ctx.font = 'bold 11px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(badgeText, 300, 73)

            // 4. Header: Club Title
            ctx.fillStyle = '#ffffff'
            ctx.font = '900 32px sans-serif'
            ctx.fillText('SHARERS GYM', 300, 128)

            // Thin divider
            ctx.strokeStyle = '#222736'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(60, 155)
            ctx.lineTo(540, 155)
            ctx.stroke()

            // 5. White QR Container
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(160, 185, 280, 280)
            ctx.strokeStyle = '#ffffff'
            ctx.strokeRect(160, 185, 280, 280)

            // Draw QR Code from the rendered canvas
            ctx.drawImage(qrCanvas, 180, 205, 240, 240)

            // QR Gold Target brackets
            drawBracket(152, 177, 1, 1)
            drawBracket(448, 177, -1, 1)
            drawBracket(152, 473, 1, -1)
            drawBracket(448, 473, -1, -1)

            // 6. Plan Title & Member ID
            ctx.fillStyle = '#ffffff'
            ctx.font = '900 20px sans-serif'
            ctx.fillText((activePlan.planName || 'Digital Access Pass').toUpperCase(), 300, 510)

            ctx.fillStyle = '#d4af37'
            ctx.font = 'bold 13px monospace'
            ctx.fillText(`ID: ${state.memberId || 'SG-PENDING'}`, 300, 534)

            // 7. Balance & Tier Stats Box
            ctx.fillStyle = '#12151e'
            ctx.fillRect(60, 565, 480, 140)
            ctx.strokeStyle = '#252a38'
            ctx.strokeRect(60, 565, 480, 140)

            // Left: Credits
            ctx.textAlign = 'left'
            ctx.fillStyle = '#d4af37'
            ctx.font = 'bold 11px sans-serif'
            ctx.fillText('ACCESS BALANCE', 90, 605)

            ctx.fillStyle = '#ffffff'
            ctx.font = '900 36px sans-serif'
            ctx.fillText(String(state.remainingCredits), 90, 650)

            ctx.fillStyle = '#8a93a5'
            ctx.font = 'bold 13px sans-serif'
            ctx.fillText(`/ ${state.totalCredits || state.remainingCredits} ${activePlan.unitLabel} remaining`, 145, 646)

            // Right: Tier
            ctx.textAlign = 'right'
            ctx.fillStyle = '#8a93a5'
            ctx.font = 'bold 11px sans-serif'
            ctx.fillText('MEMBER TIER', 510, 605)

            ctx.fillStyle = '#d4af37'
            ctx.font = '900 18px sans-serif'
            ctx.fillText((state.tier === 'NONE' ? 'STANDARD' : state.tier).toUpperCase(), 510, 642)

            // 8. Security Hologram Band
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
            ctx.fillRect(60, 730, 480, 34)
            ctx.strokeStyle = '#2a2f3e'
            ctx.strokeRect(60, 730, 480, 34)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#8a93a5'
            ctx.font = 'bold 10px sans-serif'
            ctx.fillText('AUTHENTICATED ACCESS CREDENTIAL • PRESENT AT ENTRANCE', 300, 751)

            // 9. Footer
            ctx.fillStyle = '#555d6e'
            ctx.font = '10px sans-serif'
            ctx.fillText('SHARERS GYM • www.sharersgym.com', 300, 830)

            // 10. Trigger Download
            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `sharers-gym-id-card-${state.memberId || 'pass'}.png`
            link.href = dataUrl
            link.click()

            showToast('Member ID Card Downloaded', 'success', 'Saved to your device photos/downloads')
        } catch (err) {
            console.error('Download ID card error:', err)
            showToast('Failed to generate ID Card', 'error')
        } finally {
            setIsDownloadingCard(false)
        }
    }

    /**
     * Download Clean QR Code (PNG)
     */
    const handleDownloadQrOnly = () => {
        try {
            const qrCanvas = qrCanvasRef.current
            if (!qrCanvas) {
                showToast('QR code not ready', 'error')
                return
            }

            // Create clean 400x440 canvas with white background and text
            const canvas = document.createElement('canvas')
            canvas.width = 400
            canvas.height = 440
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, 400, 440)

            // Draw QR code centered
            ctx.drawImage(qrCanvas, 50, 40, 300, 300)

            // Label
            ctx.fillStyle = '#0a0b0e'
            ctx.font = 'bold 14px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('SHARERS GYM ACCESS QR', 200, 375)

            ctx.fillStyle = '#888888'
            ctx.font = 'bold 11px monospace'
            ctx.fillText(`ID: ${state.memberId || 'PASS'}`, 200, 400)

            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `sharers-gym-qr-${state.memberId || 'code'}.png`
            link.href = dataUrl
            link.click()

            showToast('QR Code Saved', 'success', 'Saved as PNG image')
        } catch (err) {
            console.error('Download QR error:', err)
            showToast('Failed to save QR code', 'error')
        }
    }

    /**
     * Email My Pass & QR via Resend
     */
    const handleEmailPass = async () => {
        if (isEmailing) return
        setIsEmailing(true)
        setEmailSent(false)

        try {
            const qrCanvas = qrCanvasRef.current
            const qrCodeDataUrl = qrCanvas ? qrCanvas.toDataURL('image/png') : undefined

            const res = await fetch('/api/membership/send-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrCodeDataUrl,
                    planName: activePlan.planName,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send pass email')
            }

            setEmailSent(true)
            showToast('Pass Emailed Successfully', 'success', `Delivered to your email via Resend`)
            setTimeout(() => setEmailSent(false), 5000)
        } catch (err: any) {
            console.error('Email pass error:', err)
            showToast(err?.message || 'Could not email pass', 'error')
        } finally {
            setIsEmailing(false)
        }
    }

    return (
        <div className="w-full max-w-sm mx-auto relative group">
            {/* Hidden High-Res QR Canvas for Image Exports */}
            <div className="hidden">
                <QRCodeCanvas
                    ref={qrCanvasRef}
                    value={passValue}
                    size={300}
                    level="H"
                    includeMargin={false}
                />
            </div>

            {/* Visual Digital Pass Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-primary overflow-hidden border border-white/10 premium-glow-card"
                style={{ boxShadow: t.memberPass.cardShadow }}
            >
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 opacity-20">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0],
                            y: [0, -20, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-accent blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -40, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-accent-light/30 blur-[120px] rounded-full"
                    />
                </div>

                <div className="relative z-10 p-5 sm:p-8 flex flex-col text-white font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 sm:mb-8">
                        <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 bg-accent/20 border border-accent/40 text-[9px] font-black tracking-[0.25em] text-accent uppercase">
                                {activePlan.isHourly ? 'HOURLY ACCESS PASS' : activePlan.planType === 'MEMBERSHIP' ? 'VIP MEMBERSHIP' : 'DAY ACCESS PASS'}
                            </span>
                            <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-1">SHARERS GYM</h2>
                        </div>
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-accent opacity-60" />
                    </div>

                    {/* QR Container */}
                    <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-4 sm:py-8">
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
                                <QRCodeCanvas
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
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="absolute left-0 right-0 h-[2px] bg-accent/30 z-20"
                            />
                        </motion.div>

                        <div className="text-center space-y-0.5">
                            <p className="text-[11px] font-black uppercase tracking-wider text-white">
                                {activePlan.planName}
                            </p>
                            <p className="text-[9px] font-bold tracking-[0.25em] text-white/50 uppercase">
                                ID: {state.memberId || 'PENDING'}
                            </p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex justify-between items-end border-t border-white/10 pt-4 sm:pt-6">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-accent uppercase mb-1">
                                    ACCESS BALANCE
                                </p>
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-2xl sm:text-4xl font-black">{state.remainingCredits}</span>
                                    <span className="text-xs sm:text-sm font-bold text-white/60 lowercase">
                                        / {state.totalCredits} remaining
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold tracking-wider text-white/50 mb-1 uppercase">MEMBER TIER</p>
                                <p className="text-xs sm:text-sm font-black text-white uppercase truncate max-w-[130px]">
                                    {state.tier === 'NONE' ? 'STANDARD' : state.tier}
                                </p>
                            </div>
                        </div>

                        {/* Holographic Tag */}
                        <div className="h-5 sm:h-6 w-full relative overflow-hidden bg-white/5 flex items-center justify-center">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            />
                            <span className="text-[9px] font-bold tracking-[0.3em] text-white/40 uppercase">
                                AUTHENTICATED {activePlan.isHourly ? 'HOURLY' : 'DAY'} PASS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grain Overlay */}
                <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
            </motion.div>

            {/* Quick Actions: Download ID Card / Save QR / Email via Resend */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 space-y-2"
            >
                <div className="grid grid-cols-2 gap-2">
                    {/* 1. Download ID Card */}
                    <button
                        type="button"
                        onClick={handleDownloadIdCard}
                        disabled={isDownloadingCard}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-white hover:bg-black/90 active:scale-[0.98] border border-white/10 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                        title="Download full card with QR and member details"
                    >
                        {isDownloadingCard ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                        ) : (
                            <Download className="w-3.5 h-3.5 text-accent" />
                        )}
                        <span>ID Card</span>
                    </button>

                    {/* 2. Download QR Code Only */}
                    <button
                        type="button"
                        onClick={handleDownloadQrOnly}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-white hover:bg-black/90 active:scale-[0.98] border border-white/10 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                        title="Save clean QR code for phone lock screen"
                    >
                        <QrCode className="w-3.5 h-3.5 text-accent" />
                        <span>Save QR</span>
                    </button>
                </div>

                {/* 3. Send to Email via Resend */}
                <button
                    type="button"
                    onClick={handleEmailPass}
                    disabled={isEmailing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 active:scale-[0.98] text-primary border border-primary/10 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                >
                    {isEmailing ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                            <span>Sending via Resend...</span>
                        </>
                    ) : emailSent ? (
                        <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Pass Emailed to You</span>
                        </>
                    ) : (
                        <>
                            <Mail className="w-3.5 h-3.5 text-accent" />
                            <span>Email My Pass & QR</span>
                        </>
                    )}
                </button>
            </motion.div>

            {/* Pulsing Background Glow */}
            <motion.div
                animate={{
                    scale: [0.95, 1.05, 0.95],
                    opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -inset-4 bg-accent/25 blur-[60px] -z-10 rounded-full"
            />
        </div>
    )
}
