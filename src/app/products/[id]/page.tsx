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
  name: 'Vitafoam Grandeur Mattress',
  brand: 'Vitafoam',
  description: 'Experience unparalleled luxury with the Vitafoam Grandeur. Crafted with high-density memory foam and a premium breathable cover, this mattress adapts to your body shape for optimal spinal alignment and pressure relief.',
  firmness: 'Superior Hard',
  material: 'High-Density Memory Foam',
  finishing: 'Damascus Fabric Quilting',
  isNegotiable: true,
  features: [
    'Authentic Vitafoam quality',
    '10-Year Manufacturer Warranty',
    'Memory foam for pressure relief',
    'Breathable premium fabric finishing'
  ],
  images: [
    '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg'
  ],
  variants: [
    { id: 'v1', size: { name: 'Single (3.5x6)' }, price: 125000, promo_price: 110000 },
    { id: 'v2', size: { name: 'Double (4.5x6)' }, price: 155000, promo_price: 140000 },
    { id: 'v3', size: { name: 'Family (6x6)' }, price: 185000, promo_price: 165000 },
    { id: 'v4', size: { name: 'King (6x7)' }, price: 215000, promo_price: 195000 }
  ]
};

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[2]);
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleWhatsAppOrder = () => {
    const text = `Hello Smart Best Brands, I would like to order the ${product.name} (${selectedVariant.size.name})${product.isNegotiable ? ' - I am interested in negotiating the price' : ''}. Current Price: ₦${(selectedVariant.promo_price || selectedVariant.price).toLocaleString()}. URL: ${window.location.href}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2349033333333?text=${encodedText}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-white selection:bg-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 sm:mb-12"
        >
          <Link href="/products" className="inline-flex items-center gap-3 text-slate-400 hover:text-blue-950 transition-all font-black text-[10px] uppercase tracking-[0.3em] group">
            <div className="p-2 rounded-full border border-slate-100 group-hover:border-blue-950 transition-colors">
              <ArrowLeft className="w-3 h-3" />
            </div>
            Back to Collections
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Image Gallery - Optimized */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden bg-slate-50 relative shadow-2xl shadow-blue-900/5 group"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10">
                <span className="glass px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black text-blue-950 uppercase tracking-[0.4em]">
                  {product.brand} Essence
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 p-2 bg-slate-50/50 rounded-[2rem] sm:rounded-[3rem] w-fit"
            >
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 transition-all relative ${activeImage === img ? 'border-sky-600 shadow-xl' : 'border-transparent grayscale hover:grayscale-0'}`}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.5em]">
                  Official Brand Partner
                </span>
                <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-200 hover:text-red-500 hover:border-red-100 transition-all active:scale-90">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-blue-950 tracking-[-0.04em] leading-[0.9] font-display">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex text-amber-400 gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Verified Excellence
                </span>
              </div>

              <div className="flex items-center gap-6 pb-8 border-b border-slate-100 flex-wrap">
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="text-4xl sm:text-6xl font-black text-blue-950 tracking-tighter">
                    ₦{(selectedVariant.promo_price || selectedVariant.price).toLocaleString()}
                  </span>
                  {selectedVariant.promo_price && (
                    <span className="text-xl sm:text-2xl text-slate-300 line-through font-bold">
                      ₦{selectedVariant.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.isNegotiable && (
                  <span className="bg-sky-50 text-sky-600 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-sky-100 font-inter">
                    Price Negotiable
                  </span>
                )}
              </div>

              {/* Size Selector - Glass Style */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Dimensions</span>
                  <span className="text-sky-600 cursor-pointer flex items-center gap-1 group">
                    Measurement Protocol <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-5 rounded-2xl text-[10px] font-black border-2 transition-all uppercase tracking-[0.2em] relative overflow-hidden group
                          ${selectedVariant.id === v.id
                          ? 'border-blue-950 bg-blue-950 text-white shadow-2xl shadow-blue-200'
                          : 'border-slate-50 bg-slate-50 text-blue-950 hover:border-sky-200'}`}
                    >
                      {v.size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elite Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 font-inter">Firmness</p>
                  <p className="text-[11px] font-black text-blue-950 uppercase tracking-wider">{product.firmness}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 font-inter">Material</p>
                  <p className="text-[11px] font-black text-blue-950 uppercase tracking-wider">{product.material}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 font-inter">Finishing</p>
                  <p className="text-[11px] font-black text-blue-950 uppercase tracking-wider">{product.finishing}</p>
                </div>
              </div>

              {/* Description Reveal */}
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-slate-500 font-medium leading-relaxed font-inter">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest font-inter">
                      <div className="w-1.5 h-1.5 bg-sky-600 rounded-full" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* High-End Actions */}
              <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => addToCart(product as any, selectedVariant as any)}
                  className="btn-elite group flex items-center justify-center gap-4"
                >
                  <ShoppingCart className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  RESERVE NOW
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-4 border-2 border-slate-100 font-black text-[10px] tracking-[0.3em] uppercase py-5 rounded-full hover:bg-green-50 hover:border-green-100 hover:text-green-600 transition-all active:scale-95 px-6"
                >
                  <MessageCircle className="w-4 h-4" />
                  WHATSAPP CONCIERGE
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-12 flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sky-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-950 uppercase tracking-widest leading-none mb-1 font-inter">Authenticity</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-inter">Strictly Certified</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sky-600">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-950 uppercase tracking-widest leading-none mb-1 font-inter">Logistics</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none font-inter">White Glove Delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
