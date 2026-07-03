'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag } from 'lucide-react'

export default function PromoBanner() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    // Fetch banner settings from the store settings API (public endpoint not needed — we'll use a public route)
    fetch('/api/banner')
      .then(r => r.json())
      .then(data => {
        if (data.enabled && data.message) {
          setMessage(data.message)
          setCode(data.code || '')
          // Only show if not dismissed this session
          const dismissed = sessionStorage.getItem('promo-banner-dismissed')
          if (!dismissed) {
            setTimeout(() => setVisible(true), 1200)
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('promo-banner-dismissed', '1')
  }

  const handleCopy = () => {
    if (!code) return
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden bg-primary text-white"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4 relative">
            <Tag className="w-3 h-3 text-accent flex-shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">
              {message}
              {code && (
                <>
                  {' '}—{' '}
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 bg-accent/20 hover:bg-accent/40 border border-accent/40 px-3 py-0.5 text-accent font-black tracking-widest transition-colors"
                  >
                    {copied ? '✓ COPIED!' : code}
                  </button>
                </>
              )}
            </p>
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
