'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/supabase'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])

  return (
    <div className="pt-16 min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif font-bold text-amber-900 mb-6">
            Admin Dashboard
          </h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            Manage your furniture inventory, orders, and customer data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Products Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-4">
              Products
            </h2>
            <p className="text-amber-700 mb-6">
              Add, edit, and manage your furniture inventory
            </p>
            <button
              onClick={() => window.location.href = '/admin/products'}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg"
            >
              Manage Products
            </button>
          </motion.div>

          {/* Orders Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-4">
              Orders
            </h2>
            <p className="text-amber-700 mb-6">
              View and process customer orders
            </p>
            <button
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg"
            >
              Manage Orders
            </button>
          </motion.div>

          {/* Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-4">
              Customers
            </h2>
            <p className="text-amber-700 mb-6">
              Manage customer accounts and data
            </p>
            <button
              onClick={() => window.location.href = '/admin/customers'}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg"
            >
              Manage Customers
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
