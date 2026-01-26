'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ShoppingCartIcon,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Ruler,
  DollarSign,
  Tag,
  Layers,
  X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const THE_COLLECTION = ['All', 'EXRICX Signature', 'Noir Collection', 'Luxe Lab', 'Artisan Gold']
const CATEGORIES = ['All', 'Necklaces', 'Rings', 'Earrings', 'Fragrance']
const SIZES = ['All', 'Standard', 'Petite', 'Custom']
const PRICE_RANGES = ['All', 'Under $200', '$200 - $1,000', '$1,000 - $5,000', 'Above $5,000']

const mockProducts = [
  {
    id: '1',
    name: 'EXRICX Diamond Petal Necklace',
    brand: 'EXRICX Signature',
    category: 'Necklaces',
    size: 'Standard',
    price: 4500,
    promo_price: 3950,
    is_negotiable: false,
    images: [
      '/images/exricx/luxury_diamond_necklace_1769449448575.png',
      '/images/exricx/luxury_lifestyle_jewelry_1769449345647.png'
    ],
    description: 'A masterpiece of precision. Hand-set diamonds in a floral petal arrangement, suspended on an 18k white gold chain.',
    in_stock: true,
  },
  {
    id: '2',
    name: 'Lab-Grown Emerald Solitaire',
    brand: 'Luxe Lab',
    category: 'Rings',
    size: 'Custom',
    price: 1250,
    is_negotiable: false,
    images: [
      '/images/exricx/luxury_gold_ring_1769449479727.png',
      '/images/exricx/luxury_lifestyle_jewelry_1769449345647.png'
    ],
    description: 'Technical precision meets natural beauty. A vibrant 2-carat emerald set in recycled 18k yellow gold.',
    in_stock: true,
  },
  {
    id: '3',
    name: 'L\'Or de Jardin Parfum',
    brand: 'EXRICX Signature',
    category: 'Fragrance',
    size: 'Standard',
    price: 245,
    is_negotiable: false,
    images: [
      '/images/exricx/luxury_perfume_detail_1769449375639.png',
      '/images/exricx/luxury_beauty_hero_v2_1769449281975.png'
    ],
    description: 'A scent born in the lab, inspired by nature. Notes of jasmine, golden amber, and tech-distilled cedar.',
    in_stock: true,
  },
  {
    id: '4',
    name: 'EXRICX Pearl Droplets',
    brand: 'Artisan Gold',
    category: 'Earrings',
    size: 'Standard',
    price: 850,
    promo_price: 720,
    is_negotiable: false,
    images: [
      '/images/exricx/luxury_earrings_pearl_1769449548067.png',
      '/images/exricx/luxury_lifestyle_jewelry_1769449345647.png'
    ],
    description: 'Lustrous south sea pearls suspended from intricate 14k white gold loops with micro-diamond accents.',
    in_stock: true,
  },
  {
    id: '5',
    name: 'EXRICX NOIR Signature',
    brand: 'Noir Collection',
    category: 'Fragrance',
    size: 'Standard',
    price: 320,
    is_negotiable: false,
    images: [
      '/images/exricx/luxury_beauty_hero_v2_1769449281975.png',
      '/images/exricx/luxury_perfume_detail_1769449375639.png'
    ],
    description: 'The ultimate expression of tech-luxury. A deep, mysterious fragrance for the modern woman.',
    in_stock: true,
  },
]

export default function ShopSection() {
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [selectedPrice, setSelectedPrice] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [showFilters, setShowFilters] = useState(false)

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    let result = mockProducts

    // Collection Filter
    if (selectedBrand !== 'All') result = result.filter(p => p.brand === selectedBrand)

    // Category Filter
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory)

    // Size Filter
    if (selectedSize !== 'All') result = result.filter(p => p.size === selectedSize)

    // Price Filter
    if (selectedPrice !== 'All') {
      result = result.filter(p => {
        const price = p.promo_price || p.price
        if (selectedPrice === 'Under $200') return price < 200
        if (selectedPrice === '$200 - $1,000') return price >= 200 && price <= 1000
        if (selectedPrice === '$1,000 - $5,000') return price > 1000 && price <= 5000
        if (selectedPrice === 'Above $5,000') return price > 5000
        return true
      })
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(result)
  }, [selectedBrand, selectedCategory, selectedSize, selectedPrice, searchQuery])

  const clearFilters = () => {
    setSelectedBrand('All')
    setSelectedCategory('All')
    setSelectedSize('All')
    setSelectedPrice('All')
    setSearchQuery('')
  }

  const isFiltered = selectedBrand !== 'All' || selectedCategory !== 'All' || selectedSize !== 'All' || selectedPrice !== 'All' || searchQuery !== ''

  return (
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-white selection:bg-secondary min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Elite Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16 sm:mb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-block text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-4 sm:mb-6"
            >
              The Exricx Collection
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-primary tracking-[-0.04em] leading-[0.9] font-display"
            >
              Precision <br />
              <span className="text-accent font-display">In every Detail.</span>
            </motion.h3>
          </div>

          {/* Elite Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md relative group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search the vault..."
              className="w-full pl-14 pr-6 py-4 sm:py-5 bg-secondary/30 border border-transparent rounded-none focus:ring-0 focus:bg-white focus:border-accent/20 transition-all text-sm font-bold text-primary placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Elite Filters Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="space-y-6 sm:space-y-8 mb-12 sm:mb-20"
        >
          <div className="flex items-center justify-between border-b border-primary/10 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-6 py-3 rounded-none transition-all font-black text-[10px] uppercase tracking-widest
                  ${showFilters ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-secondary/50 border border-primary/10'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Close Vault' : 'Refine View'}
              </button>

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-800 hover:text-red-900 transition-colors px-4"
                >
                  <X className="w-4 h-4" /> Reset
                </button>
              )}
            </div>

            <p className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Available: {filteredProducts.length} Pieces
            </p>
          </div>

          {/* Expanded Filter UI */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-8 pb-8"
              >
                {/* Brand Filter */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Tag className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Collection</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {THE_COLLECTION.map((brand: string) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-4 sm:px-6 py-2 rounded-none text-[9px] font-black tracking-widest uppercase transition-all
                          ${selectedBrand === brand
                            ? 'bg-accent text-white'
                            : 'bg-white text-slate-400 hover:bg-secondary/30 border border-slate-100'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Essence</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-5 py-2.5 rounded-none text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedCategory === cat
                              ? 'bg-primary text-white'
                              : 'bg-white text-slate-400 hover:bg-secondary/30 border border-slate-100'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Ruler className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sizing</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2.5 rounded-none text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedSize === size
                              ? 'bg-primary text-white'
                              : 'bg-white text-slate-400 hover:bg-secondary/30 border border-slate-100'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Investment</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => setSelectedPrice(range)}
                          className={`px-5 py-2.5 rounded-none text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedPrice === range
                              ? 'bg-primary text-white'
                              : 'bg-white text-slate-400 hover:bg-secondary/30 border border-slate-100'}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-16">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 sm:py-32 text-center"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary/50 rounded-none flex items-center justify-center text-slate-200 mx-auto mb-6 sm:mb-8">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-primary mb-2">The Vault is Empty</h3>
            <p className="text-slate-400 font-medium">Try adjusting your filters to find your essence.</p>
            <button
              onClick={clearFilters}
              className="mt-6 sm:mt-8 text-accent font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
            >
              Reset Filters &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/5] bg-secondary/10 overflow-hidden mb-8 cursor-pointer rounded-none border border-primary/5 group-hover:border-accent/20 transition-all duration-700">
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-[2s] ease-out 
            ${isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
            sizes="(max-width: 768px) 100vw, 25vw"
          />

          {/* Secondary Image - Reveal on Hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-[1.5s] ease-out
              ${isHovered ? 'scale-105 opacity-100' : 'scale-125 opacity-0'}`}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}

          {/* Glassmorphic Brand Tag */}
          <div className="absolute top-6 left-6 z-10">
            <span className="glass-light px-4 py-2 rounded-none text-[8px] font-black text-primary uppercase tracking-[0.3em] font-sans">
              {product.brand}
            </span>
          </div>

          {/* Quick Add Overlay */}
          <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-700 flex items-end justify-center p-8
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="w-full bg-primary text-white py-4 rounded-none tracking-[0.4em] uppercase text-[9px] font-black hover:bg-accent transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-2xl">
              Add to Vault
            </button>
          </div>
        </div>

        <div className="space-y-4 px-2 text-center lg:text-left">
          <p className="text-[9px] font-black text-accent uppercase tracking-[0.4em]">
            {product.category}
          </p>
          <h4 className="text-xl font-bold text-primary tracking-tight group-hover:text-accent transition-colors duration-500 h-14 overflow-hidden leading-tight font-display">
            {product.name}
          </h4>
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <span className="text-2xl font-light text-primary tabular-nums">${product.price.toLocaleString()}</span>
            {product.promo_price && (
              <span className="text-xs text-text-muted line-through font-light tabular-nums">${product.promo_price.toLocaleString()}</span>
            )}
          </div>

          {/* Reveal Link */}
          <div className="overflow-hidden pt-2 border-t border-primary/5">
            <motion.div
              animate={{ x: isHovered ? 10 : 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-[9px] font-black text-accent tracking-[0.5em] uppercase cursor-pointer justify-center lg:justify-start"
            >
              Reveal Essence <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
