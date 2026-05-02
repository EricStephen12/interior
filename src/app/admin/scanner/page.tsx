'use client'

import { useState } from 'react'
import { QrCode, CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function QRScannerPage() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle')

  const handleScan = async () => {
    setScanStatus('scanning')
    try {
      // Hit the API to deduct a credit
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHECK_IN', protocol: 'Gym Access Scan' })
      })
      if (res.ok) {
        setScanStatus('success')
      } else {
        setScanStatus('failed')
      }
    } catch {
      setScanStatus('failed')
    }
  }

  return (
    <div className="admin-page-container flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black font-playfair uppercase text-primary mb-2">Access Scanner</h1>
        <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">Validate Member Passes</p>
      </div>

      <div className="relative w-full max-w-md aspect-square bg-secondary/50 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-8">
        {scanStatus === 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-primary/40"
          >
            <QrCode className="w-32 h-32 mb-6" />
            <p className="text-xs uppercase font-black tracking-widest">Awaiting Scan...</p>
          </motion.div>
        )}

        {scanStatus === 'scanning' && (
          <motion.div 
            className="absolute inset-0 bg-accent/10 border-2 border-accent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_rgba(99,102,241,1)]" 
                 style={{ animation: 'scan 2s linear infinite' }} />
            <div className="h-full flex items-center justify-center">
               <p className="text-accent text-xs uppercase font-black tracking-widest bg-white/80 px-4 py-2">Authenticating...</p>
            </div>
            <style jsx>{`
              @keyframes scan {
                0% { top: 0; }
                50% { top: 100%; }
                100% { top: 0; }
              }
            `}</style>
          </motion.div>
        )}

        {scanStatus === 'success' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-green-600"
          >
            <CheckCircle2 className="w-32 h-32 mb-6" />
            <p className="text-xl font-black uppercase tracking-widest mb-2">ACCESS GRANTED</p>
            <p className="text-[10px] text-primary/60 tracking-widest uppercase">Obsidian Member Verified</p>
          </motion.div>
        )}

        {scanStatus === 'failed' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-red-600"
          >
            <XCircle className="w-32 h-32 mb-6" />
            <p className="text-xl font-black uppercase tracking-widest mb-2">ACCESS DENIED</p>
            <p className="text-[10px] text-primary/60 tracking-widest uppercase">Pass Expired or Invalid</p>
          </motion.div>
        )}
      </div>

      <div className="mt-12 space-x-4">
        <button 
          onClick={handleScan}
          disabled={scanStatus === 'scanning'}
          className="btn-primary"
        >
          {scanStatus === 'idle' ? 'SIMULATE SCAN' : 'SCAN NEXT'}
        </button>
        <button 
          onClick={() => setScanStatus('idle')}
          className="btn-secondary"
        >
          RESET
        </button>
      </div>
    </div>
  )
}
