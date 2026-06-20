'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import dynamic from 'next/dynamic'

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
      {/* Global Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] grain-overlay"></div>

      <CustomCursor />
      {!isAdmin && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <SupportChat />}
    </div>
  )
}

