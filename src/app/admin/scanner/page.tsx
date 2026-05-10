'use client'

import { useState, useEffect } from 'react'
import { QrCode, CheckCircle2, XCircle, AlertTriangle, Clock, CreditCard, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'

type ScanResult = {
  status: 'idle' | 'scanning' | 'success' | 'denied' | 'duplicate' | 'error'
  message?: string
  member?: { name?: string; email?: string; credits: number }
  lowCredit?: boolean
}

export default function QRScannerPage() {
  const [scan, setScan] = useState<ScanResult>({ status: 'idle' })
  const [cameraActive, setCameraActive] = useState(false)

  const processScan = async (rawCode: string) => {
    if (!rawCode.trim()) return;

    setScan({ status: 'scanning' })
    setCameraActive(false); // Turn off camera upon scan
    
    const memberId = rawCode.startsWith('SHARERS_PASS_') ? rawCode.replace('SHARERS_PASS_', '') : rawCode;

    try {
      const res = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CHECK_IN', protocol: 'Gym Access Scan', memberId })
      })
      const data = await res.json()

      if (res.ok) {
        setScan({
          status: 'success',
          member: data.user,
          lowCredit: data.lowCredit,
          message: data.lowCredit ? `⚠ Only ${data.creditsRemaining} credit${data.creditsRemaining !== 1 ? 's' : ''} left` : undefined
        })
      } else if (res.status === 409) {
        setScan({ status: 'duplicate', message: data.error })
      } else {
        setScan({ status: 'denied', message: data.error || 'Access denied' })
      }
    } catch {
      setScan({ status: 'error', message: 'Network error — check your connection and try again.' })
    }
  }

  const reset = () => {
    setScan({ status: 'idle' })
    setCameraActive(false)
  }

  useEffect(() => {
    if (!cameraActive) return;

    let html5QrCode: Html5Qrcode;
    
    const startScanner = async () => {
      html5QrCode = new Html5Qrcode("qr-reader");
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            html5QrCode.pause();
            processScan(decodedText);
          },
          (error) => {
            // ignore background scan errors
          }
        );
      } catch (err) {
        console.error("Camera startup error:", err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive])

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-black font-display uppercase text-primary mb-2">Access Scanner</h1>
        <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">Validate Member Passes</p>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-secondary/50 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-8 overflow-hidden">

        {cameraActive && (
           <div id="qr-reader" className="w-full h-full absolute inset-0 z-10 [&_video]:object-cover" />
        )}

        {!cameraActive && scan.status === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-primary/40">
            <QrCode className="w-24 h-24 sm:w-32 sm:h-32 mb-6" />
            <p className="text-xs uppercase font-black tracking-widest">Ready to Scan</p>
          </motion.div>
        )}

        {scan.status === 'scanning' && (
          <motion.div className="absolute inset-0 bg-accent/10 border-2 border-accent" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_rgba(99,102,241,1)]" style={{ animation: 'scan 2s linear infinite' }} />
            <div className="h-full flex items-center justify-center">
              <p className="text-accent text-xs uppercase font-black tracking-widest bg-white/80 px-4 py-2">Authenticating...</p>
            </div>
            <style jsx>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
          </motion.div>
        )}

        {scan.status === 'success' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <CheckCircle2 className="w-24 h-24 sm:w-32 sm:h-32 mb-6 text-green-600" />
            <p className="text-lg sm:text-xl font-black uppercase tracking-widest mb-2 text-green-600">ACCESS GRANTED</p>
            {scan.member && (
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-primary">{scan.member.name || scan.member.email}</p>
                <p className="text-[10px] text-primary/60 tracking-widest uppercase flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" /> {scan.member.credits} credits remaining
                </p>
              </div>
            )}
            {scan.lowCredit && (
              <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> {scan.message}
              </div>
            )}
          </motion.div>
        )}

        {scan.status === 'duplicate' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-amber-600">
            <Clock className="w-24 h-24 sm:w-32 sm:h-32 mb-6" />
            <p className="text-lg sm:text-xl font-black uppercase tracking-widest mb-2">ALREADY CHECKED IN</p>
            <p className="text-[10px] text-primary/60 tracking-widest uppercase text-center max-w-xs">{scan.message}</p>
          </motion.div>
        )}

        {scan.status === 'denied' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-red-600">
            <XCircle className="w-24 h-24 sm:w-32 sm:h-32 mb-6" />
            <p className="text-lg sm:text-xl font-black uppercase tracking-widest mb-2">ACCESS DENIED</p>
            <p className="text-[10px] text-primary/60 tracking-widest uppercase text-center max-w-xs">{scan.message}</p>
          </motion.div>
        )}

        {scan.status === 'error' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-red-500">
            <AlertTriangle className="w-24 h-24 sm:w-32 sm:h-32 mb-6" />
            <p className="text-lg sm:text-xl font-black uppercase tracking-widest mb-2">CONNECTION ERROR</p>
            <p className="text-[10px] text-primary/60 tracking-widest uppercase text-center max-w-xs">{scan.message}</p>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-sm">
        <button 
          onClick={() => { setScan({status: 'idle'}); setCameraActive(true); }} 
          disabled={cameraActive}
          className="flex-1 bg-accent text-white px-4 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" /> LIVE CAMERA
        </button>
        <button 
          onClick={reset} 
          className="flex-1 border border-primary/10 text-primary px-4 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
        >
          RESET
        </button>
      </div>
    </div>
  )
}
