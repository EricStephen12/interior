'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import PromoBanner from './PromoBanner'
import AmbientBackground from './AmbientBackground'

const SupportChat = dynamic(() => import('./SupportChat'), { ssr: false })
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false })

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-white relative">
      <AmbientBackground />
      {/* Global Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] grain-overlay"></div>

      <CustomCursor />
      {!isAdmin && <PromoBanner />}
      {!isAdmin && <Header />}
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
      {!isAdmin && <Footer />}
      {!isAdmin && <SupportChat />}
    </div>
  )
}
