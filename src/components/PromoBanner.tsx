'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag } from 'lucide-react'
import { useCustomization } from '@/lib/customization-context'

export default function PromoBanner() {
  const { get } = useCustomization()
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  const enabled = get('section.banner.enabled') === 'true'
  const message = get('section.banner.message')
  const code = get('section.banner.code')
  const bg = get('section.banner.bg', '#020617')
  const textColor = get('section.banner.text', '#ffffff')
  const customAccent = get('section.banner.accent')
  // Use customAccent only if specifically customized and not default #6366f1 clash; otherwise harmonize with textColor
  const accentColor = customAccent && customAccent !== '#6366f1' ? customAccent : textColor

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('promo-banner-dismissed')
    if (isDismissed) setDismissed(true)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('promo-banner-dismissed', '1')
  }

  const handleCopy = () => {
    if (!code) return
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!enabled || dismissed || !message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
        style={{ backgroundColor: bg, color: textColor }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 relative">
          <Tag className="w-3.5 h-3.5 flex-shrink-0 opacity-90" style={{ color: accentColor }} />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-center flex items-center flex-wrap justify-center gap-2">
            <span>{message}</span>
            {code && (
              <>
                <span className="opacity-40">—</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Click to copy promo code"
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-mono text-[9px] font-black tracking-widest uppercase transition-all duration-300 border active:scale-95 shadow-xs cursor-pointer select-none"
                  style={{
                    color: copied ? '#000000' : textColor,
                    backgroundColor: copied ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                    borderColor: copied ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {copied ? '✓ COPIED!' : code}
                </button>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity p-1 cursor-pointer"
            style={{ color: textColor }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
