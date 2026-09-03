'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Sparkles, Loader2, X, Plus, ImageIcon, Trash2, Link as LinkIcon, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
    isActive: true,
    isBestseller: false,
  })

  const normalizeImages = (imgs: any): string[] => {
    if (!imgs) return []
    if (Array.isArray(imgs)) {
      return imgs.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
    }
    if (typeof imgs === 'string' && imgs.trim().length > 0) {
      try {
        const parsed = JSON.parse(imgs)
        if (Array.isArray(parsed)) {
          return parsed.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
        }
        if (typeof parsed === 'string' && parsed.trim().length > 0) {
          return [parsed.trim()]
        }
      } catch {
        return [imgs.trim()]
      }
    }
    return []
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/brands').then(r => r.json()).catch(() => ({ brands: [] })),
      fetch('/api/sizes').then(r => r.json()).catch(() => ({ sizes: [] })),
      fetch('/api/promo').then(r => r.json()).catch(() => ({ promos: [] }))
    ]).then(([b, s, p]) => {
      const brandList = b.brands || []
      const sizeList = s.sizes || []
      setBrands(brandList)
      setSizes(sizeList)
      setPromos(p.promos || [])

      setFormData(prev => ({
        ...prev,
        brandId: prev.brandId || (brandList[0]?.id || ''),
        sizeId: prev.sizeId || (sizeList[0]?.id || '')
      }))
    })
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setErrorMessage('')

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
          return data.secure_url as string
        } else {
          console.error('Upload failed:', data.error)
          return null
        }
      } catch (err) {
        console.error('Upload failed', err)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter((url): url is string => Boolean(url))

    if (successfulUploads.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...normalizeImages(prev.images), ...successfulUploads]
      }))
    }

    if (successfulUploads.length < files.length) {
      alert(`Uploaded ${successfulUploads.length} images. ${files.length - successfulUploads.length} failed.`)
    }

    setIsUploading(false)
    e.target.value = ''
  }

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      alert('Please enter a valid image URL starting with https://')
      return
    }
    setFormData(prev => ({
      ...prev,
      images: [...normalizeImages(prev.images), url]
    }))
    setImageUrlInput('')
    setShowUrlInput(false)
  }

  const removeImage = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: normalizeImages(prev.images).filter(img => img !== urlToRemove)
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!formData.name.trim()) {
      setErrorMessage('Please enter a product name.')
      return
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      setErrorMessage('Please enter a valid price.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: normalizeImages(formData.images)
        })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSaveSuccess(true)
        setTimeout(() => {
          router.push('/admin/products')
        }, 1200)
      } else {
        setErrorMessage(data.error || 'Failed to create product.')
      }
    } catch {
      setErrorMessage('Network error while creating product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentImages = normalizeImages(formData.images)

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Admin Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-xs font-bold uppercase tracking-wider bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Products</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            New Product
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <input 
              type="checkbox" 
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {formData.isActive ? 'Active' : 'Draft'}
            </span>
          </label>

          <button 
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className={`flex items-center gap-2 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg shadow-sm transition-all ${
              saveSuccess 
                ? 'bg-green-600' 
                : 'bg-primary hover:bg-primary/90 active:scale-95 disabled:opacity-50'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Product Created!</span>
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Form */}
      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">

          {/* Left Column */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Product Information</h2>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      const val = e.target.value
                      setFormData(prev => ({
                        ...prev,
                        name: val,
                        slug: prev.slug || val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                      }))
                    }}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Kalaya Beautiful Woman Extrait De Parfum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="product-url-slug"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
                    <button
                      type="button"
                      onClick={enhanceDescription}
                      disabled={enhancing || !formData.description.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/80 disabled:opacity-30 transition-colors"
                    >
                      {enhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Enhance
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Add details, notes, aroma breakdown, sizing info..."
                  />
                </div>
              </div>
            </div>

            {/* Media / Images Gallery Management */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Product Imagery & Carousel</h2>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {currentImages.length} {currentImages.length === 1 ? 'image' : 'images'} added • Upload multiple photos or paste links
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'Hide URL Input' : 'Add via URL'}</span>
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Optional Direct URL Input */}
                {showUrlInput && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="url"
                      placeholder="Paste image link (https://...)"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider shrink-0"
                    >
                      Attach Image
                    </button>
                  </div>
                )}

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentImages.map((url, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-square relative group rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200/90 shadow-2xs"
                    >
                      <img 
                        src={url} 
                        alt={`Product ${idx + 1}`} 
                        className="object-cover w-full h-full" 
                      />
                      
                      {/* Badge #1 */}
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm z-10 pointer-events-none">
                          Main Cover
                        </span>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(url)
                        }}
                        className="absolute top-2 right-2 z-20 p-2 bg-white/95 text-gray-700 hover:text-white hover:bg-red-600 rounded-full shadow-md transition-all active:scale-90"
                        title="Remove Image"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Drop/Click Card */}
                  <label className="aspect-square border-2 border-dashed border-gray-300 hover:border-primary bg-gray-50/50 hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileUpload} 
                      disabled={isUploading}
                      className="hidden" 
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-black text-gray-600 group-hover:text-primary uppercase tracking-wider">
                          Upload Files
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold">PNG, JPG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Pricing & Promos */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Pricing & Discounts</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Base Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-xl font-black tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Connected Promo Code
                  </label>
                  <select
                    value={formData.promoCodeId}
                    onChange={e => {
                      const selectedId = e.target.value
                      const promo = promos.find(p => p.id === selectedId)
                      let newPromoPrice = formData.promoPrice
                      if (promo && formData.price) {
                        const discount = parseFloat(promo.discount)
                        const base = parseFloat(formData.price)
                        newPromoPrice = Math.round(base * (1 - discount / 100)).toString()
                      }
                      setFormData({ ...formData, promoCodeId: selectedId, promoPrice: newPromoPrice })
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">No Promo Connected</option>
                    {promos.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.code} ({p.discount}%)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Promo Price (₦) <span className="text-gray-400 font-normal normal-case">— Optional</span>
                  </label>
                  <input
                    type="number"
                    value={formData.promoPrice}
                    onChange={e => setFormData({ ...formData, promoPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-green-600 text-xl font-black tabular-nums focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                    placeholder="e.g. 120000"
                  />
                </div>
              </div>
            </div>

            {/* Categorization & Attributes */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Brand & Taxonomy</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Item Category / Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Perfumery, Apparel, Gear"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Brand</label>
                  <select
                    value={formData.brandId}
                    onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select Brand (Optional)</option>
                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Size / Variant</label>
                  <select
                    value={formData.sizeId}
                    onChange={e => setFormData({ ...formData, sizeId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Select Size (Optional)</option>
                    {sizes.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <div>
                      <label htmlFor="isActive" className="text-xs font-black text-gray-900 cursor-pointer block uppercase tracking-wider">
                        Stock Availability
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {formData.isActive !== false ? '🟢 In Stock (Available for sale)' : '🔴 Out of Stock (Marked as Sold Out)'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive !== false}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="isBestseller"
                      checked={formData.isBestseller}
                      onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <label htmlFor="isBestseller" className="text-xs font-bold text-gray-800 cursor-pointer select-none uppercase tracking-wider">
                      Feature as Bestseller
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
