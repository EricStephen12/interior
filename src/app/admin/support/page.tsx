'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare, Clock, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTickets = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/support')
      const data = await res.json()
      setTickets(data.tickets || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    } catch (err) {
      alert('Failed to update status')
    }
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
            <span className="hidden sm:inline">Admin Hub</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">Support Desk</h1>
        </div>
        <button 
          onClick={fetchTickets}
          disabled={refreshing}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Open Tickets</p>
            <p className="text-3xl font-black text-primary">{tickets.filter(t => t.status === 'OPEN').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-3xl font-black text-accent">{tickets.filter(t => t.status === 'IN_PROGRESS').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resolved</p>
            <p className="text-3xl font-black text-green-600">{tickets.filter(t => t.status === 'CLOSED').length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source / Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message / Context</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      No support tickets yet.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 align-top">
                        <div className="space-y-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.source === 'CHAT' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {ticket.source}
                          </span>
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 align-top">
                        <div className="max-w-xl">
                          <p className="text-sm text-gray-900 font-bold leading-relaxed">
                            {ticket.message}
                          </p>
                          {ticket.email && (
                            <p className="text-xs text-accent mt-2 font-semibold">Contact: {ticket.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 align-top text-right">
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            {ticket.status === 'OPEN' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            {ticket.status === 'IN_PROGRESS' && <Clock className="w-4 h-4 text-accent" />}
                            {ticket.status === 'CLOSED' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            <select 
                              value={ticket.status}
                              onChange={(e) => updateStatus(ticket.id, e.target.value)}
                              className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="CLOSED">Resolved</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => updateStatus(ticket.id, 'CLOSED')}
                            className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-green-600 transition-colors"
                          >
                            Quick Resolve
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
      </div>
    </div>
  )
}
