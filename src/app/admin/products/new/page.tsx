'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Package, UploadCloud, Sparkles, Loader2, X, Plus } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
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
    description: '',
    images: [] as string[],
  })

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
    fetch('/api/sizes').then(r => r.json()).then(d => setSizes(d.sizes || [])).catch(() => {})
  }, [])

  const enhanceDescription = async () => {
    if (!formData.description.trim()) return
    setEnhancing(true)
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.description, type: 'product' })
      })
      const data = await res.json()
      if (data.enhanced) {
        setFormData(prev => ({ ...prev, description: data.enhanced }))
      }
    } catch {
      // Silently fail
    } finally {
      setEnhancing(false)
    }
  }

  const removeImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }))
  }

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
    <div className="p-4 sm:p-12 max-w-4xl mx-auto space-y-12 pb-32">
      <div className="flex items-center gap-6">
        <Link href="/admin/products" className="p-3 bg-secondary text-primary hover:bg-accent hover:text-white transition-all rounded-none">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            Add <span className="text-accent italic font-light lowercase">New Item.</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-[0.2em] mt-1">Inventory Management System</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="bg-white p-8 sm:p-16 space-y-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-primary/5 relative overflow-hidden">
          {/* Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Product Identity</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all font-bold text-2xl text-primary placeholder:text-slate-200" 
                placeholder="Obsidian Rack v1"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">System Slug</label>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all font-mono text-sm text-slate-500" 
                placeholder="obsidian-rack-v1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Investment (₦)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all text-xl font-medium tabular-nums" 
                placeholder="0"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Promo Rate (₦)</label>
              <input 
                type="number" 
                value={formData.promoPrice}
                onChange={e => setFormData({ ...formData, promoPrice: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all text-xl font-medium tabular-nums text-accent" 
                placeholder="Optional"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Item Type</label>
              <input 
                type="text" 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all text-sm font-bold uppercase tracking-widest" 
                placeholder="Training, Apparel, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-primary/5 pt-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Brand Registry</label>
              <select
                required
                value={formData.brandId}
                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all text-sm font-bold uppercase tracking-widest cursor-pointer appearance-none"
              >
                <option value="">Select Brand...</option>
                {brands.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Size Variant</label>
              <select
                required
                value={formData.sizeId}
                onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all text-sm font-bold uppercase tracking-widest cursor-pointer appearance-none"
              >
                <option value="">Select Size...</option>
                {sizes.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Protocol Narrative</label>
              <button
                type="button"
                onClick={enhanceDescription}
                disabled={enhancing || !formData.description.trim()}
                className="flex items-center gap-2 text-[9px] font-black text-accent uppercase tracking-widest hover:text-accent/70 transition-all disabled:opacity-30 border border-accent/20 px-3 py-1.5"
              >
                {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI REWRITE
              </button>
            </div>
            <textarea 
              required
              rows={6}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-0 py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-all leading-relaxed text-base text-primary placeholder:text-slate-200 resize-none" 
              placeholder="Tell the story of this item..."
            />
          </div>

          <div className="space-y-8 pt-8 border-t border-primary/5">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Visual Identity System</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {formData.images.map((url, idx) => (
                <div key={idx} className="aspect-square relative group bg-secondary border border-primary/5">
                  <img src={url} alt="" className="object-cover w-full h-full" />
                  <button 
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/80">
                    <span className="text-[8px] font-black text-white uppercase">{idx + 1}</span>
                  </div>
                </div>
              ))}
              
              <CldUploadWidget 
                uploadPreset="sharers_gym" 
                onSuccess={(result: any) => {
                  setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }))
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="aspect-square border-2 border-dashed border-primary/10 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Plus className="w-6 h-6 text-primary/20 group-hover:text-accent transition-colors" />
                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Add Asset</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-none text-[11px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-2xl disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
            {isSubmitting ? 'ENROLLING ITEM...' : 'CONFIRM REGISTRATION'}
          </button>
        </div>
      </form>
    </div>
  )
}
