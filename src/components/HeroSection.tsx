'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 300])
  const textY = useTransform(scrollY, [0, 500], [0, -100])
  const scale = useTransform(scrollY, [0, 1000], [1.1, 1.3])

  return (
    <section ref={containerRef} className="relative h-screen min-h-[100svh] lg:min-h-[800px] overflow-hidden bg-secondary">
      {/* Background Text - Deep Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0">
        <motion.h2
          style={{ x: useTransform(scrollY, [0, 1000], [0, -200]) }}
          className="text-[20vw] font-black text-primary/[0.03] whitespace-nowrap leading-none tracking-tighter uppercase"
        >
          SHARERS GYM SHARERS GYM
        </motion.h2>
      </div>

      <div className="relative z-10 h-full max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center">

        {/* Left Content - Floating Editorial Box */}
        <motion.div
          style={{ y: textY }}
          className="w-full lg:w-1/2 px-4 sm:px-12 lg:pl-24 lg:pr-12 py-8 sm:py-20 z-20 order-2 lg:order-1 flex flex-col justify-center mt-4 lg:mt-0"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs font-black tracking-[0.8em] text-accent uppercase mb-8"
          >
            SHARERS GYM
          </motion.p>

          <h1 className="flex flex-col mb-12">
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-4xl sm:text-7xl md:text-9xl xl:text-[11rem] leading-[0.85] text-luxury text-primary"
              >
                UNLEASH
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-4xl sm:text-7xl md:text-9xl xl:text-[11rem] leading-[0.85] text-luxury text-accent lg:-ml-12 italic"
              >
                POWER.
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start gap-12"
          >
            <Link href="/dashboard">
              <button className="btn-elite group text-white">
                START THE PROTOCOL
                <motion.span
                  className="inline-block ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </button>
            </Link>

            <div className="max-w-[280px]">
              <p className="text-sm text-text-muted font-bold">
                You already know why you're here. Step in.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right - Asymmetric Image Crop */}
        <div className="w-full lg:w-1/2 h-full relative z-10 order-1 lg:order-2 px-4 sm:px-6 lg:px-0 pt-16 lg:pt-0">
          <div className="relative w-full h-[30vh] sm:h-[50vh] lg:h-full overflow-hidden clip-editorial shadow-2xl">
            <motion.div
              style={{ y: y1, scale }}
              className="absolute inset-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=90"
                alt="SHARERS GYM Editorial"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </motion.div>
          </div>

          {/* Floating Detail Image - Editorial Signature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute -bottom-12 -left-12 w-48 h-64 border-[12px] border-white shadow-2xl hidden xl:block z-30"
          >
            <Image
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80"
              alt="SHARERS Detail"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Luxury Scroll Tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-12 right-6 sm:right-12 hidden md:flex flex-col items-end gap-6 z-30"
      >
        <span className="text-[10px] font-black tracking-[0.5em] text-primary/30 rotate-90 origin-right translate-y-full mb-12">SCROLL</span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-primary/10 to-accent">
          <motion.div
            animate={{ y: [0, 96, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-full h-1/3 bg-accent"
          />
        </div>
      </motion.div>
    </section>
  )
}
