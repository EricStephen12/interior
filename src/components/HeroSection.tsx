'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-white">
      {/* Dynamic Background Layer - Enhanced Visibility */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/exricx/luxury_beauty_hero_v2_1769449281975.png"
          alt="EXRICX BEAUTY Luxury Jewelry and Fragrance"
          fill
          priority
          className="object-cover scale-110"
        />
        {/* Editorial Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/10 to-secondary/40"></div>
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
      </motion.div>

      {/* Main Theatrical Content - Simplified */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center pt-20">
        <div className="text-center max-w-7xl mx-auto px-4">

          {/* Brand Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-4 sm:mb-6"
          >
            EXRICX BEAUTY • TECH PRECISION
          </motion.p>

          {/* Simplified Editorial Title */}
          <div className="mb-12 sm:mb-20">
            <h1 className="flex flex-col items-center">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] text-luxury text-primary"
                >
                  PRECISE
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-6xl sm:text-8xl md:text-[10rem] lg:text-[14rem] text-luxury text-accent"
                >
                  BEAUTY.
                </motion.span>
              </span>
            </h1>
          </div>

          {/* Elite Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            <Link href="/products">
              <button className="btn-elite group">
                SHOP THE COLLECTION
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Luxury Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent">
          <motion.div
            animate={{ y: [0, 48, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-full h-1/4 bg-accent"
          />
        </div>
      </motion.div>
    </section>
  )
}
