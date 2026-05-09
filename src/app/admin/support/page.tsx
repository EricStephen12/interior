'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MessageSquare, Clock, CheckCircle2, AlertCircle, Loader2, RefreshCw, Mail, X, Bot, User as UserIcon, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const sendReply = async () => {
    if (!replyText.trim() || sendingReply) return
    setSendingReply(true)
    try {
      const res = await fetch('/api/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketId: selectedTicket.id, 
          message: replyText.trim() 
        })
      })
      const data = await res.json()
      if (data.success) {
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? data.ticket : t))
        setSelectedTicket(data.ticket)
        setReplyText('')
      }
    } catch (err) {
      alert('Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const deleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this ticket?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/support?id=${id}`, { method: 'DELETE' })
      setTickets(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      alert('Failed to delete ticket')
    } finally {
      setDeletingId(null)
    }
  }

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
        {/* Stats Grid */}
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
            <table className="w-full text-left min-w-[700px]">
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
                          <div className="flex items-center gap-4 mt-3">
                            {ticket.email && (
                                <p className="text-xs text-accent font-semibold">Contact: {ticket.email}</p>
                            )}
                            {ticket.chatHistory && (
                                <button 
                                    onClick={() => setSelectedTicket(ticket)}
                                    className="text-[10px] font-black text-primary hover:text-accent uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                >
                                    <MessageSquare className="w-3 h-3" /> View Transcript
                                </button>
                            )}
                          </div>
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
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setSelectedTicket(ticket)}
                              className="px-3 py-1.5 bg-accent text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-1.5 rounded-none"
                            >
                              <MessageSquare className="w-3 h-3" /> Join & Reply
                            </button>
                            <button 
                              onClick={() => updateStatus(ticket.id, 'CLOSED')}
                              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors border border-gray-100"
                            >
                              Quick Resolve
                            </button>
                            <button 
                              onClick={() => deleteTicket(ticket.id)}
                              disabled={deletingId === ticket.id}
                              className="p-1.5 text-gray-300 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete Ticket"
                            >
                              {deletingId === ticket.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
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

      {/* Transcript Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-primary text-white">
                <div>
                   <h3 className="text-xl font-bold tracking-tight">Chat Transcript</h3>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Context Review Protocol</p>
                </div>
                <div className="flex items-center gap-6">
                  {selectedTicket.email && (
                    <a 
                      href={`mailto:${selectedTicket.email}?subject=SHARERS GYM Support: Re: Your Inquiry&body=Hi ${selectedTicket.name || 'Member'},%0D%0A%0D%0ARegarding your message: "${selectedTicket.message}"%0D%0A%0D%0A`}
                      className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 border border-white/20 px-3 py-1.5 transition-colors"
                    >
                      <Mail className="w-3 h-3" /> Emergency Email
                    </a>
                  )}
                  <button onClick={() => setSelectedTicket(null)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-secondary/10">
                {/* AI Transcript */}
                <div className="space-y-6 pb-6 border-b border-gray-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Initial AI Conversation</p>
                  {Array.isArray(selectedTicket.chatHistory) ? (selectedTicket.chatHistory as any[]).map((msg: any, i: number) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role !== 'user' && (
                        <div className="w-8 h-8 bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-accent" />
                        </div>
                      )}
                      <div className={`max-w-[80%] px-5 py-4 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white font-medium' 
                          : 'bg-white border border-gray-100 text-primary'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )) : (
                      <div className="py-10 text-center text-gray-400 text-xs">No AI history available.</div>
                  )}
                </div>

                {/* Human Replies */}
                {selectedTicket.replies && (selectedTicket.replies as any[]).length > 0 && (
                  <div className="space-y-6 pt-6">
                     <p className="text-[10px] font-black text-accent uppercase tracking-widest text-center">Admin Responses</p>
                     {(selectedTicket.replies as any[]).map((reply: any, i: number) => (
                       <div key={i} className="flex gap-4 justify-start">
                          <div className="w-8 h-8 bg-accent flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="max-w-[80%] px-5 py-4 bg-white border border-accent/20 text-primary text-sm leading-relaxed shadow-sm">
                            <p className="font-black text-[9px] text-accent uppercase tracking-[0.2em] mb-1">Official Response</p>
                            {reply.content}
                            <p className="text-[9px] text-slate-400 mt-2 font-mono">{new Date(reply.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>

              {/* Reply Input */}
              <div className="px-8 py-6 border-t border-gray-100 bg-white">
                <div className="flex gap-4">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official reply..."
                    className="flex-1 px-4 py-3 bg-secondary/20 border-none focus:ring-1 focus:ring-accent text-sm min-h-[80px] resize-none font-medium"
                  />
                  <button 
                    onClick={sendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="w-14 bg-accent text-white flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="px-8 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
                  >
                    CLOSE VAULT
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
