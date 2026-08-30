'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCustomization } from '@/lib/customization-context'

export default function StorySection() {
  const { get } = useCustomization()
  const containerRef = useRef(null)

  const badge1 = get('section.story.badge1', 'Chapter I')
  const title1_1 = get('section.story.title1_1', "Why We're")
  const title1_2 = get('section.story.title1_2', 'Here.')
  const p1 = get('section.story.p1', "SHARERS wasn't built around a machine or a program.")
  const p2 = get('section.story.p2', 'It was built around the person walking through the door.')
  const p3 = get('section.story.p3', 'Every piece of equipment, every session, every corner of this space exists because someone decided they were ready to change — and we decided to be ready for them.')
  const est = get('section.story.est', 'ESTD. 2024')

  const badge2 = get('section.story.badge2', 'Chapter II')
  const title2_1 = get('section.story.title2_1', 'Built Around')
  const title2_2 = get('section.story.title2_2', 'You.')
  const p4 = get('section.story.p4', "Your body is the most complex thing you'll ever work on. We don't take that lightly.")
  const p5 = get('section.story.p5', 'From the way we train to the way we recover, everything here is designed with one person in mind — you. Not a generic version of you. The actual you that shows up, puts in the reps, and goes home better than you came.')
  const stat1Val = get('section.story.stat1Val', 'REAL')
  const stat1Label = get('section.story.stat1Label', 'Results Driven')
  const stat2Val = get('section.story.stat2Val', 'EXPERT')
  const stat2Label = get('section.story.stat2Label', 'Coaching Team')
  const btnText = get('section.story.btnText', 'SEE THE PLANS')
  const excellenceBadge = get('section.story.excellenceBadge', 'Standard Of Excellence')
  const excellenceText = get('section.story.excellenceText', 'High-caliber strength equipment, engineered biomechanics, and intentional atmosphere.')
  const storyVideo1 = get('section.story.video1', '/video/story-main-v2.mp4')
  const storyVideo2 = get('section.story.video2', '/video/built-v2.mp4')
  
  const customBg = get('section.story.bg', '#ffffff')
  const customText = get('section.story.text', '#020617')
  const customAccent = get('section.story.accent', '#6366f1')

  const storyPadding = get('section.story.padding', 'py-16 sm:py-32 md:py-48')
  const storyMaxWidth = get('section.story.maxWidth', 'max-w-7xl')
  const storyBorderTop = get('section.story.borderTop', '0px')
  const storyBorderBottom = get('section.story.borderBottom', '0px')
  const storyBorderColor = get('section.story.borderColor', 'transparent')
  const storyBorderRadius = get('section.story.borderRadius', '0px')

  return (
    <section 
      ref={containerRef} 
      className={`${storyPadding} overflow-hidden relative`}
      style={{ 
        backgroundColor: customBg, 
        color: customText,
        borderTopWidth: storyBorderTop,
        borderBottomWidth: storyBorderBottom,
        borderColor: storyBorderColor,
        borderStyle: 'solid',
        borderRadius: storyBorderRadius
      }}
    >
      {/* Decorative Brand Text Background */}
      <div className="absolute top-0 right-0 py-32 opacity-[0.02] pointer-events-none -mr-32 hidden xl:block">
        <span className="text-[25rem] font-black leading-none">SHARERS</span>
      </div>

      <div className={`${storyMaxWidth} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>

        {/* Editorial Layout 1: Asymmetric Overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20 lg:gap-0 items-center mb-24 md:mb-64">

          {/* Main Large Video - Premium Editorial Feel */}
          <div className="lg:col-span-8 relative">
            <div className="relative aspect-[16/10] md:aspect-[16/8] overflow-hidden group shadow-2xl">
              <video
                key={storyVideo1}
                src={storyVideo1}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            </div>
            {/* Absolute Detail Element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 opacity-10 hidden lg:block" style={{ backgroundColor: customAccent }} />
          </div>

          {/* Overlapping Text Content - Shifted & Staggered */}
          <div className="lg:col-span-6 lg:-ml-32 lg:-mt-32 z-20 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass-light p-8 sm:p-20 md:p-32 rounded-none space-y-12 shadow-[0_80px_100px_-20px_rgba(0,0,0,0.1)] border-l-4"
              style={{ borderLeftColor: customAccent }}
            >
              <div className="space-y-4">
                <span className="text-xs font-black tracking-[0.4em] uppercase block" style={{ color: customAccent }}>{badge1}</span>
                <h3 className="text-4xl sm:text-6xl md:text-8xl text-luxury" style={{ color: customText }}>
                  {title1_1} <br />
                  <span className="italic font-light" style={{ color: customAccent }}>{title1_2}</span>
                </h3>
              </div>

              <div className="text-lg text-text-muted font-medium leading-[2] max-w-lg space-y-4">
                <p>{p1}</p>
                <p>{p2}</p>
                <p>{p3}</p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div className="w-16 h-[2px]" style={{ backgroundColor: customAccent }} />
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: customText }}>{est}</span>
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
                <span className="text-xs font-black tracking-[0.4em] uppercase block" style={{ color: customAccent }}>{badge2}</span>
                <h3 className="text-4xl sm:text-6xl md:text-7xl text-luxury flex flex-col" style={{ color: customText }}>
                  <span>{title2_1}</span>
                  <span className="opacity-20 -mt-1 sm:-mt-2">{title2_2}</span>
                </h3>
              </div>

              <div className="text-lg text-text-muted font-medium leading-[2] max-w-lg italic space-y-4">
                <p>{p4}</p>
                <p>{p5}</p>
              </div>

              <div className="grid grid-cols-2 gap-12 border-t border-primary/5 pt-12">
                <div>
                  <h4 className="text-3xl sm:text-5xl text-luxury leading-none mb-3 italic" style={{ color: customText }}>{stat1Val}</h4>
                  <p className="text-xs font-bold tracking-widest text-text-muted uppercase">{stat1Label}</p>
                </div>
                <div>
                  <h4 className="text-3xl sm:text-5xl text-luxury leading-none mb-3 italic" style={{ color: customText }}>{stat2Val}</h4>
                  <p className="text-xs font-bold tracking-widest text-text-muted uppercase">{stat2Label}</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/dashboard" className="group text-xs font-black tracking-[0.3em] uppercase flex items-center gap-4 transition-colors" style={{ color: customText }}>
                  {btnText} <span className="w-12 h-[1px] group-hover:w-20 transition-all duration-500" style={{ backgroundColor: customAccent }}></span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Video / Imagery with PIP directly inside the media container */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden shadow-2xl rounded-2xl lg:rounded-none">
              <video
                key={storyVideo2}
                src={storyVideo2}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />

              {/* Chapter II PIP - Directly inside the exact video container in Bottom-Left */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 z-30 w-44 h-28 sm:w-56 sm:h-36 md:w-64 md:h-40 lg:w-72 lg:h-48 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.55)] border-2 sm:border-4 border-white rounded-xl bg-black">
                <video
                  src="/video/shop-detail-v2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest rounded-sm">
                  Arena Detail
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
