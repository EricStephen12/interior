'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, MapPin, Search, ChevronDown } from 'lucide-react'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (res.ok) {
        setOrders(data.orders || [])
      }
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      }
    } catch (err) {
      console.error('Failed to update status', err)
    } finally {
      setUpdating(null)
    }
  }

  const filteredOrders = orders.filter(o => {
    // Only show orders that are physical (i.e. they are NOT "COMPLETED" Day Pass topups, or they have shipping details)
    // Actually, we can just show all, but mostly focus on physical. We'll show all and filter by status.
    if (filter === 'ALL') return true
    return o.status === filter
  })

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight uppercase">Order <span className="text-accent italic font-light lowercase">Fulfillment</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage customer deliveries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {['ALL', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'FAILED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-slate-400 hover:text-primary hover:bg-secondary/50 border border-primary/5'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white border border-primary/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-200">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-primary/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left: Customer & Address */}
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'DELIVERED' || order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border border-green-100' :
                        order.status === 'FAILED' ? 'bg-red-50 text-red-600 border border-red-100' :
                        order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400">{order.id}</p>
                  </div>

                  {order.shippingDetails ? (
                    <div className="bg-secondary/20 p-4 border border-primary/5">
                      <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-3">
                        <MapPin className="w-3 h-3" /> Shipping Address
                      </div>
                      <p className="text-sm font-bold text-primary mb-1">{(order.shippingDetails as any).name}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{(order.shippingDetails as any).address}</p>
                      <p className="text-xs text-slate-400 mt-2 font-mono">{(order.shippingDetails as any).phone}</p>
                      {(order.shippingDetails as any).zone && (
                        <p className="text-[9px] font-black text-accent uppercase tracking-widest mt-3 pt-3 border-t border-primary/5">
                          Zone: {(order.shippingDetails as any).zone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-secondary/20 p-4 border border-primary/5 flex items-center justify-center h-24">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Order / No Shipping Required</p>
                    </div>
                  )}
                </div>

                {/* Middle: Order Items */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Items</h3>
                  <div className="space-y-3">
                    {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0">
                        <div className="flex gap-3 items-center">
                          <span className="w-6 h-6 bg-secondary text-[10px] font-black text-primary flex items-center justify-center">
                            {item.quantity}x
                          </span>
                          <span className="text-xs font-bold text-primary truncate max-w-[200px]">{item.name || 'Product'}</span>
                        </div>
                        <span className="text-xs font-black text-accent tabular-nums">₦{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Total Paid</span>
                    <span className="text-lg font-black text-primary tabular-nums">₦{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full lg:w-48 flex flex-col gap-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Actions</h3>
                  
                  {order.status === 'PAID' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'PROCESSING')}
                      disabled={updating === order.id}
                      className="w-full px-4 py-3 bg-yellow-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {updating === order.id ? 'Updating...' : 'Mark Processing'}
                    </button>
                  )}

                  {order.status === 'PROCESSING' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'SHIPPED')}
                      disabled={updating === order.id}
                      className="w-full px-4 py-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {updating === order.id ? 'Updating...' : 'Mark Shipped'}
                    </button>
                  )}

                  {order.status === 'SHIPPED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'DELIVERED')}
                      disabled={updating === order.id}
                      className="w-full px-4 py-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {updating === order.id ? 'Updating...' : 'Mark Delivered'}
                    </button>
                  )}

                  {(order.status === 'DELIVERED' || order.status === 'PAID' || order.status === 'COMPLETED') && (
                    <div className="w-full px-4 py-3 bg-secondary text-primary/40 text-[10px] font-black uppercase tracking-widest text-center border border-primary/5">
                      Completed / Paid
                    </div>
                  )}
                  
                  {order.status === 'FAILED' && (
                    <>
                      <div className="w-full px-4 py-3 bg-red-50 text-red-400 text-[10px] font-black uppercase tracking-widest text-center border border-red-100">
                        Payment Failed
                      </div>
                      <button 
                        onClick={() => updateStatus(order.id, 'PAID')}
                        disabled={updating === order.id}
                        className="w-full px-4 py-2 bg-transparent border border-green-200 text-green-600 text-[9px] font-black uppercase tracking-widest hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        Undo (Mark Paid)
                      </button>
                    </>
                  )}

                  {order.status !== 'FAILED' && (
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order? It will be removed from your total revenue.')) {
                          updateStatus(order.id, 'FAILED')
                        }
                      }}
                      disabled={updating === order.id}
                      className="w-full px-4 py-2 bg-transparent border border-red-200 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
