'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Product } from '@/lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // In a real app, fetch products from database
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Villa Cherie Caramel beige sofa set - Michael Amini',
        price: 12098.00,
        originalPrice: 16131.00,
        description: 'Luxury caramel beige sofa set with premium design and sophisticated styling.',
        category: 'Sofas',
        images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
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
        description: 'Elegant 3-seater sofa with sophisticated design and premium craftsmanship.',
        category: 'Sofas',
        images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
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
        description: 'Stylish accent chair with premium upholstery and elegant design.',
        category: 'Chairs',
        images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
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
        description: 'Modern curved sectional sofa with contemporary style and modular design.',
        category: 'Sofas',
        images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
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

    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
              Products Management
            </h1>
            <p className="text-amber-700">
              Manage your furniture inventory
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </motion.button>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={product.images[0] || "/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl font-bold text-amber-600">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-amber-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-amber-700 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="text-xs text-amber-600 mb-4">
                  Code: {product.productCode}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-amber-700 text-lg">No products found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

