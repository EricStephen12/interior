'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUser, useSignIn } from '@clerk/nextjs'
import { Instagram, MessageCircle, MapPin, Mail, ArrowUpRight, Phone } from 'lucide-react'
import kingsChatWebSdk from 'kingschat-web-sdk'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { isSignedIn, isLoaded } = useUser()
  const { signIn } = useSignIn()

  const loginWithKingsChat = async () => {
    if (!signIn) return

    try {
      const loginOptions = {
        clientId: '4be30fee-f42f-4e1a-ae4e-cb4f192c4219',
        scopes: ["profile"] 
      }

      const response = await kingsChatWebSdk.login(loginOptions)
      console.log('KingsChat SDK Response:', response)
      
      // Here we will handle the response and tell Clerk to sign in
      alert('KingsChat Login Successful! Check console for data.')
      
    } catch (err: any) {
      console.error('KingsChat SDK Error:', err)
      alert('KingsChat SDK Error: ' + (err.message || 'Unknown error'))
    }
  }

  return (
    <footer className="bg-primary text-white pt-16 sm:pt-32 pb-12 overflow-hidden relative border-t border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Section: Theatrical Brand Call */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 mb-16 sm:mb-32">
          <div className="space-y-10">
            <Link href="/" className="flex flex-col group">
              <span className="text-3xl sm:text-5xl md:text-7xl font-black tracking-[0.3em] leading-none text-white group-hover:text-accent transition-colors duration-500">
                SHARERS
              </span>
              <span className="text-[10px] tracking-[0.6em] font-black text-accent uppercase mt-2">
                GYM • PRECISION
              </span>
            </Link>
            <p className="text-base sm:text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Where the body catches up to the will. Trained here. Built for life.
            </p>
          </div>

          <div className="glass-dark p-8 sm:p-12 rounded-none border border-white/5 space-y-8 self-center">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Newsletter</h4>
            <h3 className="text-xl sm:text-3xl font-bold tracking-tight">Stay updated.</h3>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-white/10 pb-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors"
              />
              <button className="absolute right-0 bottom-4 text-accent hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 mb-16 sm:mb-32">
          <FooterSection
            title="Shop"
            links={[
              { label: 'shop now', href: '/products' },
              { label: 'dashboard', href: '/dashboard' },
              { label: 'Journal', href: '/blog' }
            ]}
          />
          <FooterSection
            title="Protocol"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Support', href: '/contact' }
            ]}
          />
          <FooterSection
            title="Legal"
            links={[
              { label: 'Terms of Use', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' }
            ]}
          />
          <div className="space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Connect</h4>
            <div className="flex gap-6">
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={MessageCircle} href="#" />
              <SocialLink icon={Phone} href="#" />
            </div>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Mail className="w-4 h-4 text-accent" />
                <span>support@sharersgym.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase order-2 md:order-1">
            © {currentYear} SHARERS GYM. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8 order-1 md:order-2">
            {!isSignedIn && isLoaded && (
              <div className="flex gap-4">
                <button 
                  onClick={loginWithKingsChat}
                  className="px-6 py-2 bg-[#1e90ff] text-white text-[10px] font-black tracking-widest uppercase hover:bg-white hover:text-[#1e90ff] transition-all"
                >
                  KingsChat Login
                </button>
                <Link href="/sign-up" className="px-6 py-2 bg-accent text-primary text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all">
                  JOIN NOW
                </Link>
              </div>
            )}
            <div className="flex gap-6 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Legal</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-8">
      <h4 className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">{title}</h4>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-slate-400 hover:text-white transition-colors font-medium text-sm block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ icon: Icon, href }: { icon: React.ElementType, href: string }) {
  return (
    <motion.a
      whileHover={{ y: -5 }}
      href={href}
      className="w-12 h-12 glass-dark rounded-none border border-white/5 flex items-center justify-center text-white hover:text-accent transition-colors"
    >
      <Icon className="w-5 h-5" />
    </motion.a>
  )
}
