'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import CartDrawer from './CartDrawer'
import { useCart } from '@/lib/cart-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, toggleCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-amber-50/95 backdrop-blur-md border-b border-amber-200/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/contact" className={`${isScrolled ? 'text-amber-900 font-bold' : 'text-amber-900 font-light'} hover:text-amber-700 transition-colors text-sm uppercase tracking-wider`}>
              CONTACT
            </Link>
            <Link href="/delivery" className={`${isScrolled ? 'text-amber-900 font-bold' : 'text-amber-900 font-light'} hover:text-amber-700 transition-colors text-sm uppercase tracking-wider`}>
              DELIVERY
            </Link>
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`tracking-wider transition-all duration-300 ${
                isScrolled
                  ? 'text-amber-900 font-bold text-2xl'
                  : 'text-amber-900 font-light text-3xl'
              }`}
              style={{ fontFamily: 'var(--font-playfair)', fontWeight: '300' }}
            >
              interiors
            </motion.div>
          </Link>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className={`${isScrolled ? 'text-amber-900 font-bold' : 'text-amber-900 font-light'} hover:text-amber-700 transition-colors text-sm uppercase tracking-wider`}>
              SHOP
            </Link>
            <Link href="/checkout" className={`${isScrolled ? 'text-amber-900 font-bold' : 'text-amber-900 font-light'} hover:text-amber-700 transition-colors text-sm uppercase tracking-wider`}>
              CART
            </Link>
            <Link href="/admin" className={`${isScrolled ? 'text-amber-900 font-bold' : 'text-amber-900 font-light'} hover:text-amber-700 transition-colors text-sm uppercase tracking-wider`}>
              ADMIN
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${
                isScrolled ? 'text-amber-900 hover:text-amber-700' : 'text-amber-900 hover:text-amber-700'
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors ${
                isScrolled ? 'text-amber-900' : 'text-amber-900'
              }`}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className={`py-4 space-y-4 border-t transition-colors ${
            isScrolled ? 'border-amber-200/50 bg-amber-50/95 backdrop-blur-sm' : 'border-amber-100'
          }`}>
            <Link
              href="/contact"
              className={`block transition-colors uppercase text-sm tracking-wider ${
                isScrolled ? 'text-amber-900 font-bold hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
            <Link
              href="/delivery"
              className={`block transition-colors uppercase text-sm tracking-wider ${
                isScrolled ? 'text-amber-900 font-bold hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              DELIVERY
            </Link>
            <Link
              href="/products"
              className={`block transition-colors uppercase text-sm tracking-wider ${
                isScrolled ? 'text-amber-900 font-bold hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link
              href="/checkout"
              className={`block transition-colors uppercase text-sm tracking-wider ${
                isScrolled ? 'text-amber-900 font-bold hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              CART
            </Link>
            <Link
              href="/admin"
              className={`block transition-colors uppercase text-sm tracking-wider ${
                isScrolled ? 'text-amber-900 font-bold hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              ADMIN
            </Link>
            <div className="pt-4">
              <button
                onClick={() => {
                  toggleCart()
                  setIsMenuOpen(false)
                }}
                className={`p-2 transition-colors relative ${
                  isScrolled ? 'text-amber-900 hover:text-amber-700' : 'text-amber-800 hover:text-amber-600'
                }`}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
