'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'product' | 'text';

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');
  const [isMobile, setIsMobile] = useState(true); // default to mobile to avoid SSR flash

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.hover-card-tactile');
    const btn = target.closest('button') || target.tagName.toLowerCase() === 'button';
    const link = target.closest('a') || target.tagName.toLowerCase() === 'a';

    if (card) {
      setVariant('product');
      setLabel('VIEW');
    } else if (btn) {
      setVariant('hover');
      setLabel('CLICK');
    } else if (link) {
      setVariant('hover');
      setLabel('');
    } else {
      setVariant('default');
      setLabel('');
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile, handleMouseMove, handleMouseOver]);

  if (isMobile) return null;

  const size = variant === 'product' ? 88 : variant === 'hover' ? 52 : 32;
  const bg =
    variant === 'product'
      ? 'rgba(99,102,241,0.15)'
      : variant === 'hover'
      ? 'rgba(99,102,241,0.12)'
      : 'transparent';
  const border =
    variant === 'default' ? '2px solid #6366f1' : '2px solid rgba(99,102,241,0.7)';

  return (
    <>
      {/* Hide default system cursor via global style */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: bg,
          border,
          backdropFilter: variant === 'product' ? 'blur(4px)' : 'none',
        }}
        transition={{ width: { type: 'spring', stiffness: 300, damping: 25 }, height: { type: 'spring', stiffness: 300, damping: 25 } }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white font-black text-[9px] tracking-[0.3em] uppercase select-none"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[99999]"
        style={{
          x: cursorX,
          y: cursorY,
          marginLeft: -3,
          marginTop: -3,
          opacity: variant === 'default' ? 1 : 0,
        }}
      />
    </>
  );
}
