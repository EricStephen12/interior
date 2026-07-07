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

export default function ShopSection({ 
  initialProducts = [],
  brands = ['All'],
  categories = ['All']
}: { 
  initialProducts?: any[],
  brands?: string[],
  categories?: string[]
}) {
  const SIZES = ['All', 'Standard', 'Custom']
  const PRICE_RANGES = ['All', 'Under ₦50,000', '₦50,000 - ₦200,000', '₦200,000 - ₦500,000', 'Above ₦500,000']
  const normalizedProducts = useMemo(() => initialProducts.map(p => {
    let productImages: string[] = []
    if (Array.isArray(p.images)) {
      productImages = p.images
    } else if (typeof p.images === 'string') {
      try {
        productImages = JSON.parse(p.images)
      } catch {
        productImages = []
      }
    }

    if (productImages.length === 0 && p.imageUrl) {
      productImages = [p.imageUrl]
    }

    if (productImages.length === 0) {
      productImages = ['/images/shop-fallback.jpg']
    }

    return {
      id: p.id,
      name: p.name,
      brand: p.brand?.name || 'Sharers Elite',
      category: p.categories?.[0]?.category?.name || 'Training',
      size: p.size?.label || 'Standard',
      price: Number(p.price) || 0,
      promo_price: p.promoPrice ? Number(p.promoPrice) : undefined,
      images: productImages,
      description: p.description || '',
      in_stock: p.isActive ?? true,
    }
  }), [initialProducts])

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
        if (selectedPrice === 'Under ₦50,000') return price < 50000
        if (selectedPrice === '₦50,000 - ₦200,000') return price >= 50000 && price <= 200000
        if (selectedPrice === '₦200,000 - ₦500,000') return price > 200000 && price <= 500000
        if (selectedPrice === 'Above ₦500,000') return price > 500000
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
              The Good <br />
              <span className="text-accent font-display">Stuff.</span>
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
                      {brands.map((brand) => (
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
                      <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
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
                      <span className="text-[10px] font-black uppercase tracking-widest">Price</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-20">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, idx) => (
                <div key={product.id}>
                  <ProductCard product={product} index={idx} />
                </div>
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
            <h3 className="text-xl sm:text-2xl font-black text-primary mb-2">Nothing here yet</h3>
            <p className="text-slate-400 font-medium">Try changing your filters or search for something else.</p>
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
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

function ProductCard({ product, index }: { product: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { subscribe } = useMembership()
  const { addToCart, toggleCart } = useCart()
  const { showToast } = useToast()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const router = useRouter()
  const wishlisted = isWishlisted(product.id)
  
  const [avgRating, setAvgRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then(res => res.json())
      .then(data => {
        setAvgRating(data.avgRating || 0)
        setReviewCount(data.total || 0)
      })
      .catch(() => {})
  }, [product.id])

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.category === 'Memberships') {
      subscribe(30)
      router.push('/dashboard')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Pass structured data matching what CartDrawer expects
    const productData = { id: product.id, name: product.name, images: product.images }
    const variantData = { 
      id: product.id, 
      price: product.price, 
      promo_price: product.promo_price, 
      size: { name: product.size } 
    }
    
    addToCart(productData as any, variantData as any, 1)
    showToast('Added to Cart', 'success', product.name)
    toggleCart() // Open drawer immediately
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
      className="group relative hover-card-tactile"
    >
      <Link 
        href={product.category === 'Memberships' ? '#' : `/products/${product.id}`} 
        className="block w-full h-full"
        onClick={(e) => {
          if (product.category === 'Memberships') {
            handleAction(e)
          } else {
            if (typeof window !== 'undefined') {
              const detailsPageSchema = {
                id: product.id,
                name: product.name,
                price: product.price,
                promoPrice: product.promo_price,
                description: product.description,
                images: product.images,
                brand: { name: product.brand },
                size: { label: product.size },
                type: product.category,
                isActive: product.in_stock
              };
              sessionStorage.setItem(`product_${product.id}`, JSON.stringify(detailsPageSchema));
            }
          }
        }}
      >
          <div className={`relative aspect-square overflow-hidden mb-4 cursor-pointer bg-[#ececec] transition-all duration-700`}>
            {/* Shimmer Placeholder */}
            {!loaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            {/* Primary Image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover mix-blend-multiply transition-transform duration-700 ease-out 
              ${isHovered ? 'scale-105' : 'scale-100'} ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setLoaded(true)}
            />

            {/* White Labels */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
              {product.promo_price && (
                <span className="bg-white px-2 py-1 text-[9px] font-bold text-gray-800 uppercase tracking-wider shadow-sm">
                  SALE
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-white px-2 py-1 text-[9px] font-bold text-gray-800 uppercase tracking-wider shadow-sm">
                  BESTSELLER
                </span>
              )}
            </div>

            {/* Wishlist Heart Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(product.id)
                showToast(
                  wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
                  wishlisted ? 'info' : 'success',
                  product.name
                )
              }}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform duration-200"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>

            {/* Hover Actions (Add to Cart) */}
            <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ease-out z-20 flex flex-col gap-2 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {product.category === 'Memberships' ? (
                <button
                  onClick={handleAction}
                  className="w-full bg-black text-white py-3 text-[10px] font-black tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg"
                >
                  JOIN NOW
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-3.5 text-xs font-black tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> ADD TO CART
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-base text-primary uppercase tracking-wide group-hover:text-accent transition-colors">
                {product.name}
              </h3>
            </div>
            
            {reviewCount > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex text-black text-xs gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(avgRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {reviewCount}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-gray-400 mt-1">
              <span>{product.brand}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span>{product.size}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="font-black text-base text-primary">
                ₦{product.promo_price ? product.promo_price.toLocaleString() : product.price.toLocaleString()}
              </span>
              {product.promo_price && (
                <span className="font-bold text-sm text-gray-300 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
  )
}
