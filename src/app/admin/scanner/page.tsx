'use client'

import { useState, useEffect, useRef } from 'react'
import { QrCode, CheckCircle2, XCircle, AlertTriangle, Clock, CreditCard, Camera, Search, UserCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'

type ScanResult = {
  status: 'idle' | 'scanning' | 'success' | 'denied' | 'duplicate' | 'error'
  message?: string
  member?: { name?: string; email?: string; credits: number }
  lowCredit?: boolean
}

// Synth beep generator using Web Audio API
const playBeep = (type: 'success' | 'duplicate' | 'error') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Pleasant double synth chime (C5 to E5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.08);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === 'duplicate') {
      // Warning chime (D4 double beep)
      const playTone = (timeOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(293.66, ctx.currentTime + timeOffset); // D4
        gain.gain.setValueAtTime(0.1, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.15);
      };
      playTone(0);
      playTone(0.18);
    } else {
      // Low error buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime); // C3 low buzz
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.error('Audio synthesizer failed:', e);
  }
}

export default function QRScannerPage() {
  const [scan, setScan] = useState<ScanResult>({ status: 'idle' })
  const [cameraActive, setCameraActive] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMembers, setLoadingMembers] = useState(true)
  const autoDismissRef = useRef<NodeJS.Timeout | null>(null)

  // Load members for manual search
  useEffect(() => {
    fetch('/api/admin/users/list')
      .then(res => res.json())
      .then(data => {
        setMembers(data.users || [])
        setLoadingMembers(false)
      })
      .catch(() => setLoadingMembers(false))
  }, [])

  const processScan = async (rawCode: string) => {
    if (!rawCode.trim()) return;

    // Clear any active auto-dismiss timer
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current)

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
          message: data.lowCredit ? `Only ${data.creditsRemaining} credits left` : undefined
        })
        playBeep('success')
      } else if (res.status === 409) {
        setScan({ status: 'duplicate', message: data.error })
        playBeep('duplicate')
      } else {
        setScan({ status: 'denied', message: data.error || 'Access denied' })
        playBeep('error')
      }
    } catch {
      setScan({ status: 'error', message: 'Network error — check connection.' })
      playBeep('error')
    }
  }

  const reset = () => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current)
    setScan({ status: 'idle' })
    setCameraActive(false)
  }

  // Auto-dismiss full screen flash card alert after 3 seconds
  useEffect(() => {
    if (scan.status !== 'idle' && scan.status !== 'scanning') {
      autoDismissRef.current = setTimeout(() => {
        reset()
      }, 3000)
    }
    return () => {
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current)
    }
  }, [scan.status])

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

  // Filter members list based on fuzzy search
  const filteredMembers = searchQuery.trim() === '' 
    ? []
    : members.filter(m => 
        (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.memberId || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Display top 5 matches only

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center min-h-screen relative font-sans">
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-4xl font-black font-display uppercase text-primary mb-2">Access Scanner</h1>
        <p className="text-[10px] tracking-[0.3em] uppercase text-text-muted">Validate Member Passes</p>
      </div>

      {/* Main Scanner Box */}
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
          <motion.div className="absolute inset-0 bg-accent/10 border-2 border-accent z-20" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_rgba(99,102,241,1)]" style={{ animation: 'scan 2s linear infinite' }} />
            <div className="h-full flex items-center justify-center">
              <p className="text-accent text-xs uppercase font-black tracking-widest bg-white/85 px-6 py-3 border border-accent/10 shadow-xl">Authenticating...</p>
            </div>
            <style jsx>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-sm sm:max-w-md">
        <button 
          onClick={() => { setScan({status: 'idle'}); setCameraActive(true); }} 
          disabled={cameraActive}
          className="flex-1 bg-accent text-white px-4 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shimmer-btn"
        >
          <Camera className="w-4 h-4" /> LIVE CAMERA
        </button>
        <button 
          onClick={reset} 
          className="flex-1 border border-primary/10 text-primary px-4 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95"
        >
          CLOSE CAMERA
        </button>
      </div>

      {/* Manual Search Check-in Section */}
      <div className="w-full max-w-sm sm:max-w-md mt-16 border-t border-primary/5 pt-12 space-y-6">
        <div className="border-l-2 border-accent pl-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Manual Lookup</h2>
          <p className="text-[8px] text-text-muted uppercase tracking-widest mt-1">Check in members by name or ID</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search member name, email or ID..."
            className="w-full pl-12 pr-6 py-4 bg-secondary/30 border border-transparent rounded-none focus:ring-0 focus:bg-white focus:border-accent/20 transition-all text-xs font-bold text-primary placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Real-time search results drop down */}
        <AnimatePresence>
          {filteredMembers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-primary/5 shadow-2xl p-2 divide-y divide-primary/5"
            >
              {filteredMembers.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                  <div className="text-left space-y-1 max-w-[70%]">
                    <p className="text-xs font-bold text-primary truncate">{m.name || 'Anonymous User'}</p>
                    <p className="text-[8px] text-text-muted uppercase tracking-widest truncate">{m.email}</p>
                    <p className="text-[8px] text-accent font-black tracking-widest uppercase truncate">ID: {m.memberId}</p>
                  </div>
                  <button
                    onClick={() => {
                      processScan(m.memberId)
                      setSearchQuery('')
                    }}
                    className="bg-primary hover:bg-accent text-white text-[9px] font-black tracking-widest uppercase px-4 py-2.5 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> CHECK IN ({m.credits})
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {searchQuery && filteredMembers.length === 0 && !loadingMembers && (
          <p className="text-center py-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">No matching members found.</p>
        )}
      </div>

      {/* ═══════════ FULL-SCREEN FLASH ALERTS (ADMIN DX LEVEL UP) ═══════════ */}
      <AnimatePresence>
        {scan.status !== 'idle' && scan.status !== 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 text-white cursor-pointer select-none
              ${scan.status === 'success' ? 'bg-emerald-600' : ''}
              ${scan.status === 'duplicate' ? 'bg-amber-600' : ''}
              ${scan.status === 'denied' || scan.status === 'error' ? 'bg-rose-600' : ''}
            `}
          >
            {/* Pulsing glow background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-md w-full text-center space-y-8 p-8 flex flex-col items-center z-10">
              
              {/* Massive animated icon */}
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                {scan.status === 'success' && <CheckCircle2 className="w-36 h-36 drop-shadow-2xl" />}
                {scan.status === 'duplicate' && <Clock className="w-36 h-36 drop-shadow-2xl" />}
                {(scan.status === 'denied' || scan.status === 'error') && <XCircle className="w-36 h-36 drop-shadow-2xl" />}
              </motion.div>

              {/* Status Header */}
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60">ACCESS VERDICT</p>
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-[0.08em] font-sans drop-shadow">
                  {scan.status === 'success' && 'ACCESS GRANTED'}
                  {scan.status === 'duplicate' && 'ALREADY IN'}
                  {scan.status === 'denied' && 'ACCESS DENIED'}
                  {scan.status === 'error' && 'SYSTEM ERROR'}
                </h2>
              </div>

              {/* Detailed message or member statistics */}
              <div className="bg-black/10 backdrop-blur-md p-6 border border-white/10 w-full rounded-none space-y-4 shadow-xl">
                {scan.status === 'success' && scan.member && (
                  <div className="space-y-1">
                    <p className="text-xl font-bold uppercase tracking-wide truncate">{scan.member.name || 'Anonymous User'}</p>
                    <p className="text-[9px] opacity-75 uppercase tracking-widest truncate">{scan.member.email}</p>
                    <div className="h-[1px] bg-white/10 my-4" />
                    <p className="text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4 text-white" /> {scan.member.credits} Credits Remaining
                    </p>
                  </div>
                )}

                {scan.status === 'duplicate' && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider">{scan.message}</p>
                    <p className="text-[9px] opacity-75 uppercase tracking-widest">Double tap scan cooldown is active</p>
                  </div>
                )}

                {(scan.status === 'denied' || scan.status === 'error') && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold uppercase tracking-widest">{scan.message}</p>
                    <p className="text-[9px] opacity-75 uppercase tracking-widest">Verify membership status or top up pass credits</p>
                  </div>
                )}
              </div>

              {/* Action subtext */}
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse pt-8">
                TAP ANYWHERE OR WAIT TO SCAN NEXT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
