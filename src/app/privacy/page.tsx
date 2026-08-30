'use client'

import React from 'react'
import { useCustomization } from '@/lib/customization-context'

export default function PrivacyPage() {
  const { get } = useCustomization()
  const badge = get('section.privacy.badge', 'Privacy Policy')
  const title1 = get('section.privacy.title1', 'Privacy')
  const title2 = get('section.privacy.title2', 'Policy.')
  const subtitle = get('section.privacy.subtitle', 'We respect your privacy. This policy outlines how SHARERS GYM collects, uses, and protects your personal information across our website, mobile applications, and physical facilities.')

  const sec1Title = get('section.privacy.sec1Title', '1. Information We Collect')
  const sec1Body = get('section.privacy.sec1Body', 'We collect essential information such as your name, email address, phone number, and physical address when you register for an account, subscribe to our newsletter, or purchase a membership.')
  
  const sec2Title = get('section.privacy.sec2Title', '2. How We Use Your Data')
  const sec2Body = get('section.privacy.sec2Body', 'To provide and maintain our services, including processing transactions and managing your digital access pass. To communicate updates and improve our web platform.')
  
  const sec3Title = get('section.privacy.sec3Title', '3. Data Sharing & Disclosure')
  const sec3Body = get('section.privacy.sec3Body', 'We do not sell your personal data to third parties. We may share necessary information with trusted service providers solely for the purpose of operating our business.')
  
  const sec4Title = get('section.privacy.sec4Title', '4. Data Security')
  const sec4Body = get('section.privacy.sec4Body', 'We implement industry-standard encryption, SSL protocols, and modern authentication via Clerk to protect your personal and payment information.')

  const customBg = get('section.privacy.bg', '#ffffff')
  const customText = get('section.privacy.text', '#020617')

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

          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest border-l-4 border-accent pl-6" style={{ color: customText }}>
              {sec4Title}
            </h2>
            <div className="space-y-4 text-text-muted font-medium leading-relaxed">
              <p>{sec4Body}</p>
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
