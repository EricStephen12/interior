'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, MessageCircle, MapPin, Mail, ArrowUpRight, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-950 text-white pt-32 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Section: Theatrical Brand Call */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div className="space-y-10">
            <Link href="/" className="flex flex-col group">
              <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white group-hover:text-sky-400 transition-colors duration-500">
                SMART BEST
              </span>
              <span className="text-xs tracking-[0.6em] font-black text-sky-600 uppercase mt-2">
                Luxury Standard
              </span>
            </Link>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Elevating the Nigerian home with curated authenticity. The pinnacle of rest, strictly authenticated.
            </p>
          </div>

          <div className="glass-dark p-12 rounded-[3rem] space-y-8 self-center">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase">Newsletter</h4>
            <h3 className="text-3xl font-bold tracking-tight">Join the Elite Circle.</h3>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              <button className="absolute right-0 bottom-4 text-sky-400 hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32">
          <FooterSection
            title="Collections"
            links={[
              { label: 'Mattresses', href: '/products?category=Mattresses' },
              { label: 'Pillows', href: '/products?category=Pillows' },
              { label: 'Furniture', href: '/products?category=Furniture' },
              { label: 'New Arrivals', href: '/products' }
            ]}
          />
          <FooterSection
            title="About"
            links={[
              { label: 'Our Legacy', href: '/about' },
              { label: 'Artisans', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'FAQs', href: '/faqs' }
            ]}
          />
          <FooterSection
            title="Registry"
            links={[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Refunds', href: '/refund' }
            ]}
          />
          <div className="space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase">Connect</h4>
            <div className="flex gap-6">
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={MessageCircle} href="#" />
              <SocialLink icon={Phone} href="#" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>Abuja • Benin City</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Mail className="w-4 h-4 text-sky-600" />
                <span>concierge@smartbest.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase">
            © {currentYear} Smart Best Brands. Crafted for Excellence.
          </p>
          <div className="flex gap-8 text-[10px] font-black tracking-widest text-slate-500 uppercase">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-600/50 to-transparent"></div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-8">
      <h4 className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase">{title}</h4>
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
      className="w-12 h-12 glass-dark rounded-2xl flex items-center justify-center text-white hover:text-sky-400 transition-colors"
    >
      <Icon className="w-5 h-5" />
    </motion.a>
  )
}
