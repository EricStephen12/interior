'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { THEME_DEFAULTS } from '@/app/api/theme/route'

interface CustomizationContextType {
  custom: Record<string, string>
  get: (key: string, fallback?: string) => string
}

const CustomizationContext = createContext<CustomizationContextType>({
  custom: THEME_DEFAULTS,
  get: (key: string, fallback = '') => THEME_DEFAULTS[key] ?? fallback,
})

export function CustomizationProvider({ 
  initialCustom = THEME_DEFAULTS,
  children 
}: { 
  initialCustom?: Record<string, string>
  children: React.ReactNode 
}) {
  const [custom, setCustom] = useState<Record<string, string>>(initialCustom)

  useEffect(() => {
    // Fetch latest persisted settings on mount
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          setCustom(prev => ({ ...prev, ...data.theme }))
        }
      })
      .catch(() => {})

    // Listen to live postMessage from Shopify-like Theme Studio
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SHARERS_THEME_PREVIEW') {
        const incoming = event.data.theme || {}
        setCustom({ ...incoming })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const get = (key: string, fallback = '') => {
    return custom[key] ?? THEME_DEFAULTS[key] ?? fallback
  }

  return (
    <CustomizationContext.Provider value={{ custom, get }}>
      {children}
    </CustomizationContext.Provider>
  )
}

export function useCustomization() {
  return useContext(CustomizationContext)
}
