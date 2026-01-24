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
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className={`${isScrolled ? 'text-blue-950 font-bold' : 'text-blue-950 font-medium'} hover:text-sky-600 transition-colors text-xs uppercase tracking-widest`}>
              SHOP ALL
            </Link>
            <Link href="/#products" className={`${isScrolled ? 'text-blue-950 font-bold' : 'text-blue-950 font-medium'} hover:text-sky-600 transition-colors text-xs uppercase tracking-widest`}>
              BRANDS
            </Link>
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`tracking-tight transition-all duration-300 leading-none ${isScrolled
                ? 'text-blue-950 font-black text-2xl'
                : 'text-blue-950 font-black text-3xl'
                }`}
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              SMART BEST
            </motion.div>
            <span className={`text-[10px] tracking-[0.2em] font-bold text-sky-600 uppercase ${isScrolled ? 'hidden' : 'block'}`}>
              Brands
            </span>
          </Link>

          {/* Action Group - Visible on All Viewports */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            {/* Desktop Only Right Nav */}
            <nav className="hidden md:flex items-center space-x-8 mr-4">
              <Link href="/about" className={`${isScrolled ? 'text-blue-950 font-bold' : 'text-blue-950 font-medium'} hover:text-sky-600 transition-colors text-xs uppercase tracking-widest`}>
                ABOUT
              </Link>
              <Link href="/contact" className={`${isScrolled ? 'text-blue-950 font-bold' : 'text-blue-950 font-medium'} hover:text-sky-600 transition-colors text-xs uppercase tracking-widest`}>
                CONTACT
              </Link>
              <div className="h-4 w-[1px] bg-slate-200" />
            </nav>

            <Link href="/account" className="p-2 sm:px-4 bg-sky-50 text-blue-950 rounded-lg hover:bg-blue-950 hover:text-white transition-all shadow-sm hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
            </Link>

            {/* Cart Button - ALWAYS VISIBLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${isScrolled ? 'text-blue-950 hover:text-sky-600' : 'text-blue-950 hover:text-sky-600'
                }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-sky-100">
                  {state.items.length}
                </span>
              )}
            </motion.button>

            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 transition-colors ${isScrolled ? 'text-blue-950' : 'text-blue-950'
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
          <div className={`py-8 px-4 space-y-6 border-t transition-colors ${isScrolled ? 'border-slate-100 bg-white' : 'bg-blue-950'}`}>
            <Link
              href="/products"
              className={`block transition-colors uppercase text-xs font-black tracking-widest ${isScrolled ? 'text-blue-950 hover:text-sky-600' : 'text-white hover:text-sky-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              SHOP ALL
            </Link>
            <Link
              href="/about"
              className={`block transition-colors uppercase text-xs font-black tracking-widest ${isScrolled ? 'text-blue-950 hover:text-sky-600' : 'text-white hover:text-sky-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className={`block transition-colors uppercase text-xs font-black tracking-widest ${isScrolled ? 'text-blue-950 hover:text-sky-600' : 'text-white hover:text-sky-400'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
            <div className={`h-[1px] w-full ${isScrolled ? 'bg-slate-100' : 'bg-white/10'}`} />
            <Link
              href="/account"
              className={`block transition-colors uppercase text-xs font-black tracking-widest ${isScrolled ? 'text-sky-600 hover:text-blue-950' : 'text-sky-400 hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ACCOUNT DASHBOARD
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
