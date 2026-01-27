'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const product = {
  id: '1',
  name: 'Sharers Obsidian Black Pass',
  brand: 'Sharers Elite',
  description: 'The definitive membership for the modern athlete. The Obsidian Black Pass grants unlimited access to the SHARERS performance floor, neural-recovery labs, and bespoke biomechanical coaching. This is not just entry; it is an invitation to peak evolution.',
  material: 'Digital Asset / Biometric',
  gemstone: 'Unlimited Access',
  origin: 'SHARERS Performance Floor',
  isNegotiable: false,
  features: [
    'Unlimited performance floor access',
    'Daily Bio-Recovery protocol sessions',
    'Personal Biometric dashboard',
    'Priority Neural-Reset booking'
  ],
  images: [
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80'
  ],
  variants: [
    { id: 'v1', size: { name: '30 Sessions / Flex' }, price: 450, promo_price: 395 },
    { id: 'v2', size: { name: 'Annual / Unlimited' }, price: 3200, promo_price: 2850 },
    { id: 'v3', size: { name: 'Founder / Lifetime' }, price: 12500, promo_price: 11000 }
  ]
};

import { useMembership } from '@/lib/membership-context';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const { subscribe } = useMembership();
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[1]);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleAction = () => {
    // If it's the membership pass, trigger subscribe
    subscribe(30);
    router.push('/dashboard');
  };

  const handleWhatsAppOrder = () => {
    const text = `Hello SHARERS GYM, I would like to inquire about the ${product.name} (${selectedVariant.size.name}). Current Price: $${(selectedVariant.promo_price || selectedVariant.price).toLocaleString()}. URL: ${window.location.href}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2349033333333?text=${encodedText}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-white selection:bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 sm:mb-16"
        >
          <Link href="/products" className="inline-flex items-center gap-3 text-slate-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.4em] group">
            <div className="p-3 rounded-none border border-slate-100 group-hover:border-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            The Vault
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery - Optimized */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] rounded-none overflow-hidden bg-secondary relative editorial-shadow group"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-[2.5s] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

              <div className="absolute bottom-8 left-8 z-10">
                <span className="glass-light px-6 py-3 rounded-none text-[10px] font-black text-primary uppercase tracking-[0.4em] border border-white/20">
                  {product.brand} • ELITE TIER
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-6 p-4 bg-secondary/20 rounded-none w-fit border border-primary/5"
            >
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden border-2 transition-all relative ${activeImage === img ? 'border-accent shadow-2xl' : 'border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </motion.div>
          </div>

          {/* Product Info - Editorial Style */}
          <div className="flex flex-col pt-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.6em]">
                  Performance Protocols
                </span>
                <button className="w-12 h-12 rounded-none border border-slate-100 flex items-center justify-center text-slate-200 hover:text-accent hover:border-accent transition-all active:scale-95">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl text-luxury text-primary">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex text-accent gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                  Elite Performance Verification
                </span>
              </div>

              <div className="flex items-center gap-8 pb-12 border-b border-primary/5 flex-wrap">
                <div className="flex items-baseline gap-6">
                  <span className="text-5xl sm:text-7xl font-light text-primary tabular-nums">
                    ${(selectedVariant.promo_price || selectedVariant.price).toLocaleString()}
                  </span>
                  {selectedVariant.promo_price && (
                    <span className="text-2xl text-slate-200 line-through font-light tabular-nums">
                      ${selectedVariant.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector - Sharp Style */}
              <div className="space-y-8">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                  <span>Investment Grade</span>
                  <span className="text-accent cursor-pointer flex items-center gap-2 group">
                    Elite Onboarding <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-8 py-6 rounded-none text-[10px] font-black border-2 transition-all uppercase tracking-[0.3em] relative overflow-hidden group
                          ${selectedVariant.id === v.id
                          ? 'border-primary bg-primary text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]'
                          : 'border-secondary bg-secondary/30 text-primary hover:border-accent/40'}`}
                    >
                      {v.size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elite Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-8 border-t border-primary/5">
                <div className="p-8 bg-secondary/10 border-r border-primary/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Tier</p>
                  <p className="text-[12px] font-black text-primary uppercase tracking-widest">{product.material}</p>
                </div>
                <div className="p-8 bg-secondary/10 border-r border-primary/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Access</p>
                  <p className="text-[12px] font-black text-primary uppercase tracking-widest">{product.gemstone}</p>
                </div>
                <div className="p-8 bg-secondary/10">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Location</p>
                  <p className="text-[12px] font-black text-primary uppercase tracking-widest">{product.origin}</p>
                </div>
              </div>

              {/* Description Reveal */}
              <div className="space-y-10">
                <p className="text-xl text-text-muted font-light leading-[1.8] max-w-2xl">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      <div className="w-10 h-[1px] bg-accent/40" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* High-End Actions */}
              <div className="pt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <button
                  onClick={handleAction}
                  className="btn-primary flex items-center justify-center gap-4 py-6"
                >
                  <ShoppingCart className="w-5 h-5" />
                  START PROTOCOL
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-4 border border-primary/10 bg-white font-black text-[10px] tracking-[0.4em] uppercase py-6 rounded-none hover:bg-secondary transition-all active:scale-95 px-8 editorial-shadow"
                >
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  THE CONCIERGE
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-16 flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-20 border-t border-primary/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-none bg-secondary flex items-center justify-center text-accent shadow-sm">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-2">Biometric verified</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">High-Purity Standards</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-none bg-secondary flex items-center justify-center text-accent shadow-sm">
                    <Truck className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-2">Instant access</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Official Member Registry</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 grain-overlay pointer-events-none opacity-5"></div>
    </div>
  );
}
