'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Sparkles, Loader2, X, Plus, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { CldUploadButton } from 'next-cloudinary'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [brands, setBrands] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [promos, setPromos] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brandId: '',
    sizeId: '',
    price: '',
    promoPrice: '',
    promoCodeId: '',
    type: '',
    description: '',
    images: [] as string[],
    isBestseller: false,
  })

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
    fetch('/api/sizes').then(r => r.json()).then(d => setSizes(d.sizes || [])).catch(() => {})
    fetch('/api/promo').then(r => r.json()).then(d => setPromos(d.promos || [])).catch(() => {})
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
    } catch {}
    setEnhancing(false)
  }

  const removeImage = (url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    const uploadPromises = Array.from(files).map(async (file) => {
      const uploadData = new FormData()
      uploadData.append('file', file)

      try {
        const res = await fetch(`/api/upload`, {
          method: 'POST',
          body: uploadData
        })
        const data = await res.json()
        if (data.secure_url) {
          return data.secure_url
        } else {
          console.error('Upload failed:', data.error?.message)
          return null
        }
      } catch (err) {
        console.error('Upload failed', err)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(url => url !== null)

    if (successfulUploads.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...successfulUploads] }))
    }

    if (successfulUploads.length < files.length) {
      alert(`Successfully uploaded ${successfulUploads.length} images. ${files.length - successfulUploads.length} failed.`)
    }

    setIsUploading(false)
    e.target.value = '' // reset input
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
        const data = await res.json()
        alert(data.error || 'Failed to create product. Check all fields.')
      }
    } catch {
      alert('Network error. Try again.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Admin Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/admin/products" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Inventory</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">New Product</h1>
        </div>
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-40 rounded-md"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-10">

          {/* Left Column — Main Details */}
          <div className="space-y-8">

            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Product Details</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-lg font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    placeholder="e.g. Premium Dumbbell Set"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL Slug</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    placeholder="premium-dumbbell-set"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                    <button
                      type="button"
                      onClick={enhanceDescription}
                      disabled={enhancing || !formData.description.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/70 disabled:opacity-30 transition-colors"
                    >
                      {enhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm leading-relaxed placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
                    placeholder="Tell the story behind this product..."
                  />
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Product Images</h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="aspect-square relative group rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={url} alt="" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-2 right-2 p-1.5 bg-white text-gray-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent hover:bg-accent/5 transition-all group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileUpload} 
                      disabled={isUploading}
                      className="hidden" 
                    />
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-accent transition-colors" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Upload</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Sidebar */}
          <div className="space-y-8">

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pricing & Promos</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Base Price (₦)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-2xl font-bold tabular-nums placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Connected Promo Code</label>
                  <select
                    value={formData.promoCodeId}
                    onChange={e => {
                      const selectedId = e.target.value
                      const promo = promos.find(p => p.id === selectedId)
                      let newPromoPrice = formData.promoPrice
                      if (promo && formData.price) {
                        const discount = parseFloat(promo.discount)
                        const base = parseFloat(formData.price)
                        newPromoPrice = (base * (1 - discount / 100)).toString()
                      }
                      setFormData({ ...formData, promoCodeId: selectedId, promoPrice: newPromoPrice })
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all appearance-none"
                  >
                    <option value="">No Promo Connected</option>
                    {promos.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.code} ({p.discount}%)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Promo Price (₦) <span className="text-gray-300 normal-case">— calculated or manual</span></label>
                  <input
                    type="number"
                    value={formData.promoPrice}
                    onChange={e => setFormData({ ...formData, promoPrice: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-green-600 text-2xl font-bold tabular-nums placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Organization</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Type</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    placeholder="e.g. Equipment, Apparel"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isBestseller"
                    checked={formData.isBestseller}
                    onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="isBestseller" className="text-sm font-bold text-gray-900 cursor-pointer select-none">
                    Mark as Bestseller
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand</label>
                  <select
                    required
                    value={formData.brandId}
                    onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all appearance-none"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Size</label>
                  <select
                    required
                    value={formData.sizeId}
                    onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all appearance-none"
                  >
                    <option value="">Select Size</option>
                    {sizes.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
