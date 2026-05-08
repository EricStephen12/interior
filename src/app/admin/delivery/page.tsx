'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Truck, Plus, X, Loader2, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDeliveryPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [newLocation, setNewLocation] = useState({
    name: '',
    basePrice: '',
    isActive: true
  })

  const fetchData = async () => {
    try {
      const res = await fetch('/api/delivery')
      const data = await res.json()
      setLocations(data.locations || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocation)
      })
      if (res.ok) {
        setNewLocation({ name: '', basePrice: '', isActive: true })
        setShowAddForm(false)
        fetchData()
      }
    } catch (err) {
      alert('Failed to add location')
    }
    setIsSubmitting(false)
  }

  const toggleStatus = async (location: any) => {
    try {
      await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...location, isActive: !location.isActive })
      })
      fetchData()
    } catch {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery option?')) return
    try {
      await fetch(`/api/delivery?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch {}
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">Delivery Settings</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors rounded-md"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10">
        {showAddForm && (
          <div className="bg-white p-8 rounded-xl border-2 border-accent/20 shadow-xl mb-10 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">New Delivery Option</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location / Method Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Lagos Mainland"
                  value={newLocation.name}
                  onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Fee (₦)</label>
                <input 
                  required
                  type="number"
                  placeholder="0 for free"
                  value={newLocation.basePrice}
                  onChange={e => setNewLocation({...newLocation, basePrice: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button 
                  disabled={isSubmitting}
                  className="bg-accent text-white px-8 py-3 text-xs font-black uppercase tracking-widest rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Adding...' : 'Create Option'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-accent/30 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${loc.isActive ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{loc.name}</h3>
                  <p className="text-sm font-black text-accent">₦{loc.basePrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(loc)}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                    loc.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {loc.isActive ? 'Active' : 'Inactive'}
                </button>
                <button 
                  onClick={() => handleDelete(loc.id)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <Truck className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No delivery options set yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
