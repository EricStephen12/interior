'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image - Luxury Dining Room */}
      <div className="absolute inset-0">
        {/* Luxury dining room scene - using one full background image */}
        <div className="w-full h-full relative">
          <img
            src="/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"
            alt="Luxury Furniture Hero"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-amber-900/10"></div>
        </div>
      </div>

      {/* Content - Centered Logo and CTA */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          {/* Logo - "interiors" with elegant typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-7xl md:text-9xl font-light text-amber-900 tracking-wider" style={{ fontFamily: 'var(--font-playfair)', fontWeight: '300' }}>
              interiors
            </h1>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-amber-900 font-medium py-3 px-8 rounded-full text-sm uppercase tracking-wider transition-colors duration-200 border border-amber-200"
              >
                START SHOPPING
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
