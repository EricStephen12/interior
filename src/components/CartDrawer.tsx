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

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
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
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col overflow-y-scroll bg-white/95 backdrop-blur-lg shadow-xl"
                  >
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-black text-primary tracking-tight uppercase">
                          Your Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-primary transition-colors"
                            onClick={onClose}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <div className="flow-root">
                          {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingCartIcon className="mx-auto h-12 w-12 text-secondary" />
                              <h3 className="mt-2 text-sm font-black text-primary uppercase">Your cart is empty</h3>
                              <p className="mt-1 text-sm text-text-muted">Explore the collection to add items.</p>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-100">
                              {cartItems.map((item) => (
                                <motion.li
                                  key={item.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex py-6"
                                >
                                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-none border border-primary/5 relative bg-secondary/20">
                                    <Image
                                      src={item.product?.images?.[0] || ""}
                                      alt={item.product?.name || 'Product'}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-bold text-primary">
                                        <h3>{item.product?.name}</h3>
                                        <p className="ml-4 tabular-nums">₦{((item.variant?.promo_price || item.variant?.price || 0) * item.quantity).toLocaleString()}</p>
                                      </div>
                                      <p className="mt-1 text-xs text-text-muted uppercase tracking-widest">
                                        {item.variant?.size?.name || 'Standard'}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="p-1 hover:text-accent transition-colors"
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <span className="px-3 py-1 bg-secondary text-primary font-bold text-xs">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="p-1 hover:text-accent transition-colors"
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(item.id)}
                                          className="font-black text-[10px] uppercase tracking-widest text-red-800 hover:text-red-900"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upsell Section */}
                    {upsellProducts.length > 0 && (
                      <div className="px-4 pt-6 pb-2 sm:px-6 border-t border-gray-100">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">You Might Also Like</p>
                        <div className="flex flex-col gap-3">
                          {upsellProducts.map((p: any) => {
                            const imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
                            const img = imgs[0] || p.imageUrl || ''
                            const price = Number(p.promoPrice || p.price || 0)
                            return (
                              <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-2 hover:bg-secondary/30 transition-colors rounded-none group"
                              >
                                <div className="relative w-16 h-16 flex-shrink-0 bg-secondary/50 overflow-hidden">
                                  {img && <Image src={img} alt={p.name} fill className="object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black text-primary truncate uppercase tracking-wide">{p.name}</p>
                                  <p className="text-[10px] text-text-muted font-medium">₦{price.toLocaleString()}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    addToCart(
                                      { id: p.id, name: p.name, images: imgs } as any,
                                      { id: p.id, price: price, promo_price: p.promoPrice ? Number(p.promoPrice) : undefined, size: { name: p.size?.label || 'Standard' } } as any,
                                      1
                                    )
                                    showToast('Added to Cart', 'success', p.name)
                                  }}
                                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary text-white hover:bg-accent transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-100 px-4 py-8 sm:px-8 bg-secondary/50">
                        <div className="flex justify-between text-xl font-black text-primary">
                          <p className="tracking-tight uppercase">Subtotal</p>
                          <p className="tabular-nums">₦{subtotal.toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-[10px] font-black text-text-muted uppercase tracking-widest">
                          Taxes and shipping calculated at checkout.
                        </p>
                        <div className="mt-8">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onClose()
                              router.push('/checkout')
                            }}
                            className="w-full bg-primary hover:bg-black text-white font-black py-5 rounded-none tracking-widest uppercase text-xs transition-all shadow-xl shimmer-btn"
                          >
                            Secure Checkout
                          </motion.button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-[10px] font-black tracking-widest uppercase">
                          <p className="text-text-muted">
                            or{' '}
                            <button
                              type="button"
                              className="text-accent hover:text-primary transition-colors"
                              onClick={onClose}
                            >
                              Continue Exploring
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
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
