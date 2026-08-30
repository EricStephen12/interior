'use client'

import React from 'react'
import { useCustomization } from '@/lib/customization-context'

export default function TermsPage() {
  const { get } = useCustomization()
  const badge = get('section.terms.badge', 'Terms & Conditions')
  const title1 = get('section.terms.title1', 'Terms of')
  const title2 = get('section.terms.title2', 'Use.')
  const subtitle = get('section.terms.subtitle', 'Welcome to SHARERS GYM. By accessing our website, purchasing our products, or using our facilities, you agree to comply with and be bound by the following terms and conditions of use.')

  const sec1Title = get('section.terms.sec1Title', '1. Facility Access & Memberships')
  const sec1Body = get('section.terms.sec1Body', 'Access to SHARERS GYM is granted exclusively via your digital member pass or active membership subscription. Memberships are strictly personal, non-transferable, and non-refundable.')
  
  const sec2Title = get('section.terms.sec2Title', '2. E-Commerce & Day Passes')
  const sec2Body = get('section.terms.sec2Body', 'All physical products, day passes, and memberships are billed in Nigerian Naira (₦) through our authorized payment gateways.')
  
  const sec3Title = get('section.terms.sec3Title', '3. Health & Safety Waiver')
  const sec3Body = get('section.terms.sec3Body', 'By utilizing SHARERS GYM facilities, you acknowledge that physical exercise involves inherent risks. You certify that you are in good physical condition.')

  const customBg = get('section.terms.bg', '#ffffff')
  const customText = get('section.terms.text', '#020617')

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
