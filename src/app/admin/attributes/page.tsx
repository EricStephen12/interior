'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Loader2, Tag, Zap, Star, Layers, Ruler } from 'lucide-react'
import Link from 'next/link'

export default function AttributesPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [promos, setPromos] = useState<any[]>([])
  const [packs, setPacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'brands' | 'sizes' | 'promos' | 'packs'>('brands')

  // Form states
  const [newBrand, setNewBrand] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newPromo, setNewPromo] = useState({ code: '', discount: '' })
  const [newPack, setNewPack] = useState({ name: '', credits: '', price: '', description: '', isPopular: false })
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { refreshData() }, [])

  const refreshData = async () => {
    setLoading(true)
    try {
      const [b, s, p, c] = await Promise.all([
        fetch('/api/brands').then(r => r.json()),
        fetch('/api/sizes').then(r => r.json()),
        fetch('/api/promo').then(r => r.json()),
        fetch('/api/credit-packs').then(r => r.json())
      ])
      setBrands(b.brands || [])
      setSizes(s.sizes || [])
      setPromos(p.promos || [])
      setPacks(c.packs || [])
    } catch {}
    setLoading(false)
  }

  const addBrand = async () => {
    if (!newBrand.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newBrand }) })
      const data = await res.json()
      if (res.ok) {
        setNewBrand('')
        await refreshData()
      } else {
        alert(data.error || 'Failed to add brand')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const addSize = async () => {
    if (!newSize.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/sizes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: newSize }) })
      const data = await res.json()
      if (res.ok) {
        setNewSize('')
        await refreshData()
      } else {
        alert(data.error || 'Failed to add size')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const addPromo = async () => {
    if (!newPromo.code || !newPromo.discount) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPromo) })
      const data = await res.json()
      if (res.ok) {
        setNewPromo({ code: '', discount: '' })
        await refreshData()
      } else {
        alert(data.error || 'Failed to add promo')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const addPack = async () => {
    if (!newPack.name || !newPack.credits || !newPack.price) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/credit-packs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPack) })
      const data = await res.json()
      if (res.ok) {
        setNewPack({ name: '', credits: '', price: '', description: '', isPopular: false })
        await refreshData()
      } else {
        alert(data.error || 'Failed to add credit pack')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('Delete this item?')) return
    setDeletingId(id)
    try {
      const endpoint = type === 'promos' ? 'promo' : (type === 'packs' ? 'credit-packs' : type)
      const res = await fetch(`/api/${endpoint}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const data = await res.json()
      if (res.ok) {
        await refreshData()
      } else {
        alert(data.error || 'Failed to delete')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setDeletingId(null)
    }
  }

  const tabs = [
    { key: 'brands' as const, label: 'Brands', icon: Layers, count: brands.length },
    { key: 'sizes' as const, label: 'Sizes', icon: Ruler, count: sizes.length },
    { key: 'promos' as const, label: 'Promo Codes', icon: Tag, count: promos.length },
    { key: 'packs' as const, label: 'Credit Packs', icon: Zap, count: packs.length },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/admin/products" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Inventory</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">Store Settings</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* Sidebar Tabs */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all whitespace-nowrap
                  ${activeTab === tab.key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
              >
                <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.key ? 'text-accent' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className="text-sm font-bold">{tab.label}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ──── BRANDS ──── */}
            {activeTab === 'brands' && (
              <div>
                <div className="px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Brands</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Add the brands your store carries.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBrand}
                      onChange={e => setNewBrand(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addBrand()}
                      placeholder="Brand name..."
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent w-48"
                    />
                    <button onClick={addBrand} disabled={submitting} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-accent transition-colors disabled:opacity-40">
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Add
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {brands.length === 0 ? (
                    <p className="px-8 py-16 text-center text-gray-300 text-sm">No brands yet. Add your first one above.</p>
                  ) : brands.map(brand => (
                    <div key={brand.id} className={`flex items-center justify-between px-8 py-4 hover:bg-gray-50/50 transition-all group relative ${deletingId === brand.id ? 'bg-gray-50/80' : ''}`}>
                      <span className={`text-sm font-semibold transition-colors ${deletingId === brand.id ? 'text-gray-400' : 'text-gray-800'}`}>{brand.name}</span>
                      <div className="flex items-center gap-2">
                        {deletingId === brand.id && <span className="text-[10px] font-bold text-gray-400 animate-pulse uppercase">Deleting</span>}
                        <button onClick={() => deleteItem('brands', brand.id)} disabled={deletingId !== null} className={`transition-all ${deletingId === brand.id ? 'text-red-500' : 'text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
                          {deletingId === brand.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── SIZES ──── */}
            {activeTab === 'sizes' && (
              <div>
                <div className="px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Sizes</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Define available product sizes (e.g. S, M, L, XL).</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSize}
                      onChange={e => setNewSize(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSize()}
                      placeholder="Size label..."
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent w-48"
                    />
                    <button onClick={addSize} disabled={submitting} className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-accent transition-colors disabled:opacity-40">
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Add
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {sizes.length === 0 ? (
                    <p className="px-8 py-16 text-center text-gray-300 text-sm">No sizes yet. Add your first one above.</p>
                  ) : sizes.map(size => (
                    <div key={size.id} className={`flex items-center justify-between px-8 py-4 hover:bg-gray-50/50 transition-all group relative ${deletingId === size.id ? 'bg-gray-50/80' : ''}`}>
                      <span className={`text-sm font-semibold transition-colors ${deletingId === size.id ? 'text-gray-400' : 'text-gray-800'}`}>{size.label}</span>
                      <div className="flex items-center gap-2">
                        {deletingId === size.id && <span className="text-[10px] font-bold text-gray-400 animate-pulse uppercase">Deleting</span>}
                        <button onClick={() => deleteItem('sizes', size.id)} disabled={deletingId !== null} className={`transition-all ${deletingId === size.id ? 'text-red-500' : 'text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
                          {deletingId === size.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── PROMO CODES ──── */}
            {activeTab === 'promos' && (
              <div>
                <div className="px-8 py-6 border-b border-gray-50">
                  <h2 className="text-lg font-bold text-gray-900">Promo Codes</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Create discount codes customers can apply at checkout.</p>
                </div>
                {/* Add Promo Form */}
                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newPromo.code}
                      onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                      placeholder="Code (e.g. LAUNCH20)"
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800 uppercase tracking-wider placeholder:text-gray-300 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          value={newPromo.discount}
                          onChange={e => setNewPromo({ ...newPromo, discount: e.target.value })}
                          placeholder="Discount"
                          className="w-32 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                      </div>
                      <button onClick={addPromo} disabled={submitting} className="flex items-center gap-1.5 bg-gray-900 text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-accent transition-colors disabled:opacity-40 whitespace-nowrap">
                        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Create Code
                      </button>
                    </div>
                  </div>
                </div>
                {/* Promo List */}
                <div className="divide-y divide-gray-50">
                  {promos.length === 0 ? (
                    <p className="px-8 py-16 text-center text-gray-300 text-sm">No promo codes yet. Create one above.</p>
                  ) : promos.map(promo => (
                    <div key={promo.id} className={`flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-all group relative ${deletingId === promo.id ? 'bg-gray-50/80' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-accent" />
                        </div>
                        <div className={deletingId === promo.id ? 'opacity-40' : ''}>
                          <p className="text-sm font-bold text-gray-900 tracking-wider">{promo.code}</p>
                          <p className="text-xs text-gray-400">{promo.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full ${deletingId === promo.id ? 'opacity-40' : ''}`}>{promo.discount}% off</span>
                        <div className="flex items-center gap-2">
                          {deletingId === promo.id && <span className="text-[10px] font-bold text-gray-400 animate-pulse uppercase">Deleting</span>}
                          <button onClick={() => deleteItem('promos', promo.id)} disabled={deletingId !== null} className={`transition-all ${deletingId === promo.id ? 'text-red-500' : 'text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
                            {deletingId === promo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── CREDIT PACKS ──── */}
            {activeTab === 'packs' && (
              <div>
                <div className="px-8 py-6 border-b border-gray-50">
                  <h2 className="text-lg font-bold text-gray-900">Credit Packs</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Define the credit packages members can purchase from the dashboard.</p>
                </div>
                {/* Add Pack Form */}
                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newPack.name}
                      onChange={e => setNewPack({ ...newPack, name: e.target.value })}
                      placeholder="Pack name (e.g. Elite)"
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <input
                      type="number"
                      value={newPack.credits}
                      onChange={e => setNewPack({ ...newPack, credits: e.target.value })}
                      placeholder="Credits (e.g. 1)"
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <input
                      type="number"
                      value={newPack.price}
                      onChange={e => setNewPack({ ...newPack, price: e.target.value })}
                      placeholder="Price in ₦ (e.g. 50000)"
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                  </div>
                  <input
                    type="text"
                    value={newPack.description}
                    onChange={e => setNewPack({ ...newPack, description: e.target.value })}
                    placeholder="Short description (e.g. The professional standard)"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newPack.isPopular}
                        onChange={e => setNewPack({ ...newPack, isPopular: e.target.checked })}
                        className="w-4 h-4 accent-accent rounded"
                      />
                      <span className="text-sm font-semibold text-gray-600">Mark as Featured</span>
                    </label>
                    <button onClick={addPack} disabled={submitting} className="flex items-center gap-1.5 bg-gray-900 text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-accent transition-colors disabled:opacity-40">
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Add Pack
                    </button>
                  </div>
                </div>
                {/* Pack List */}
                <div className="divide-y divide-gray-50">
                  {packs.length === 0 ? (
                    <p className="px-8 py-16 text-center text-gray-300 text-sm">No credit packs yet. Create one above.</p>
                  ) : packs.map(pack => (
                    <div key={pack.id} className={`flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-all group relative ${deletingId === pack.id ? 'bg-gray-50/80' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pack.isPopular ? 'bg-accent/10' : 'bg-gray-100'} ${deletingId === pack.id ? 'opacity-40' : ''}`}>
                          {pack.isPopular ? <Star className="w-4 h-4 text-accent fill-accent" /> : <Zap className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className={deletingId === pack.id ? 'opacity-40' : ''}>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">{pack.name}</p>
                            {pack.isPopular && <span className="text-[9px] font-bold bg-accent text-white px-1.5 py-0.5 rounded uppercase">Featured</span>}
                          </div>
                          <p className="text-xs text-gray-400">{pack.description || `${pack.credits} credit${pack.credits !== 1 ? 's' : ''}`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className={`text-right ${deletingId === pack.id ? 'opacity-40' : ''}`}>
                          <p className="text-sm font-bold text-gray-900 tabular-nums">₦{pack.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{pack.credits} credit{pack.credits !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {deletingId === pack.id && <span className="text-[10px] font-bold text-gray-400 animate-pulse uppercase">Deleting</span>}
                          <button onClick={() => deleteItem('packs', pack.id)} disabled={deletingId !== null} className={`transition-all ${deletingId === pack.id ? 'text-red-500' : 'text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
                            {deletingId === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
