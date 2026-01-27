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
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-700 ${isScrolled
        ? 'glass-light border-b border-primary/5 editorial-shadow'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/products" className={`${isScrolled ? 'text-primary font-bold' : 'text-primary font-medium'} hover:text-accent transition-all duration-500 text-[10px] uppercase tracking-[0.4em] relative group`}>
              THE VAULT
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link href="/products?category=Training" className={`${isScrolled ? 'text-primary font-bold' : 'text-primary font-medium'} hover:text-accent transition-all duration-500 text-[10px] uppercase tracking-[0.4em] relative group`}>
              ARENA
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`tracking-[0.3em] font-black transition-all duration-300 leading-none ${isScrolled
                ? 'text-primary text-xl'
                : 'text-primary text-2xl'
                }`}
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              SHARERS
            </motion.div>
            <span className={`text-[9px] tracking-[0.5em] font-black text-accent uppercase mt-1 ${isScrolled ? 'hidden' : 'block'}`}>
              GYM
            </span>
          </Link>

          {/* Action Group */}
          <div className="flex items-center gap-6 sm:gap-10">
            {/* Desktop Only Right Nav */}
            <nav className="hidden md:flex items-center space-x-10 mr-4">
              <Link href="/about" className={`${isScrolled ? 'text-primary font-bold' : 'text-primary font-medium'} hover:text-accent transition-all duration-500 text-[10px] uppercase tracking-[0.4em] relative group`}>
                ABOUT
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className={`${isScrolled ? 'text-primary font-bold' : 'text-primary font-medium'} hover:text-accent transition-all duration-500 text-[10px] uppercase tracking-[0.4em] relative group`}>
                CONTACT
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full"></span>
              </Link>
            </nav>

            <Link href="/dashboard" className="px-5 py-2.5 bg-primary text-white hover:bg-accent transition-all duration-500 shadow-sm hidden sm:block">
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">The Pass</span>
            </Link>

            {/* Cart Button - ALWAYS VISIBLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'
                }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black rounded-none h-4 w-4 flex items-center justify-center shadow-2xl">
                  {state.items.length}
                </span>
              )}
            </motion.button>

            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 transition-colors ${isScrolled ? 'text-primary' : 'text-primary'
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
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden overflow-hidden"
        >
          <div className={`py-12 px-6 space-y-8 border-t transition-colors ${isScrolled ? 'border-primary/5 bg-white' : 'bg-secondary'}`}>
            <Link
              href="/products"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              The Vault
            </Link>
            <Link
              href="/about"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              The Lab
            </Link>
            <Link
              href="/contact"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Concierge
            </Link>
            <div className={`h-[1px] w-full ${isScrolled ? 'bg-primary/5' : 'bg-primary/10'}`} />
            <Link
              href="/account"
              className={`block transition-colors uppercase text-xs font-black tracking-[0.4em] ${isScrolled ? 'text-accent hover:text-primary' : 'text-accent hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Member Access
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
