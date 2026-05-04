'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brandId: '',
    sizeId: '',
    price: '',
    promoPrice: '',
    type: '',
    imageUrl: '',
  })

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
    fetch('/api/sizes').then(r => r.json()).then(d => setSizes(d.sizes || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to create product. Check all fields.')
      }
    } catch (err) {
      alert('Network error. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-secondary text-primary hover:bg-accent hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase font-display">
            New <span className="text-accent italic font-light lowercase">Item.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Add a piece to the armory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 sm:p-8 space-y-8 shadow-sm border border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-bold text-lg sm:text-2xl text-primary placeholder:text-slate-300" 
                placeholder="e.g. Obsidian Rack"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm text-slate-500 placeholder:text-slate-300" 
                placeholder="obsidian-rack"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₦)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors tabular-nums text-lg text-primary placeholder:text-slate-300" 
                placeholder="150000"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Price (optional)</label>
              <input 
                type="number" 
                value={formData.promoPrice}
                onChange={e => setFormData({ ...formData, promoPrice: e.target.value })}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors tabular-nums text-lg text-primary placeholder:text-slate-300" 
                placeholder="120000"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
              <input 
                type="text" 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm text-primary placeholder:text-slate-300" 
                placeholder="Training, Recovery, Apparel..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
              {brands.length > 0 ? (
                <select
                  required
                  value={formData.brandId}
                  onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm text-primary appearance-none cursor-pointer"
                >
                  <option value="">Select brand...</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              ) : (
                <input 
                  required
                  type="text" 
                  value={formData.brandId}
                  onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm placeholder:text-slate-300" 
                  placeholder="Brand ID (uuid)"
                />
              )}
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Size</label>
              {sizes.length > 0 ? (
                <select
                  required
                  value={formData.sizeId}
                  onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm text-primary appearance-none cursor-pointer"
                >
                  <option value="">Select size...</option>
                  {sizes.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  required
                  type="text" 
                  value={formData.sizeId}
                  onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                  className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm placeholder:text-slate-300" 
                  placeholder="Size ID (uuid)"
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
            <input 
              type="url" 
              value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm text-primary placeholder:text-slate-300" 
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-3 bg-primary text-white px-8 sm:px-10 py-3 sm:py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl disabled:opacity-50"
          >
            <Package className="w-4 h-4" /> 
            {isSubmitting ? 'CREATING...' : 'CREATE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  )
}
