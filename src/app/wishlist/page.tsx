'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/lib/wishlist-context'
import { Heart, Trash2, ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlist()

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-28 sm:pt-36 pb-20">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 pb-8 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.35em] mb-3">Your Collection</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
              Wishlist
              {items.length > 0 && (
                <span className="text-gray-200 text-2xl ml-3 font-normal">({items.length})</span>
              )}
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 space-y-6"
          >
            <div className="w-20 h-20 bg-[#f8f7f5] rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Your wishlist is empty</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Browse our products and tap the heart icon to save items you love.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item) => {
                const hasDiscount = item.promoPrice && item.promoPrice < item.price
                const displayPrice = item.promoPrice || item.price

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
                  >
                    {/* Image */}
                    <Link href={`/products/${item.id}`} className="block">
                      <div className="relative aspect-[4/5] bg-[#f8f7f5] overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-200" />
                          </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                              -{Math.round((1 - (item.promoPrice! / item.price)) * 100)}%
                            </span>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeItem(item.id)
                          }}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-5 space-y-2">
                      {item.brand && (
                        <p className="text-[9px] font-bold text-accent uppercase tracking-[0.25em]">{item.brand}</p>
                      )}
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-sm font-bold text-primary leading-snug hover:text-accent transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      {item.type && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.type}</p>
                      )}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-bold text-primary tabular-nums">
                          ₦{displayPrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-300 line-through tabular-nums">
                            ₦{item.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/products/${item.id}`}
                        className="flex items-center justify-center gap-2 w-full mt-3 py-3 bg-[#f8f7f5] hover:bg-primary hover:text-white text-primary text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        View Product
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom nav */}
        {items.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link href="/products" className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
            <p className="text-[11px] text-gray-300 font-medium">
              {items.length} item{items.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
