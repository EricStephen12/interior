'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'

// Mock data for demonstration - matching the exact products from the image
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Villa Cherie Caramel beige sofa set - Michael Amini',
    price: 12098.00,
    originalPrice: 16131.00,
    description: 'Luxury caramel beige sofa set with premium design.',
    category: 'Sofas',
    images: ['/images/Velvet 4-Piece Sectional, Gray Modular Sofa with Ottoman for Large Living Room (145_7_)｜Homary.jpeg'],
    specifications: {
      weight: '416 kg',
      length: '598 cm',
      width: '386 cm',
      depth: '254 cm',
      volume: '8.67472'
    },
    productCode: '01A1C000106',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'London place 3-seater sofa - Michael Amini',
    price: 3104.00,
    originalPrice: 4139.00,
    description: 'Elegant 3-seater sofa with sophisticated design.',
    category: 'Sofas',
    images: ['/images/2230mm Modern White Velvet 3-Seater Sofa Channel Tufted Upholstered Luxury Solid Wood｜Homary.jpeg'],
    specifications: {
      weight: '75 kg',
      length: '262 cm',
      width: '107 cm',
      depth: '109 cm',
      volume: '3.055706'
    },
    productCode: '01A1C00099',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'London place chair - Michael Amini',
    price: 1489.00,
    originalPrice: 1985.00,
    description: 'Stylish accent chair with premium upholstery.',
    category: 'Chairs',
    images: ['/images/2 - Piece Classic Teddy Tufted Upholstered Living Room Set With Pocket green.jpeg'],
    specifications: {
      weight: '25 kg',
      length: '158 cm',
      width: '107 cm',
      depth: '80 cm',
      volume: '1.35248'
    },
    productCode: '02A1C00057',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Etro curved sectional sofa',
    price: 4444.00,
    originalPrice: 5925.00,
    description: 'Modern curved sectional sofa with contemporary style.',
    category: 'Sofas',
    images: ['/images/Timber Olio Green Sofa.jpeg'],
    specifications: {
      weight: '165 kg',
      length: '690 cm',
      width: '530 cm',
      depth: '375 cm',
      volume: '5.49'
    },
    productCode: '01AREA0001',
    in_stock: true,
    created_at: new Date().toISOString()
  }
]

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [wishlist, setWishlist] = useState<string[]>([])
  const { addToCart: addToCartContext } = useCart()

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const categories = ['All', 'Sofas', 'Tables', 'Chairs', 'Storage']

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for 'featured'
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy])

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product: Product) => {
    addToCartContext(product, 1)
  }

  return (
    <section ref={ref} className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
            SHOP PRODUCTS
          </h2>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4"
        >
          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <span className="text-amber-900 font-medium">CATEGORY</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-amber-200 bg-white text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-amber-900 font-medium">ALL ITEMS</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-amber-200 bg-white text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="featured">SORT BY FEATURED</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 rounded-lg shadow-lg overflow-hidden group"
            >
                   {/* Product Image */}
                   <div className="aspect-[5/4] relative overflow-hidden">
                     <img
                       src={product.images[0] || "/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"}
                       alt={product.name}
                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     />

                     {/* Image Carousel Dots */}
                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                       <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                       <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                       <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                     </div>

                     {/* Shopping Bag Icon */}
                     <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                       <ShoppingCartIcon className="h-5 w-5 text-amber-800" />
                     </button>
                   </div>

              {/* Product Info */}
              <div className="p-8">
                {/* Product Name */}
                <h3 className="text-lg font-serif font-semibold text-amber-900 mb-3">
                  {product.name}
                </h3>

                {/* Pricing with Discount */}
                <div className="flex items-center space-x-3 mb-6">
                  <p className="text-2xl font-bold text-amber-800">
                    USD {product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg text-amber-500 line-through">
                      USD {product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-black">
                  <div>
                    <span className="font-medium">Weight:</span> {product.specifications.weight}
                  </div>
                  <div>
                    <span className="font-medium">Length:</span> {product.specifications.length}
                  </div>
                  <div>
                    <span className="font-medium">Depth:</span> {product.specifications.depth}
                  </div>
                  <div>
                    <span className="font-medium">Width:</span> {product.specifications.width}
                  </div>
                  <div>
                    <span className="font-medium">Volume:</span> {product.specifications.volume}
                  </div>
                  <div className="text-xs text-black font-medium">
                    {product.productCode}
                  </div>
                </div>

                {/* Browse Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = `/products/${product.id}`}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg text-sm"
                >
                  BROWSE
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
