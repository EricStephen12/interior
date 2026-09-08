'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import PromoBanner from './PromoBanner'
import AmbientBackground from './AmbientBackground'

const SupportChat = dynamic(() => import('./SupportChat'), { ssr: false })

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isReceipt = pathname.startsWith('/receipt')
  const isStandalone = isAdmin || isReceipt

  return (
    <div className={`min-h-screen relative ${isReceipt ? 'bg-[#f4f6fa]' : 'bg-white'}`}>
      <AmbientBackground />
      {/* Global Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] grain-overlay"></div>

      {!isStandalone && <PromoBanner />}
      {!isStandalone && <Header />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isStandalone && <Footer />}
      {!isStandalone && <SupportChat />}
    </div>
  )
}
