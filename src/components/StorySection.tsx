'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function StorySection() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} className="py-24 sm:py-32 md:py-48 bg-white overflow-hidden relative">
      {/* Decorative Brand Text Background */}
      <div className="absolute top-0 right-0 py-32 opacity-[0.02] pointer-events-none -mr-32 hidden xl:block">
        <span className="text-[25rem] font-black leading-none">SHARERS</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Editorial Layout 1: Asymmetric Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-0 items-center mb-40 md:mb-64">

          {/* Main Large Image - Slight Rotation */}
          <div className="lg:col-span-8 relative">
            <RevealImage
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
              alt="SHARERS GYM Performance"
              className="aspect-[16/10] md:aspect-[16/8] rounded-none shadow-2xl scale-105"
            />
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
              className="glass-light p-12 sm:p-20 md:p-32 rounded-none space-y-12 shadow-[0_80px_100px_-20px_rgba(0,0,0,0.1)] border-l-4 border-accent"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase block">Chapter I</span>
                <h3 className="text-6xl md:text-8xl text-luxury text-primary">
                  The Forge of <br />
                  <span className="text-accent italic font-light">Performance.</span>
                </h3>
              </div>

              <p className="text-lg text-text-muted font-medium leading-[2] max-w-lg">
                SHARERS GYM was established to redefine physical potential. By merging master-tier coaching, bio-rhythmic recovery, and elite facility design into a single, cohesive protocol, we create moments of peak human achievement.
              </p>

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
                <h3 className="text-6xl md:text-8xl text-luxury text-primary flex flex-col">
                  <span>Mastering the</span>
                  <span className="text-primary/10 -mt-4">Human Machine.</span>
                </h3>
              </div>

              <p className="text-lg text-text-muted font-medium leading-[2]">
                Our vision extends beyond the workout. We integrate sports science with modern physical therapy, ensuring that every session, from high-intensity conditioning to neural recovery, is a testament to the house of SHARERS.
              </p>

              <div className="grid grid-cols-2 gap-12 border-t border-primary/5 pt-12">
                <div>
                  <h4 className="text-5xl text-luxury text-primary leading-none mb-3">100%</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Precision Tracked</p>
                </div>
                <div>
                  <h4 className="text-5xl text-luxury text-primary leading-none mb-3">#01</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Elite Level</p>
                </div>
              </div>

              <div className="pt-4">
                <button className="group text-[10px] font-black tracking-[0.5em] text-primary uppercase flex items-center gap-4 hover:text-accent transition-colors">
                  EXPLORE PROTOCOLS <span className="w-12 h-[1px] bg-primary group-hover:w-20 group-hover:bg-accent transition-all duration-500"></span>
                </button>
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
                <RevealImage
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80"
                  alt="SHARERS Recovery Detail"
                  className="w-full h-full border-[20px] border-white"
                />
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
