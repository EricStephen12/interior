'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function StorySection() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Layout 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 sm:mb-32 md:mb-40">

          {/* Main Large Image */}
          <div className="lg:col-span-7">
            <RevealImage
              src="/images/exricx/luxury_lifestyle_jewelry_1769449345647.png"
              alt="EXRICX BEAUTY Luxury Lifestyle"
              className="aspect-[4/5] md:aspect-[16/10] rounded-none shadow-2xl"
            />
          </div>

          {/* Overlapping Text Content */}
          <div className="lg:col-span-5 lg:-ml-24 z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass-light p-12 sm:p-16 md:p-24 rounded-none space-y-10 editorial-shadow"
            >
              <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">The Genesis</span>
              <h3 className="text-5xl md:text-7xl text-luxury text-primary">
                Precision as a <br />
                <span className="text-accent italic">Philosophy.</span>
              </h3>
              <p className="text-xl text-text-muted font-light leading-[1.8]">
                Born from the engineering excellence of the EXRICX tech lab, EXRICX BEAUTY was established to bridge the gap between technological precision and timeless elegance. We believe beauty is a science of details.
              </p>
              <div className="pt-8">
                <div className="w-20 h-[1px] bg-primary/20"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Editorial Layout 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Content Left */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-8 block">Our Vision</span>
                <h3 className="text-5xl md:text-7xl text-luxury text-primary">
                  Mastering the <br />
                  <span className="text-primary/20">Art of Essence.</span>
                </h3>
              </div>

              <p className="text-xl text-text-muted font-light leading-[1.8]">
                By integrating lab-tested quality with artisanal craftsmanship, we ensure every jewelry piece and signature fragrance carries the signature of EXRICX: unapologetic luxury backed by technical mastery.
              </p>

              <div className="flex gap-16">
                <div>
                  <h4 className="text-6xl text-luxury text-primary leading-none mb-3">24k</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Purity Standard</p>
                </div>
                <div>
                  <h4 className="text-6xl text-luxury text-primary leading-none mb-3">0.01</h4>
                  <p className="text-[10px] font-black tracking-widest text-text-muted uppercase">Micron Precision</p>
                </div>
              </div>

              <div className="pt-10">
                <button className="text-[10px] font-black tracking-[0.4em] text-primary uppercase border-b border-accent pb-4 hover:tracking-[0.6em] transition-all duration-700">
                  Explore the Lab &rarr;
                </button>
              </div>
            </motion.div>
          </div>

          {/* Images Right */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <RevealImage
                  src="/images/exricx/luxury_perfume_detail_1769449375639.png"
                  alt="EXRICX BEAUTY Detail"
                  className="aspect-square rounded-none shadow-xl"
                />
              </div>
              <div className="col-span-4 self-end -mb-12">
                <RevealImage
                  src="/images/exricx/luxury_beauty_hero_v2_1769449281975.png"
                  alt="EXRICX BEAUTY Essence"
                  className="aspect-[3/4] rounded-none border-l-8 border-secondary shadow-lg"
                />
              </div>
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
