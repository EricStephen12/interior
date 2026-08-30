'use client'

import React from 'react'
import { useCustomization } from '@/lib/customization-context'

export default function RefundPage() {
  const { get } = useCustomization()
  const badge = get('section.refund.badge', 'Refunds & Exchanges')
  const title1 = get('section.refund.title1', 'Refund')
  const title2 = get('section.refund.title2', 'Policy.')
  const subtitle = get('section.refund.subtitle', 'We want you to be fully satisfied with your SHARERS GYM experience. Please review our comprehensive return, exchange, and cancellation policies below.')

  const sec1Title = get('section.refund.sec1Title', '1. Physical Products & Gear')
  const sec1Body = get('section.refund.sec1Body', 'Unused apparel, gear, and accessories in their original packaging with tags intact can be returned within 14 days of receipt for a full refund or exchange.')
  
  const sec2Title = get('section.refund.sec2Title', '2. Memberships & Gym Passes')
  const sec2Body = get('section.refund.sec2Body', 'All membership plans are billed upfront and are non-refundable once the billing cycle begins. You may cancel your membership at any time via your user dashboard.')
  
  const sec3Title = get('section.refund.sec3Title', '3. Digital Access (Day Passes)')
  const sec3Body = get('section.refund.sec3Body', 'Day passes purchased via the platform are non-refundable and hold no direct fiat cash value.')

  const customBg = get('section.refund.bg', '#ffffff')
  const customText = get('section.refund.text', '#020617')

  return (
    <div 
      className="pt-24 sm:pt-40 pb-16 sm:pb-32 min-h-screen selection:bg-secondary"
      style={{ backgroundColor: customBg, color: customText }}
    >
      <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
        <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">{badge}</span>
        <h1 className="text-5xl md:text-7xl text-luxury mb-12" style={{ color: customText }}>
          {title1} <span className="text-accent italic">{title2}</span>
        </h1>
        <p className="text-text-muted font-medium leading-relaxed mb-12 text-xl">
          {subtitle}
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest border-l-4 border-accent pl-6" style={{ color: customText }}>
              {sec1Title}
            </h2>
            <div className="space-y-4 text-text-muted font-medium leading-relaxed">
              <p>{sec1Body}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest border-l-4 border-accent pl-6" style={{ color: customText }}>
              {sec2Title}
            </h2>
            <div className="space-y-4 text-text-muted font-medium leading-relaxed">
              <p>{sec2Body}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest border-l-4 border-accent pl-6" style={{ color: customText }}>
              {sec3Title}
            </h2>
            <div className="space-y-4 text-text-muted font-medium leading-relaxed">
              <p>{sec3Body}</p>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-12 border-t border-primary/5">
          <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2024</p>
          <p className="text-xs text-text-muted font-medium mt-4">Last Updated: 2026</p>
        </div>
      </div>
    </div>
  )
}
