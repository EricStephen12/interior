'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brandId: '',
    sizeId: '',
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Using a mock timeout to simulate creation
    await new Promise(r => setTimeout(r, 1000))
    
    // In a real flow, this would call createProduct() via Server Action
    router.push('/admin/products')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-secondary text-primary hover:bg-accent hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            New <span className="text-accent italic font-light lowercase">Item.</span>
          </h1>
          <p className="text-slate-500 font-medium">Add a piece to the armory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-light p-8 space-y-8 shadow-sm border border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-bold text-2xl text-primary" 
                placeholder="e.g. Obsidian Rack"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm text-slate-500" 
                placeholder="obsidian-rack"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₦)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors tabular-nums text-lg text-primary" 
                placeholder="150000"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand ID</label>
              <input 
                required
                type="text" 
                value={formData.brandId}
                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm" 
                placeholder="uuid..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Size ID</label>
              <input 
                required
                type="text" 
                value={formData.sizeId}
                onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm" 
                placeholder="uuid..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl disabled:opacity-50"
          >
            <Package className="w-4 h-4" /> 
            {isSubmitting ? 'FORGING...' : 'CREATE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  )
}
