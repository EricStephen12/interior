'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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

const THE_COLLECTION = ['All', 'Sharers Elite', 'Performance Lab', 'Apparel Core', 'Boutique']
const CATEGORIES = ['All', 'Training', 'Recovery', 'Apparel', 'Nutrition']
const SIZES = ['All', 'Standard', 'Custom']
const PRICE_RANGES = ['All', 'Under ₦50,000', '₦50,000 - ₦200,000', '₦200,000 - ₦500,000', 'Above ₦500,000']

export default function ShopSection({ initialProducts = [] }: { initialProducts?: any[] }) {
  const normalizedProducts = useMemo(() => initialProducts.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand?.name || 'Sharers Elite',
    category: p.categories?.[0]?.category?.name || 'Training',
    size: p.size?.name || 'Standard',
    price: Number(p.price) || 0,
    promo_price: p.promoPrice ? Number(p.promoPrice) : undefined,
    images: p.imageUrl ? [p.imageUrl] : ['https://images.unsplash.com/photo-1581009146145-b5ef03a74e7f?auto=format&fit=crop&w=800&q=80'],
    description: p.description || '',
    in_stock: p.inStock ?? true,
  })), [initialProducts])
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [selectedPrice, setSelectedPrice] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(normalizedProducts)
  const [showFilters, setShowFilters] = useState(false)

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    let result = normalizedProducts

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
              The Arsenal
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-primary tracking-[-0.04em] leading-[0.9] font-display"
            >
              Precision in <br />
              <span className="text-accent font-display">Every Detail.</span>
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="max-w-md mt-6"
            >
              <p className="text-sm text-text-muted font-bold leading-relaxed">
                Nothing here ended up on the shelf by accident. Every product, every session, every membership is chosen because it works. Because the people here deserve that.
              </p>
            </motion.div>
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
              placeholder="Search products..."
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
                {showFilters ? 'Close' : 'Filters'}
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
        {/* Product Grid - Dynamic Editorial Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-16 sm:gap-y-32">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, idx) => {
              // Create an editorial rhythm: 1 large, 2 small, 1 medium
              const isLarge = idx % 4 === 0;
              const isMedium = idx % 4 === 3;
              const colSpan = isLarge ? 'lg:col-span-7' : isMedium ? 'lg:col-span-5' : 'lg:col-span-4';
              const mt = idx % 2 === 1 ? 'lg:mt-32' : 'lg:mt-0'; // Staggered vertical rhythm

              return (
                <div key={product.id} className={`${colSpan} ${mt}`}>
                  <ProductCard product={product} index={idx} isLarge={isLarge} />
                </div>
              );
            })}
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

import { useMembership } from '@/lib/membership-context'
import { useRouter } from 'next/navigation'

function ProductCard({ product, index, isLarge }: { product: any, index: number, isLarge?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const { subscribe } = useMembership()
  const router = useRouter()

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.category === 'Memberships') {
      subscribe(30)
      router.push('/dashboard')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={product.category === 'Memberships' ? '#' : `/products/${product.id}`} onClick={product.category === 'Memberships' ? handleAction : undefined}>
        <div className={`relative ${isLarge ? 'aspect-[16/10]' : 'aspect-[4/5]'} overflow-hidden mb-10 cursor-pointer bg-secondary/50 shadow-sm transition-all duration-700`}>
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-[1.5s] ease-out 
            ${isHovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Glass Overlay Tag - Editorial Signature */}
          <div className="absolute top-8 left-8 z-10 flex flex-col gap-2">
            <span className="glass-light px-6 py-2 rounded-none text-[8px] font-black text-primary uppercase tracking-[0.4em] font-sans">
              {product.brand}
            </span>
          </div>

          {/* Quick Reveal Overlay */}
          <div className={`absolute inset-0 bg-primary/20 backdrop-blur-[2px] transition-opacity duration-700 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-40 w-[1px] bg-white opacity-50 absolute"></div>
            <button
              onClick={handleAction}
              className="bg-white text-primary px-8 py-4 rounded-none tracking-[0.4em] uppercase text-[9px] font-black hover:bg-accent hover:text-white transition-all duration-500 transform scale-95 group-hover:scale-100 shadow-2xl z-10"
            >
              {product.category === 'Memberships' ? 'JOIN NOW' : 'VIEW MORE'}
            </button>
          </div>

          {/* Subtle Grain Overlay */}
          <div className="absolute inset-0 grain-overlay pointer-events-none opacity-10"></div>
        </div>

        <div className="space-y-6 px-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-accent opacity-30"></div>
            <p className="text-[9px] font-black text-accent uppercase tracking-[0.5em]">
              {product.category}
            </p>
          </div>

          <h4 className={`text-luxury ${isLarge ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'} text-primary tracking-tight group-hover:text-accent transition-colors duration-500 leading-tight`}>
            {product.name}
          </h4>

          <div className="flex items-baseline gap-6">
            <span className="text-3xl font-light text-primary tabular-nums">₦{product.price.toLocaleString()}</span>
            {product.promo_price && (
              <span className="text-sm text-text-muted line-through font-light tabular-nums">₦{product.promo_price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
