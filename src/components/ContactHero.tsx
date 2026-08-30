'use client'

import React from 'react'
import Image from 'next/image'
import { useCustomization } from '@/lib/customization-context'

export default function ContactHero() {
  const { get } = useCustomization()
  const badge = get('section.contact.badge', 'MEMBER SUPPORT')
  const title1 = get('section.contact.title1', 'Get in')
  const title2 = get('section.contact.title2', 'Touch.')
  const subtitle = get('section.contact.subtitle', "Whether you're ready to start training or have a question about your membership, we're here.")
  const contactImage = get('section.contact.image', '/images/real-gym-banner.png')

  return (
    <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={contactImage}
          alt="SHARERS GYM Contact"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 w-full">
        <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4 block">{badge}</span>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] font-display">
          {title1} <span className="text-accent italic font-light">{title2}</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/40 font-medium mt-4 max-w-2xl">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
