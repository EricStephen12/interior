'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/lib/cart-context'

export default function CheckoutPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const { items: cartItems } = state

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 1000 ? 0 : 150
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    // In a real app, this would integrate with payment processor
    alert('Order placed successfully! Thank you for shopping with interiors.')
    clearCart()
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-amber-400 mb-6" />
          <h2 className="text-3xl font-serif font-bold text-amber-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-amber-700 mb-8 max-w-md mx-auto">
            Add some beautiful furniture pieces to your cart to get started with your order.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/products'}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Cart Items */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-6">
              Shopping Cart
            </h2>

            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0] || "/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-amber-600 mb-2">
                        Code: {item.product.productCode}
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        ${item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </motion.button>

                      <span className="text-lg font-semibold text-amber-900 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-full transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-6">
              Order Summary
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-amber-700">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-amber-900">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-amber-700">Shipping</span>
                  <span className="font-semibold text-amber-900">
                    {shipping === 0 ? 'FREE' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-amber-700">Tax</span>
                  <span className="font-semibold text-amber-900">${tax.toLocaleString()}</span>
                </div>

                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-amber-900">Total</span>
                    <span className="text-amber-600">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full mt-6 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg"
              >
                Complete Order
              </motion.button>

              <p className="text-xs text-amber-600 mt-3 text-center">
                Secure checkout powered by Stripe
              </p>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                Order Notes
              </h3>
              <textarea
                placeholder="Special delivery instructions or notes..."
                className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                rows={3}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

