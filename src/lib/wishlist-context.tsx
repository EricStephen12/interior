'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface WishlistContextType {
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sharers-wishlist')
      if (saved) setWishlist(JSON.parse(saved))
    } catch {}
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      localStorage.setItem('sharers-wishlist', JSON.stringify(next))
      return next
    })
  }, [])

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist])

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
