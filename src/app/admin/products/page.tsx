'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Eye, Package } from 'lucide-react'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products/list')
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete.')
    }
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase font-display">
            The <span className="text-accent italic font-light lowercase">Inventory.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Manage your collection.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/attributes"
            className="flex items-center justify-center gap-3 bg-secondary text-primary px-6 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/5 shadow-sm"
          >
            Manage Attributes
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-3 bg-primary text-white px-6 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> New Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-primary/5 bg-secondary/10">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Product</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Brand</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Price</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Status</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium text-sm">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium text-sm">No products yet. Add your first piece.</td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary relative overflow-hidden flex-shrink-0">
                        {(Array.isArray(product.images) && product.images.length > 0) ? (
                          <Image src={product.images[0]} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-primary group-hover:text-accent transition-colors truncate">{product.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">{product.type || 'Standard'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10 px-2 sm:px-3 py-1 bg-white">
                      {product.brand?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-primary tabular-nums">₦{product.price?.toLocaleString()}</span>
                      {product.promoPrice && (
                        <span className="text-[9px] text-accent font-bold tabular-nums">₦{product.promoPrice.toLocaleString()} promo</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <span className={`text-[9px] font-black px-2 sm:px-3 py-1 uppercase tracking-widest ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex justify-end gap-2 sm:gap-3">
                      <Link href={`/products/${product.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
