'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        {/* Editorial 404 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-8 block">Error Protocol 404</span>
          
          <h1 className="text-8xl sm:text-[12rem] font-black text-primary leading-none tracking-tighter mb-8 opacity-5">
            404
          </h1>
          
          <div className="-mt-24 sm:-mt-40 relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-primary tracking-tight leading-tight mb-8">
              Vault Access <br />
              <span className="text-accent italic font-light">Denied.</span>
            </h2>
            
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12 max-w-md mx-auto">
              The coordinate you are looking for doesn't exist in our protocol. It may have been moved, deleted, or never existed in this timeline.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/">
                <button className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500 flex items-center gap-3">
                  <ArrowLeft className="w-4 h-4" /> Back to Base
                </button>
              </Link>
              
              <Link href="/products">
                <button className="px-10 py-5 bg-white border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] hover:border-accent transition-all duration-500 flex items-center gap-3">
                   Shop Protocol <Search className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative Background Text */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.02] select-none flex items-center justify-center">
          <p className="text-[20vw] font-black text-primary uppercase whitespace-nowrap">SHARERS GYM • SHARERS GYM • SHARERS GYM</p>
        </div>
      </div>
    </div>
  )
}
