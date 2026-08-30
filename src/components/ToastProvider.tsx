'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, ShoppingBag, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  subtext?: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, subtext?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success', subtext?: string) => {
    const id = Math.random().toString(36).slice(2)

    // Play a soft pop sound
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        const ctx = new AudioContext()
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(880, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.3)
      }
    } catch {
      // Silently ignore if audio isn't available
    }

    setToasts(prev => [...prev, { id, message, subtext, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[99998] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto"
            >
              <div className={`flex items-start gap-4 px-5 py-4 shadow-2xl min-w-[300px] max-w-[380px] rounded-none border-l-4
                ${toast.type === 'success' ? 'bg-white border-l-accent' : ''}
                ${toast.type === 'error' ? 'bg-white border-l-red-500' : ''}
                ${toast.type === 'info' ? 'bg-white border-l-blue-500' : ''}
              `}>
                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {toast.type === 'success' && <ShoppingBag className="w-5 h-5 text-accent" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-primary uppercase tracking-wider">{toast.message}</p>
                  {toast.subtext && (
                    <p className="text-xs text-text-muted mt-0.5 font-medium">{toast.subtext}</p>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-300 hover:text-primary transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
