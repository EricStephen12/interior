'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Loader2, Tag, Percent, Zap, Star } from 'lucide-react'
import Link from 'next/link'

export default function AttributesPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [promos, setPromos] = useState<any[]>([])
  const [packs, setPacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newBrand, setNewBrand] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newPromo, setNewPromo] = useState({ code: '', discount: '' })
  const [newPack, setNewPack] = useState({ name: '', credits: '', price: '', description: '', isPopular: false })

  useEffect(() => {
    refreshData()
  }, [])

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
    await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBrand })
    })
    setNewBrand('')
    refreshData()
  }

  const addSize = async () => {
    if (!newSize.trim()) return
    await fetch('/api/sizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newSize })
    })
    setNewSize('')
    refreshData()
  }

  const addPromo = async () => {
    if (!newPromo.code || !newPromo.discount) return
    await fetch('/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPromo)
    })
    setNewPromo({ code: '', discount: '' })
    refreshData()
  }

  const addPack = async () => {
    if (!newPack.name || !newPack.credits || !newPack.price) return
    await fetch('/api/credit-packs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPack)
    })
    setNewPack({ name: '', credits: '', price: '', description: '', isPopular: false })
    refreshData()
  }

  const deleteItem = async (type: string, id: string) => {
    if (!confirm('Are you sure?')) return
    const endpoint = type === 'promos' ? 'promo' : (type === 'packs' ? 'credit-packs' : type)
    await fetch(`/api/${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    refreshData()
  }

  return (
    <div className="p-4 sm:p-12 max-w-[1600px] mx-auto space-y-12 pb-32">
      <div className="flex items-center gap-6">
        <Link href="/admin/products" className="p-3 bg-secondary text-primary hover:bg-accent hover:text-white transition-all rounded-none">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            Vault <span className="text-accent italic font-light lowercase">Configuration.</span>
          </h1>
          <p className="text-slate-400 font-medium text-xs uppercase tracking-[0.2em] mt-1">Global Parameters & Economy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        
        {/* Brands Section */}
        <div className="space-y-8 bg-white p-8 shadow-sm border border-primary/5 flex flex-col">
          <h2 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/5 pb-4">Brands</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newBrand}
              onChange={e => setNewBrand(e.target.value)}
              placeholder="Brand..."
              className="flex-1 px-4 py-3 bg-secondary/30 border-none focus:ring-1 focus:ring-accent outline-none text-[10px] font-black uppercase tracking-widest"
            />
            <button onClick={addBrand} className="p-3 bg-primary text-white hover:bg-accent transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
            {brands.map(brand => (
              <div key={brand.id} className="flex items-center justify-between p-4 bg-secondary/10">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{brand.name}</span>
                <button onClick={() => deleteItem('brands', brand.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes Section */}
        <div className="space-y-8 bg-white p-8 shadow-sm border border-primary/5 flex flex-col">
          <h2 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/5 pb-4">Sizes</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newSize}
              onChange={e => setNewSize(e.target.value)}
              placeholder="Size..."
              className="flex-1 px-4 py-3 bg-secondary/30 border-none focus:ring-1 focus:ring-accent outline-none text-[10px] font-black uppercase tracking-widest"
            />
            <button onClick={addSize} className="p-3 bg-primary text-white hover:bg-accent transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
            {sizes.map(size => (
              <div key={size.id} className="flex items-center justify-between p-4 bg-secondary/10">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{size.label}</span>
                <button onClick={() => deleteItem('sizes', size.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Codes Section */}
        <div className="space-y-8 bg-white p-8 shadow-sm border border-primary/5 flex flex-col">
          <div className="flex items-center justify-between border-b border-primary/5 pb-4">
            <h2 className="text-sm font-black text-primary uppercase tracking-widest">Promo Codes</h2>
            <Tag className="w-4 h-4 text-accent" />
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              value={newPromo.code}
              onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
              placeholder="CODE (e.g. SAVE20)"
              className="w-full px-4 py-3 bg-secondary/30 border-none focus:ring-1 focus:ring-accent outline-none text-[10px] font-black uppercase tracking-widest text-primary"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                value={newPromo.discount}
                onChange={e => setNewPromo({ ...newPromo, discount: e.target.value })}
                placeholder="Discount %"
                className="flex-1 px-4 py-3 bg-secondary/30 border-none focus:ring-1 focus:ring-accent outline-none text-[10px] font-black uppercase tracking-widest text-primary"
              />
              <button onClick={addPromo} className="px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all">
                Add
              </button>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
            {promos.map(promo => (
              <div key={promo.id} className="flex items-center justify-between p-4 bg-secondary/10 border border-transparent hover:border-accent/20 transition-all">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{promo.code}</p>
                  <p className="text-[9px] font-bold text-accent uppercase tracking-tighter">{promo.discount}% OFF</p>
                </div>
                <button onClick={() => deleteItem('promos', promo.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Packs Section */}
        <div className="space-y-8 bg-primary p-8 shadow-2xl text-white flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Credit Packs</h2>
            <Zap className="w-4 h-4 text-accent" />
          </div>
          
          <div className="space-y-3">
            <input 
              type="text" 
              value={newPack.name}
              onChange={e => setNewPack({ ...newPack, name: e.target.value })}
              placeholder="PACK NAME (e.g. ELITE)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none text-[10px] font-black uppercase tracking-widest text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                value={newPack.credits}
                onChange={e => setNewPack({ ...newPack, credits: e.target.value })}
                placeholder="Credits"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none text-[10px] font-black uppercase tracking-widest text-white"
              />
              <input 
                type="number" 
                value={newPack.price}
                onChange={e => setNewPack({ ...newPack, price: e.target.value })}
                placeholder="Price (₦)"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none text-[10px] font-black uppercase tracking-widest text-white"
              />
            </div>
            <textarea 
              rows={2}
              value={newPack.description}
              onChange={e => setNewPack({ ...newPack, description: e.target.value })}
              placeholder="Short Description..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none text-[10px] font-black uppercase tracking-widest text-white resize-none"
            />
            <label className="flex items-center gap-3 cursor-pointer py-2">
                <input 
                    type="checkbox" 
                    checked={newPack.isPopular}
                    onChange={e => setNewPack({ ...newPack, isPopular: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                />
                <span className="text-[10px] font-black uppercase tracking-widest">Featured Pack</span>
            </label>
            <button onClick={addPack} className="w-full py-4 bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl">
              Add Credit Pack
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
            {packs.map(pack => (
              <div key={pack.id} className="p-4 bg-white/5 border border-white/5 group hover:border-accent/30 transition-all flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">{pack.name}</p>
                    {pack.isPopular && <Star className="w-3 h-3 text-accent fill-accent" />}
                  </div>
                  <p className="text-[9px] font-bold text-accent uppercase tracking-tighter">{pack.credits} Credits • ₦{pack.price.toLocaleString()}</p>
                </div>
                <button onClick={() => deleteItem('packs', pack.id)} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
