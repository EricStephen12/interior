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
  const accentColor = get('section.banner.accent', '#6366f1')

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
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4 relative">
          <Tag className="w-3 h-3 flex-shrink-0" style={{ color: accentColor }} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">
            {message}
            {code && (
              <>
                {' '}—{' '}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 font-black tracking-widest transition-colors border"
                  style={{
                    backgroundColor: `${accentColor}25`,
                    borderColor: `${accentColor}50`,
                    color: accentColor
                  }}
                >
                  {copied ? '✓ COPIED!' : code}
                </button>
              </>
            )}
          </p>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: textColor }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
