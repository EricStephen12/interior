'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCustomization } from '@/lib/customization-context'

export default function HeroSection() {
  const { get } = useCustomization()
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 300])
  const textY = useTransform(scrollY, [0, 500], [0, -100])
  const scale = useTransform(scrollY, [0, 1000], [1.1, 1.3])

  const tagline = get('section.hero.tagline', 'SHARERS GYM')
  const title1 = get('section.hero.title1', 'TRAIN')
  const title2 = get('section.hero.title2', 'DIFFERENT.')
  const btnText = get('section.hero.btnText', 'GET STARTED')
  const btnLink = get('section.hero.btnLink', '/dashboard')
  const subtitle = get('section.hero.subtitle', "You already know why you're here. Step in.")
  const exclusiveBadge = get('section.hero.exclusiveBadge', 'Exclusive')
  const exclusiveText = get('section.hero.exclusiveText', 'Experience high performance training in an environment curated for physical excellence.')
  const heroImage = get('section.hero.image', '/images/real-gym-banner.png')
  const pipVideo = get('section.hero.pipVideo', '/video/hero-main-v2.mp4')

  const heroBg = get('section.hero.bg', '#f8fafc')
  const heroText = get('section.hero.text', '#020617')
  const heroAccent = get('section.hero.accent', '#6366f1')
  
  const heroPadding = get('section.hero.padding', 'py-0')
  const heroMaxWidth = get('section.hero.maxWidth', 'max-w-[1800px]')
  const heroBorderTop = get('section.hero.borderTop', '0px')
  const heroBorderBottom = get('section.hero.borderBottom', '0px')
  const heroBorderColor = get('section.hero.borderColor', 'transparent')
  const heroBorderRadius = get('section.hero.borderRadius', '0px')

  return (
    <section 
      ref={containerRef} 
      className={`relative min-h-[100svh] lg:min-h-[960px] flex items-center overflow-hidden py-12 lg:py-24 ${heroPadding}`}
      style={{ 
        backgroundColor: heroBg,
        borderTopWidth: heroBorderTop,
        borderBottomWidth: heroBorderBottom,
        borderColor: heroBorderColor,
        borderStyle: 'solid',
        borderRadius: heroBorderRadius
      }}
    >
      {/* Background Text - Deep Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0">
        <motion.h2
          style={{ x: useTransform(scrollY, [0, 1000], [0, -200]), color: heroText }}
          className="text-[20vw] font-black opacity-[0.03] whitespace-nowrap leading-none tracking-tighter uppercase"
        >
          {tagline} {tagline}
        </motion.h2>
      </div>

      <div className={`relative z-10 w-full ${heroMaxWidth} mx-auto flex flex-col lg:flex-row items-center`}>

        {/* Left Content - Floating Editorial Box */}
        <motion.div
          style={{ y: textY }}
          className="w-full lg:w-1/2 px-4 sm:px-12 lg:pl-24 lg:pr-12 py-8 sm:py-20 z-20 order-2 lg:order-1 flex flex-col justify-center mt-4 lg:mt-0"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs font-black tracking-[0.8em] uppercase mb-6"
            style={{ color: heroAccent }}
          >
            {tagline}
          </motion.p>

          {/* Mobile Live Arena PIP - Positioned on the left directly above TRAIN DIFFERENT */}
          <div className="block lg:hidden mb-6 self-start w-48 h-32 sm:w-60 sm:h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-white relative bg-black">
            <video
              key={pipVideo}
              src={pipVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-[8px] font-black text-white uppercase tracking-widest rounded-sm">
              Live Arena
            </div>
          </div>

          <h1 className="flex flex-col mb-12">
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-4xl sm:text-7xl md:text-9xl xl:text-[11rem] leading-[0.85] text-luxury"
                style={{ color: heroText }}
              >
                {title1}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-4xl sm:text-7xl md:text-9xl xl:text-[11rem] leading-[0.85] text-luxury lg:-ml-12 italic"
                style={{ color: heroAccent }}
              >
                {title2}
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start gap-12"
          >
            <Link href={btnLink}>
              <button className="btn-elite group text-white">
                {btnText}
                <motion.span
                  className="inline-block ml-3"
                  animate={{ x: [0, 5, 0] }}
                >
                  →
                </motion.span>
              </button>
            </Link>

            <div className="max-w-[280px]">
              <p className="text-sm text-text-muted font-bold">
                {subtitle}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right - Asymmetric Image Banner with Floating PIP on Desktop */}
        <div className="w-full lg:w-1/2 h-full relative z-10 order-1 lg:order-2 px-4 sm:px-6 lg:px-0 pt-16 lg:pt-0 flex items-center justify-center">
          <div className="relative w-full h-[50vh] sm:h-[65vh] lg:min-h-[820px] lg:h-full shadow-2xl rounded-2xl lg:rounded-none overflow-hidden clip-editorial">
            <motion.div
              style={{ y: y1, scale }}
              className="absolute inset-0"
            >
              <Image
                src={heroImage}
                alt="SHARERS GYM Arena"
                fill
                priority
                className="object-cover object-center transition-all duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>

            {/* Desktop Live Arena PIP - Directly inside the exact image container at Bottom-Left */}
            <div className="hidden lg:block absolute bottom-6 left-6 xl:bottom-8 xl:left-8 z-30 w-72 h-48 xl:w-80 xl:h-52 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)] border-4 border-white rounded-xl bg-black">
              <video
                key={pipVideo}
                src={pipVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-primary text-[9px] font-black text-white uppercase tracking-widest rounded-sm">
                Live Arena
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modern Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
    </section>
  )
}
