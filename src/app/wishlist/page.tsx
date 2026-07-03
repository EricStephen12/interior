'use client'

import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { useToast } from '@/components/ToastProvider'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart, toggleCart } = useCart()
  const { showToast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length === 0) {
      setLoading(false)
      setProducts([])
      return
    }

    // Fetch all products and filter by wishlist IDs
    fetch('/api/products/list?limit=100')
      .then(r => r.json())
      .then(data => {
        const all = data.products || data || []
        const wishlisted = all.filter((p: any) => wishlist.includes(p.id))
        setProducts(wishlisted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [wishlist])

  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
          <div className="flex items-end gap-4">
            <h1 className="text-5xl sm:text-7xl font-black text-primary tracking-tight leading-none">
              My <span className="text-accent">Wishlist</span>
            </h1>
            {products.length > 0 && (
              <span className="text-lg font-black text-slate-300 mb-2">{products.length} item{products.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <Heart className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-primary mb-3">Nothing saved yet</h3>
            <p className="text-text-muted mb-8 font-medium">Hit the ❤ on any product to save it here.</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-colors"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product, idx) => {
                const imgs = Array.isArray(product.images)
                  ? product.images
                  : typeof product.images === 'string'
                  ? JSON.parse(product.images || '[]')
                  : []
                const img = imgs[0] || product.imageUrl || ''
                const price = Number(product.price || 0)
                const promoPrice = product.promoPrice ? Number(product.promoPrice) : undefined

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group relative"
                  >
                    {/* Product Image */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30 mb-5">
                        {img && (
                          <Image
                            src={img}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        toggleWishlist(product.id)
                        showToast('Removed from Wishlist', 'info', product.name)
                      }}
                      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50 hover:text-red-500 transition-all z-10 text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Info */}
                    <div className="space-y-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-sm font-black text-primary uppercase tracking-wide group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-light text-primary tabular-nums">₦{price.toLocaleString()}</span>
                        {promoPrice && (
                          <span className="text-xs text-text-muted line-through tabular-nums">₦{promoPrice.toLocaleString()}</span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={() => {
                          addToCart(
                            { id: product.id, name: product.name, images: imgs } as any,
                            { id: product.id, price, promo_price: promoPrice, size: { name: product.size?.label || 'Standard' } } as any,
                            1
                          )
                          showToast('Added to Cart', 'success', product.name)
                          toggleCart()
                        }}
                        className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-300 group/btn"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
