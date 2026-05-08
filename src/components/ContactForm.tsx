'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Membership & The Pass',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: 'Membership & The Pass', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-2">Message Sent</h3>
        <p className="text-sm font-medium text-slate-500">
          We've received your transmission. Our team will contact you shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-8 px-6 py-3 bg-white border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest hover:border-accent transition-colors"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm sm:text-base text-primary font-medium placeholder:text-slate-300"
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Address</label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm sm:text-base text-primary font-medium placeholder:text-slate-300"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Phone / WhatsApp</label>
          <input
            required
            type="text"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm sm:text-base text-primary font-medium placeholder:text-slate-300"
            placeholder="+234..."
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Subject</label>
          <select 
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors text-sm sm:text-base text-primary font-medium appearance-none cursor-pointer"
          >
            <option>Membership & The Pass</option>
            <option>Personal Training</option>
            <option>Coaching & Training</option>
            <option>Apparel & Shop</option>
            <option>General Question</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Your Message</label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none text-sm sm:text-base text-primary font-medium placeholder:text-slate-300"
          placeholder="Tell us what you need..."
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
          Failed to send message. Please try again or email us directly.
        </p>
      )}

      <div className="pt-4 sm:pt-6">
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-primary text-white py-4 sm:py-5 flex items-center justify-center gap-3 hover:bg-accent transition-all duration-500 group disabled:opacity-50"
        >
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </span>
        </button>
      </div>
    </form>
  )
}
