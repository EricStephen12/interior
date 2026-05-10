'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Shield, ChevronDown, LogOut, Users } from 'lucide-react'
import CartDrawer from './CartDrawer'
import { useCart } from '@/lib/cart-context'
import { UserButton, useUser, SignOutButton } from '@clerk/nextjs'
import { useMembership } from '@/lib/membership-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state: cartState, toggleCart } = useCart()
  const membership = useMembership()
  const { isLoaded, isSignedIn, user } = useUser()
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
          <nav className="hidden md:flex space-x-10">
            <Link href="/blog" className={`${isScrolled ? 'text-primary font-bold' : 'text-primary font-medium'} hover:text-accent transition-all duration-500 text-[10px] uppercase tracking-[0.4em] relative group`}>
              JOURNAL
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

            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-6">
                {/* Profile dropdown only */}

                
                {/* Custom Profile Dropdown */}
                <div className="relative group/user">
                  <button className="flex items-center gap-3 p-1 hover:bg-secondary transition-colors">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-[10px] font-black text-white">
                      {user?.firstName?.[0] || user?.emailAddresses[0].emailAddress[0].toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3 text-primary group-hover/user:rotate-180 transition-transform duration-500" />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-primary/5 editorial-shadow opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 z-50">
                    <div className="p-4 border-b border-primary/5">
                      <p className="text-[10px] font-black text-primary uppercase truncate">{user?.fullName || 'Member'}</p>
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[10px] font-black text-primary hover:bg-secondary transition-colors uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5" /> My Pass
                      </Link>
                      {membership.state.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-[10px] font-black text-accent hover:bg-secondary transition-colors uppercase tracking-widest">
                          <Shield className="w-3.5 h-3.5" /> Admin Panel
                        </Link>
                      )}
                      <div className="h-[1px] bg-primary/5 my-2" />
                      <SignOutButton>
                        <button className="flex w-full items-center gap-3 px-3 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest">
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : isLoaded && (
              <Link href="/sign-up" className="px-5 py-2.5 bg-primary text-white hover:bg-accent transition-all duration-500 shadow-sm hidden sm:block">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">JOIN NOW</span>
              </Link>
            )}

            {/* Cart Button - ALWAYS VISIBLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'
                }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black rounded-none h-4 w-4 flex items-center justify-center shadow-2xl">
                  {cartState.items.length}
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
              SHOP
            </Link>
            <Link
              href="/blog"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              JOURNAL
            </Link>
            <Link
              href="/about"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/contact"
              className={`block transition-colors uppercase text-sm font-black tracking-[0.3em] ${isScrolled ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
            <div className={`h-[1px] w-full ${isScrolled ? 'bg-primary/5' : 'bg-primary/10'}`} />
            <Link
              href="/dashboard"
              className={`block transition-colors uppercase text-xs font-black tracking-[0.4em] ${isScrolled ? 'text-accent hover:text-primary' : 'text-accent hover:text-primary'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              THE PASS
            </Link>
            {membership.state.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block transition-colors uppercase text-xs font-black tracking-[0.4em] text-accent border-l-2 border-accent pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                ADMIN
              </Link>
            )}
            {isSignedIn && (
              <div className="pt-4">
                <SignOutButton>
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-600 transition-colors">
                    SIGN OUT
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartState.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
