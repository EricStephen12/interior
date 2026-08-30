'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { t } from '@/lib/theme'

export default function AmbientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Parallax effect for the massive background text
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    setIsMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      
      {/* 1. Ambient Glow following cursor (very subtle) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.12] bg-accent mix-blend-multiply"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 1.5 }}
      />
      
      {/* 2. Static Ambient Glows in corners for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03] bg-primary" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.06] bg-accent" />

      {/* 3. Parallax Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.02] overflow-hidden whitespace-nowrap font-black uppercase text-[15vw] leading-[0.85] tracking-tighter select-none">
        <motion.div style={{ y: y1 }} className="translate-x-[-10%]">
          PERFORMANCE
        </motion.div>
        <motion.div style={{ y: y2, WebkitTextStroke: `3px ${t.colors.black}`, color: 'transparent' }} className="translate-x-[5%]">
          DISCIPLINE
        </motion.div>
        <motion.div style={{ y: y1 }} className="translate-x-[-15%]">
          SHARERS GYM
        </motion.div>
      </div>
      
    </div>
  )
}
