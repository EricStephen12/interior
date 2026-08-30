'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser, useSignIn } from '@clerk/nextjs'
import { Instagram, MessageCircle, MapPin, Mail, ArrowUpRight, Phone, Check, Loader2 } from 'lucide-react'

import { useCustomization } from '@/lib/customization-context'

export default function Footer() {
  const { get } = useCustomization()
  const currentYear = new Date().getFullYear()
  const { isSignedIn, isLoaded } = useUser()
  const [email, setEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const footerEst = get('section.footer.est', 'EST. 2024')
  const footerTagline = get('section.footer.tagline', 'Show up. Put in the work. Leave better than you came.')
  const newsletterBadge = get('section.footer.newsletterBadge', 'Newsletter')
  const newsletterTitle = get('section.footer.newsletterTitle', 'Stay updated.')
  const footerAddress = get('section.footer.address', 'Lagos, Nigeria')
  const footerEmail = get('section.footer.email', 'sharersmall@gmail.com')
  const footerPhone = get('section.footer.phone', '+234 808 906 2085')
  const footerCopyright = get('section.footer.copyright', `© 2024 - ${currentYear} SHARERS GYM. All Rights Reserved.`)
  
  const footerBg = get('section.footer.bg', '#020617')
  const footerText = get('section.footer.text', '#ffffff')
  const footerAccent = get('section.footer.accent', '#6366f1')

  const footerPadding = get('section.footer.padding', 'pt-16 sm:pt-32 pb-12')
  const footerMaxWidth = get('section.footer.maxWidth', 'max-w-7xl')
  const footerBorderTop = get('section.footer.borderTop', '1px')
  const footerBorderBottom = get('section.footer.borderBottom', '0px')
  const footerBorderColor = get('section.footer.borderColor', 'rgba(99, 102, 241, 0.1)')
  const footerBorderRadius = get('section.footer.borderRadius', '0px')

  const handleNewsletterSubmit = async () => {
    if (!email.trim() || !email.includes('@')) return
    setNewsletterState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email,
          subject: 'Newsletter Signup',
          message: `New newsletter signup from: ${email}`
        })
      })
      if (res.ok) {
        setNewsletterState('success')
        setEmail('')
      } else {
        setNewsletterState('error')
      }
    } catch {
      setNewsletterState('error')
    }
  }

  return (
    <footer 
      className={`${footerPadding} overflow-hidden relative`}
      style={{ 
        backgroundColor: footerBg, 
        color: footerText,
        borderTopWidth: footerBorderTop,
        borderBottomWidth: footerBorderBottom,
        borderColor: footerBorderColor,
        borderStyle: 'solid',
        borderRadius: footerBorderRadius
      }}
    >
      <div className={`${footerMaxWidth} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>

        {/* Top Section: Theatrical Brand Call */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 mb-16 sm:mb-32">
          <div className="space-y-10">
            <Link href="/" className="flex flex-col group">
              <img src="/logo.png" alt="Sharers Gym" className="h-16 sm:h-24 object-contain brightness-0 invert" />
              <span className="text-[10px] tracking-[0.6em] font-black uppercase mt-4" style={{ color: footerAccent }}>
                {footerEst}
              </span>
            </Link>
            <p className="text-base sm:text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              {footerTagline}
            </p>
          </div>

          <div className="glass-dark p-8 sm:p-12 rounded-none border border-white/5 space-y-8 self-center">
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: footerAccent }}>{newsletterBadge}</h4>
            <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white">{newsletterTitle}</h3>
            {newsletterState === 'success' ? (
              <div className="flex items-center gap-3 text-green-400">
                <Check className="w-5 h-5" />
                <p className="text-sm font-bold">You're on the list! We'll keep you posted.</p>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setNewsletterState('idle') }}
                  onKeyDown={e => e.key === 'Enter' && handleNewsletterSubmit()}
                  disabled={newsletterState === 'loading'}
                  className="w-full bg-transparent border-b border-white/10 pb-4 text-white focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  disabled={newsletterState === 'loading' || !email.trim()}
                  className="absolute right-0 bottom-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors disabled:opacity-50"
                  style={{ color: footerAccent }}
                >
                  {newsletterState === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-16 pb-16 sm:pb-24 border-b border-white/5">
          <FooterSection 
            title="The Arena" 
            links={[
              { label: 'Overview', href: '/' },
              { label: 'Shop Gear', href: '/products' },
              { label: 'Day Passes', href: '/dashboard' },
              { label: 'Subscriptions', href: '/dashboard' }
            ]} 
          />
          <FooterSection 
            title="Registry" 
            links={[
              { label: 'Journal & Stories', href: '/blogs' },
              { label: 'Coaches', href: '/dashboard' },
              { label: 'Training Rules', href: '/terms' },
              { label: 'Member Portal', href: '/dashboard' }
            ]} 
          />
          <FooterSection 
            title="Connect" 
            links={[
              { label: 'Contact Us', href: '/contact' },
              { label: 'Live Support', href: '/contact' },
              { label: 'Community', href: 'https://instagram.com/sharersgym' },
              { label: 'Instagram', href: 'https://instagram.com/sharersgym' }
            ]} 
          />
          <div className="space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase" style={{ color: footerAccent }}>HQ Terminal</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <MapPin className="w-4 h-4" style={{ color: footerAccent }} />
                <span>{footerAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Mail className="w-4 h-4" style={{ color: footerAccent }} />
                <span>{footerEmail}</span>
              </div>
              {footerPhone && (
                <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                  <Phone className="w-4 h-4" style={{ color: footerAccent }} />
                  <span>{footerPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase order-2 md:order-1">
            {footerCopyright}
          </p>
          <div className="flex items-center gap-8 order-1 md:order-2">
            {!isSignedIn && isLoaded && (
              <Link href="/sign-up" className="px-6 py-2 bg-accent text-primary text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all">
                JOIN NOW
              </Link>
            )}
            <div className="flex gap-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Legal</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black tracking-[0.4em] text-white uppercase">{title}</h4>
      <ul className="space-y-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href={link.href}
              className="text-sm font-bold text-slate-400 hover:text-accent flex items-center gap-1 transition-colors group"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 group-hover:translate-x-0.5 text-accent" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
