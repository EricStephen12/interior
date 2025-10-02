'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EyeIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: Array<{
    product: {
      id: string
      name: string
      price: number
      image: string
    }
    quantity: number
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    // In a real app, fetch orders from database
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        items: [
          {
            product: {
              id: '1',
              name: 'Villa Cherie Sofa',
              price: 12098.00,
              image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'
            },
            quantity: 1
          }
        ],
        total: 12098.00,
        status: 'processing',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: '123 Main St, New York, NY 10001'
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        items: [
          {
            product: {
              id: '2',
              name: 'London Place Sofa',
              price: 3104.00,
              image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'
            },
            quantity: 1
          },
          {
            product: {
              id: '3',
              name: 'London Place Chair',
              price: 1489.00,
              image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'
            },
            quantity: 2
          }
        ],
        total: 6082.00,
        status: 'shipped',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike@example.com',
        items: [
          {
            product: {
              id: '4',
              name: 'Etro Sectional',
              price: 4444.00,
              image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'
            },
            quantity: 1
          }
        ],
        total: 4444.00,
        status: 'delivered',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: '789 Pine St, Chicago, IL 60601'
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus)

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading orders...</p>
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
              Orders Management
            </h1>
            <p className="text-amber-700">
              View and manage customer orders
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-amber-700 text-white'
                    : 'bg-white text-amber-700 hover:bg-amber-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-amber-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-xl font-bold text-amber-600">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Customer Information</h4>
                    <div className="text-sm text-amber-700 space-y-1">
                      <p><span className="font-medium">Name:</span> {order.customerName}</p>
                      <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-amber-700">{order.shippingAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-amber-900 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-amber-900">{item.product.name}</h5>
                          <p className="text-sm text-amber-700">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-900">${item.product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="h-5 w-5" />
                    <span>View Details</span>
                  </motion.button>

                  {order.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Mark Processing</span>
                    </motion.button>
                  )}

                  {order.status === 'processing' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <TruckIcon className="h-5 w-5" />
                      <span>Mark Shipped</span>
                    </motion.button>
                  )}

                  {order.status === 'shipped' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      <span>Mark Delivered</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    <span>Cancel Order</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-amber-700 text-lg">No orders found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

