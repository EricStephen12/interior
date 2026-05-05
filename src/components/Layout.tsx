'use client'

import Header from './Header'
import Footer from './Footer'
import SupportChat from './SupportChat'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Global Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] grain-overlay"></div>

      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <SupportChat />
    </div>
  )
}

