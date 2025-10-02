'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EyeIcon, PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // In a real app, fetch customers from database
    const mockCustomers: Customer[] = [
      {
        id: 'CUST-001',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 3,
        totalSpent: 18500.00,
        lastOrder: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'CUST-002',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 234-5678',
        joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 5,
        totalSpent: 25200.00,
        lastOrder: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'CUST-003',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '+1 (555) 345-6789',
        joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 2,
        totalSpent: 8500.00,
        lastOrder: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'CUST-004',
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 (555) 456-7890',
        joinDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        totalOrders: 1,
        totalSpent: 3104.00,
        lastOrder: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive'
      }
    ]

    setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading customers...</p>
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
              Customers Management
            </h1>
            <p className="text-amber-700">
              Manage customer accounts and data
            </p>
          </div>

          {/* Search */}
          <div className="w-80">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            />
          </div>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200">
                {filteredCustomers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-amber-25"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-amber-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-amber-600">
                          Joined {new Date(customer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-amber-700">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-amber-700">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                      {customer.totalOrders} orders
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-900 p-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-amber-600 hover:text-amber-900 p-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-amber-700 text-lg">No customers found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

