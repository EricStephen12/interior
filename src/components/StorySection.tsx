'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * StorySection Component
 * 
 * An editorial-style showcase section that combines high-performance video backgrounds
 * with asymmetric layouts and staggered reveal animations.
 * 
 * Features:
 * - Autoplay high-definition videos
 * - Parallax-style text content
 * - Framer-motion interaction triggers
 */

export default function StorySection() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} className="py-16 sm:py-32 md:py-48 bg-white overflow-hidden relative">
      {/* Decorative Brand Text Background */}
      <div className="absolute top-0 right-0 py-32 opacity-[0.02] pointer-events-none -mr-32 hidden xl:block">
        <span className="text-[25rem] font-black leading-none">SHARERS</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Editorial Layout 1: Asymmetric Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20 lg:gap-0 items-center mb-24 md:mb-64">

          {/* Main Large Video - Premium Editorial Feel */}
          <div className="lg:col-span-8 relative">
            <div className="relative aspect-[16/10] md:aspect-[16/8] overflow-hidden group shadow-2xl">
              <video
                src="/video/story-main.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            </div>
            {/* Absolute Detail Element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent opacity-10 hidden lg:block"></div>
          </div>

          {/* Overlapping Text Content - Shifted & Staggered */}
          <div className="lg:col-span-6 lg:-ml-32 lg:-mt-32 z-20 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass-light p-8 sm:p-20 md:p-32 rounded-none space-y-12 shadow-[0_80px_100px_-20px_rgba(0,0,0,0.1)] border-l-4 border-accent"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase block">Chapter I</span>
                <h3 className="text-4xl sm:text-6xl md:text-8xl text-luxury text-primary">
                  The Forge of <br />
                  <span className="text-accent italic font-light">Performance.</span>
                </h3>
              </div>

              <div className="text-lg text-text-muted font-medium leading-[2] max-w-lg space-y-4">
                <p>Sharers wasn't built around a machine or a programme.</p>
                <p>It was built around the person walking through the door.</p>
                <p>Every piece of equipment, every session, every corner of this space exists because someone decided they were ready to change — and we decided to be ready for them.</p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div className="w-16 h-[2px] bg-accent"></div>
                <span className="text-[9px] font-black tracking-widest text-primary uppercase">ESTD. 2024</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Editorial Layout 2: Staggered Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Floating Text - Left Staggered */}
          <div className="lg:col-span-5 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="space-y-14"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase block">Chapter II</span>
                <h3 className="text-4xl sm:text-6xl md:text-7xl text-luxury text-primary flex flex-col">
                  <span>Mastering the</span>
                  <span className="text-primary/10 -mt-1 sm:-mt-2">Human Machine.</span>
                </h3>
              </div>

              <div className="text-lg text-text-muted font-medium leading-[2] max-w-lg italic space-y-4">
                <p>Your body is the most complex thing you'll ever work on. We don't take that lightly.</p>
                <p>From the way we train to the way we recover, everything here is designed with one person in mind — you. Not a generic version of you. The actual you that shows up, puts in the reps, and goes home better than you came.</p>
              </div>

              <div className="grid grid-cols-2 gap-12 border-t border-primary/5 pt-12">
                <div>
                  <h4 className="text-3xl sm:text-5xl text-luxury text-primary leading-none mb-3">100%</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Real Results</p>
                </div>
                <div>
                  <h4 className="text-3xl sm:text-5xl text-luxury text-primary leading-none mb-3">#01</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Expert Team</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/dashboard" className="group text-[10px] font-black tracking-[0.5em] text-primary uppercase flex items-center gap-4 hover:text-accent transition-colors">
                  SEE THE PLANS <span className="w-12 h-[1px] bg-primary group-hover:w-20 group-hover:bg-accent transition-all duration-500"></span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Collage Gallery - Right Staggered */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[3/4] w-full">
              <RevealImage
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                alt="SHARERS GYM Strength Training"
                className="w-full h-full shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
              />

              {/* Overlapping Small Image */}
              <motion.div
                initial={{ x: 50, y: 50, opacity: 0 }}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-20 -left-20 w-2/3 aspect-square shadow-2xl z-30 hidden sm:block"
              >
                <div className="w-full h-full border-[20px] border-white relative overflow-hidden group shadow-2xl">
                  <video
                    src="/video/shop-detail.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function RevealImage({ src, alt, className }: { src: string, alt: string, className: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={`relative overflow-hidden group ${className}`}>
      <motion.div
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
      <motion.div
        initial={{ translateZ: 0, scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-0 bg-primary origin-top z-10"
      />
    </div>
  )
}
