'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { XMarkIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/cart-context'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeFromCart } = useCart()
  const { items: cartItems } = state

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
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
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
                              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                              <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart.</p>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <motion.li
                                  key={item.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex py-6"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-sky-100 relative">
                                    <Image
                                      src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"}
                                      alt={item.product?.name || 'Product'}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-bold text-blue-950">
                                        <h3>{item.product?.name}</h3>
                                        <p className="ml-4">₦{((item.variant?.promo_price || item.variant?.price || 0) * item.quantity).toLocaleString()}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500 italic">
                                        Size: {item.variant?.size?.name || 'Standard'}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                          <MinusIcon className="h-4 w-4" />
                                        </button>
                                        <span className="px-2 py-1 bg-gray-100 rounded">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(item.id)}
                                          className="font-medium text-sky-600 hover:text-sky-500"
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

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-lg font-black text-blue-950">
                          <p>Subtotal</p>
                          <p>₦{subtotal.toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Delivery calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              window.location.href = '/checkout'
                            }}
                            className="w-full bg-blue-950 hover:bg-sky-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/10"
                          >
                            Checkout
                          </motion.button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={onClose}
                            >
                              Continue Shopping
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
