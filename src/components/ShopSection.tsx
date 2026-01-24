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

const BRANDS = ['All', 'Vitafoam', 'Mouka', 'Sara Foam', 'Royal Foam', 'Green Earth', 'Uni Foam', 'Hara Foam']
const CATEGORIES = ['All', 'Mattresses', 'Pillows', 'Beddings', 'Furniture']
const SIZES = ['All', 'Single', 'Double', 'Family', 'King']
const PRICE_RANGES = ['All', 'Under 50k', '50k - 200k', '200k - 500k', 'Above 500k']

const mockProducts = [
  {
    id: '1',
    name: 'Vitafoam Grandeur Mattress',
    brand: 'Vitafoam',
    category: 'Mattresses',
    size: 'King',
    price: 185000,
    promo_price: 165000,
    is_negotiable: true,
    images: [
      '/images/Modern Luxury Home Furniture Bedroom Bed Set Queen King Size Headboard Stainless Steel Base Bed.jpeg',
      '/images/Marshmallow Bed Frame.jpeg'
    ],
    description: 'Ultra-premium memory foam mattress for maximum comfort.',
    in_stock: true,
  },
  {
    id: '2',
    name: 'Mouka Flora Mattress',
    brand: 'Mouka',
    category: 'Mattresses',
    size: 'Double',
    price: 95000,
    is_negotiable: false,
    images: [
      '/images/Marshmallow Bed Frame.jpeg',
      '/images/Modern Luxury Home Furniture Bedroom Bed Set Queen King Size Headboard Stainless Steel Base Bed.jpeg'
    ],
    description: 'Classic comfort with Mouka durability.',
    in_stock: true,
  },
  {
    id: '3',
    name: 'Royal Foam Executive Pillow',
    brand: 'Royal Foam',
    category: 'Pillows',
    size: 'Single',
    price: 12500,
    is_negotiable: false,
    images: [
      '/images/Modern Throw Pillow & Decorative Accent Pillows for Sofas, Chairs & Beds _ CB2.jpeg',
      '/images/Decorative Pillow Covers, White Geometric, Cotton, Set Of 6, 18x18 _ Color_ White _ Size_ Os.jpeg'
    ],
    description: 'Soft and supportive pillow for a restful sleep.',
    in_stock: true,
  },
  {
    id: '4',
    name: 'Luxury Cotton Bedding Set',
    brand: 'Sara Foam',
    category: 'Beddings',
    size: 'Family',
    price: 45000,
    promo_price: 38000,
    is_negotiable: true,
    images: [
      '/images/Decorative Pillow Covers, White Geometric, Cotton, Set Of 6, 18x18 _ Color_ White _ Size_ Os.jpeg',
      '/images/Modern Throw Pillow & Decorative Accent Pillows for Sofas, Chairs & Beds _ CB2.jpeg'
    ],
    description: 'Premium quality cotton sheets.',
    in_stock: true,
  },
  {
    id: '5',
    name: 'Uni Foam Supreme',
    brand: 'Uni Foam',
    category: 'Mattresses',
    size: 'King',
    price: 650000,
    is_negotiable: true,
    images: [
      '/images/Marshmallow Bed Frame.jpeg',
      '/images/Modern Luxury Home Furniture Bedroom Bed Set Queen King Size Headboard Stainless Steel Base Bed.jpeg'
    ],
    description: 'The pinnacle of sleeping luxury.',
    in_stock: true,
  },
  {
    id: '6',
    name: 'Green Earth Eco-Pillow',
    brand: 'Green Earth',
    category: 'Pillows',
    size: 'Double',
    price: 18000,
    is_negotiable: false,
    images: [
      '/images/Modern Throw Pillow & Decorative Accent Pillows for Sofas, Chairs & Beds _ CB2.jpeg',
      '/images/Decorative Pillow Covers, White Geometric, Cotton, Set Of 6, 18x18 _ Color_ White _ Size_ Os.jpeg'
    ],
    description: 'Sustainable comfort for your neck.',
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

    // Brand Filter
    if (selectedBrand !== 'All') result = result.filter(p => p.brand === selectedBrand)

    // Category Filter
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory)

    // Size Filter
    if (selectedSize !== 'All') result = result.filter(p => p.size === selectedSize)

    // Price Filter
    if (selectedPrice !== 'All') {
      result = result.filter(p => {
        const price = p.promo_price || p.price
        if (selectedPrice === 'Under 50k') return price < 50000
        if (selectedPrice === '50k - 200k') return price >= 50000 && price <= 200000
        if (selectedPrice === '200k - 500k') return price > 200000 && price <= 500000
        if (selectedPrice === 'Above 500k') return price > 500000
        return true
      })
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-white selection:bg-sky-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Elite Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16 sm:mb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="inline-block text-[10px] font-black tracking-[0.4em] text-sky-600 uppercase mb-4 sm:mb-6"
            >
              Curated Collections
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-blue-950 tracking-[-0.04em] leading-[0.9] font-display"
            >
              The Art of <br />
              <span className="text-sky-600 font-display">Modern Living.</span>
            </motion.h3>
          </div>

          {/* Elite Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md relative group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by brand or design..."
              className="w-full pl-14 pr-6 py-4 sm:py-5 bg-slate-50 border border-transparent rounded-2xl focus:ring-0 focus:bg-white focus:border-sky-100 transition-all text-sm font-bold text-blue-950 placeholder:text-slate-300 shadow-inner"
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest
                  ${showFilters ? 'bg-blue-950 text-white' : 'bg-slate-50 text-blue-950 hover:bg-slate-100'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Refine Search'}
              </button>

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors px-4"
                >
                  <X className="w-4 h-4" /> Reset Filters
                </button>
              )}
            </div>

            <p className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Showing {filteredProducts.length} Results
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Select Brand</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-4 sm:px-6 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                          ${selectedBrand === brand
                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
                      <span className="text-[10px] font-black uppercase tracking-widest">Product Type</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedCategory === cat
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Sizing</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedSize === size
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
                      <span className="text-[10px] font-black uppercase tracking-widest">Price Range</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => setSelectedPrice(range)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedPrice === range
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 sm:mb-8">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950 mb-2">No Matches Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your filters or search criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-6 sm:mt-8 text-sky-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-950 transition-colors"
            >
              Exterminate All Filters &rarr;
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
        <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden mb-6 cursor-pointer rounded-2xl sm:rounded-none">
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-[1.5s] ease-out 
            ${isHovered ? 'scale-110 blur-[2px] opacity-0' : 'scale-100 opacity-100'}`}
            sizes="(max-width: 768px) 100vw, 25vw"
          />

          {/* Secondary Image - Reveal on Hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-[1s] ease-out
              ${isHovered ? 'scale-105 opacity-100' : 'scale-125 opacity-0'}`}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}

          {/* Glassmorphic Brand Tag */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
            <span className="glass px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black text-blue-950 uppercase tracking-[0.2em] font-sans">
              {product.brand}
            </span>
          </div>

          {/* Promo Price Badge */}
          {product.promo_price && (
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
              <span className="bg-blue-950 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl font-sans">
                Limited
              </span>
            </div>
          )}

          {/* Quick Add Overlay */}
          <div className={`absolute inset-0 bg-blue-950/20 transition-opacity duration-500 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="bg-white text-blue-950 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 scale-0 group-hover:scale-100 hover:bg-sky-600 hover:text-white">
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 px-1 text-center lg:text-left">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] font-inter">
            {product.category}
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-blue-950 tracking-tight group-hover:text-sky-600 transition-colors duration-300 h-12 sm:h-14 overflow-hidden leading-tight font-display">
            {product.name}
          </h4>
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <span className="text-lg sm:text-xl font-black text-blue-950">₦{product.price.toLocaleString()}</span>
            {product.promo_price && (
              <span className="text-[10px] sm:text-xs text-slate-300 line-through font-bold">₦{product.promo_price.toLocaleString()}</span>
            )}
          </div>

          {/* Reveal Link */}
          <div className="overflow-hidden pt-1">
            <motion.div
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-sky-600 tracking-widest uppercase cursor-pointer justify-center lg:justify-start font-sans"
            >
              View Essence <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
