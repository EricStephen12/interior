'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'
import { useCustomization } from '@/lib/customization-context'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { get } = useCustomization()
  const cartTitle = get('section.cart.title', 'Your Cart')
  const cartEmptyTitle = get('section.cart.emptyTitle', 'Your cart is empty')
  const cartEmptyDesc = get('section.cart.emptyDesc', 'Explore the collection to add items.')
  const cartUpsellTitle = get('section.cart.upsellTitle', 'You might also like')
  const cartCheckoutBtn = get('section.cart.checkoutBtn', 'Secure Checkout')
  const cartContinueBtn = get('section.cart.continueBtn', 'Continue Exploring')

  const { state, updateQuantity, removeFromCart, addToCart } = useCart()
  const { items: cartItems } = state
  const router = useRouter()
  const { showToast } = useToast()
  const [upsellProducts, setUpsellProducts] = useState<any[]>([])

  // Fetch a few products for upsells
  useEffect(() => {
    fetch('/api/products/list?limit=6')
      .then(r => r.json())
      .then(data => {
        const products = data.products || data || []
        // Pick 3 random ones not already in cart
        const cartIds = new Set(cartItems.map((i: any) => i.product?.id))
        const available = products.filter((p: any) => !cartIds.has(p.id))
        const shuffled = available.sort(() => 0.5 - Math.random()).slice(0, 3)
        setUpsellProducts(shuffled)
      })
      .catch(() => {})
  }, [isOpen])

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.promo_price || item.variant?.price || 0
    return sum + (price * item.quantity)
  }, 0)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-full sm:max-w-md">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full max-h-[100dvh] flex-col bg-white shadow-2xl overflow-hidden"
                  >
                    {/* Sticky Header */}
                    <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-primary/10 flex items-center justify-between shrink-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <Dialog.Title className="text-base sm:text-lg font-black text-primary tracking-tight uppercase">
                          {cartTitle} <span className="text-text-muted text-xs font-normal">({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                        </Dialog.Title>
                      </div>
                      <button
                        type="button"
                        className="p-2 -mr-2 text-text-muted hover:text-primary hover:bg-secondary transition-colors rounded-full"
                        onClick={onClose}
                        aria-label="Close cart"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Scrollable Cart Body */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain">
                      {/* Empty State */}
                      {cartItems.length === 0 ? (
                        <div className="text-center py-16 px-4">
                          <div className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center mx-auto mb-4 border border-primary/5">
                            <ShoppingCartIcon className="h-8 w-8 text-text-muted" />
                          </div>
                          <h3 className="text-sm font-black text-primary uppercase tracking-wider">{cartEmptyTitle}</h3>
                          <p className="mt-1.5 text-xs text-text-muted max-w-[240px] mx-auto">{cartEmptyDesc}</p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose()
                              router.push('/products')
                            }}
                            className="mt-6 px-6 py-3 bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
                            style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
                          >
                            Explore Arsenal
                          </button>
                        </div>
                      ) : (
                        <ul role="list" className="divide-y divide-primary/5 -my-2">
                          {cartItems.map((item) => {
                            const itemPrice = (item.variant?.promo_price || item.variant?.price || 0)
                            const lineTotal = itemPrice * item.quantity
                            return (
                              <motion.li
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-4 flex gap-3 sm:gap-4 items-center"
                              >
                                {/* Product Image */}
                                <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden border border-primary/10 relative bg-secondary/30">
                                  <Image
                                    src={item.product?.images?.[0] || ""}
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                  />
                                </div>

                                {/* Details & Quantity Controls */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                                  <div>
                                    <div className="flex justify-between items-start gap-2">
                                      <h3 className="text-xs sm:text-sm font-black text-primary uppercase tracking-tight truncate">
                                        {item.product?.name}
                                      </h3>
                                      <p className="text-xs sm:text-sm font-black text-primary tabular-nums shrink-0">
                                        ₦{lineTotal.toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-0.5">
                                      {item.variant?.size?.name || 'Standard'}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-2">
                                    {/* Touch-Friendly Quantity Stepper */}
                                    <div className="flex items-center border border-primary/15 bg-secondary/40">
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors active:scale-95"
                                        aria-label="Decrease quantity"
                                      >
                                        <MinusIcon className="h-3.5 w-3.5" />
                                      </button>
                                      <span className="w-8 text-center text-xs font-mono font-bold text-primary">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors active:scale-95"
                                        aria-label="Increase quantity"
                                      >
                                        <PlusIcon className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-[10px] font-black uppercase tracking-wider text-text-muted hover:text-red-600 transition-colors p-1"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </motion.li>
                            )
                          })}
                        </ul>
                      )}

                      {/* Upsell Recommendations */}
                      {cartItems.length > 0 && upsellProducts.length > 0 && (
                        <div className="pt-4 border-t border-primary/10">
                          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted mb-3">
                            {cartUpsellTitle}
                          </p>
                          <div className="space-y-2">
                            {upsellProducts.map((p: any) => {
                              const imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
                              const img = imgs[0] || p.imageUrl || ''
                              const price = Number(p.promoPrice || p.price || 0)
                              return (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-3 p-2 bg-secondary/30 border border-primary/5 hover:border-primary/20 transition-all"
                                >
                                  <div className="relative w-12 h-12 flex-shrink-0 bg-secondary/50 overflow-hidden border border-primary/5">
                                    {img && <Image src={img} alt={p.name} fill className="object-cover" sizes="48px" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-primary truncate uppercase tracking-tight">{p.name}</p>
                                    <p className="text-[10px] font-bold text-accent">₦{price.toLocaleString()}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addToCart(
                                        { id: p.id, name: p.name, images: imgs } as any,
                                        { id: p.id, price: price, promo_price: p.promoPrice ? Number(p.promoPrice) : undefined, size: { name: p.size?.label || 'Standard' } } as any,
                                        1
                                      )
                                      showToast('Added to Cart', 'success', p.name)
                                    }}
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center bg-primary text-white hover:bg-accent transition-colors active:scale-95"
                                    title="Add to cart"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky Mobile-Optimized Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-primary/10 p-4 sm:p-6 bg-secondary/40 shrink-0 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        <div className="flex items-center justify-between text-base sm:text-lg font-black text-primary">
                          <span className="tracking-tight uppercase">Subtotal</span>
                          <span className="tabular-nums">₦{subtotal.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                          Taxes and delivery calculated at secure checkout.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            onClose()
                            router.push('/checkout')
                          }}
                          className="w-full bg-primary hover:bg-accent text-white font-black py-3.5 sm:py-4 tracking-widest uppercase text-xs transition-all shadow-lg active:scale-98"
                          style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
                        >
                          {cartCheckoutBtn}
                        </button>
                        <div className="text-center pt-0.5">
                          <button
                            type="button"
                            className="text-[10px] font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
                            onClick={onClose}
                          >
                            {cartContinueBtn} &rarr;
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
