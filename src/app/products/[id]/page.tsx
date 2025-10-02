'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Product } from '@/lib/supabase'

// Mock product data - in a real app, this would fetch from database based on ID
const getMockProduct = (id: string): Product => {
  const products: Record<string, Product> = {
    '1': {
      id: '1',
      name: 'Villa Cherie Caramel beige sofa set - Michael Amini',
      price: 12098.00,
      originalPrice: 16131.00,
      description: 'Luxury caramel beige sofa set with premium design and sophisticated styling. Features deep seating, plush cushions, and elegant caramel beige upholstery that brings warmth and luxury to any living space.',
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
    '2': {
      id: '2',
      name: 'London place 3-seater sofa - Michael Amini',
      price: 3104.00,
      originalPrice: 4139.00,
      description: 'Elegant 3-seater sofa with sophisticated design and premium craftsmanship. Perfect for modern living rooms seeking both comfort and style.',
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
    '3': {
      id: '3',
      name: 'London place chair - Michael Amini',
      price: 1489.00,
      originalPrice: 1985.00,
      description: 'Stylish accent chair with premium upholstery and elegant design. Perfect for adding sophisticated seating to any room.',
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
    '4': {
      id: '4',
      name: 'Etro curved sectional sofa',
      price: 4444.00,
      originalPrice: 5925.00,
      description: 'Modern curved sectional sofa with contemporary style and modular design. Perfect for large living spaces and entertainment areas.',
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
  }
  return products[id] || products['1']
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    // Load product data based on ID
    const loadProduct = async () => {
      const resolvedParams = await params
      const loadedProduct = getMockProduct(resolvedParams.id)
      setProduct(loadedProduct)
    }
    loadProduct()
  }, [params])

  const addToCart = () => {
    // TODO: Implement cart functionality
    console.log('Added to cart:', product, quantity)
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  // Show loading state while product is loading
  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading product details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden relative">
              {product && (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {product && product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-2 ring-amber-800' : 'ring-1 ring-amber-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-amber-600">
              <span>Home</span> / <span>Products</span> / <span>{product?.category || 'Loading...'}</span> / <span className="text-amber-800">{product?.name || 'Loading...'}</span>
            </nav>

            {/* Product Title */}
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-serif font-bold text-amber-900"
            >
              {product?.name || 'Loading...'}
            </motion.h1>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              {product && (
                <>
                  <span className="text-3xl font-bold text-amber-600">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-amber-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-amber-700">(4.8) • 124 reviews</span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-amber-800 leading-relaxed"
            >
              {product?.description || 'Loading product details...'}
            </motion.p>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {product && (
                    <>
                      <div>
                        <span className="text-amber-600 font-medium">Weight:</span>
                        <span className="ml-2 text-amber-800">{product.specifications.weight}</span>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Length:</span>
                        <span className="ml-2 text-amber-800">{product.specifications.length}</span>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Width:</span>
                        <span className="ml-2 text-amber-800">{product.specifications.width}</span>
                      </div>
                      <div>
                        <span className="text-amber-600 font-medium">Depth:</span>
                        <span className="ml-2 text-amber-800">{product.specifications.depth}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quantity and Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-amber-800 font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToCart}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleWishlist}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-amber-300 text-amber-600 hover:border-amber-400'
                  }`}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </motion.button>
              </div>

              {/* Callback Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-secondary"
              >
                Request a callback
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
