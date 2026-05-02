'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Using a mock timeout to simulate creation
    await new Promise(r => setTimeout(r, 1000))
    
    // In a real flow, this would call createBlog() via Server Action
    router.push('/admin/blogs')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs" className="p-2 bg-secondary text-primary hover:bg-accent hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            Draft <span className="text-accent italic font-light lowercase">Article.</span>
          </h1>
          <p className="text-slate-500 font-medium">Publish a new piece to the Journal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-light p-8 space-y-8 shadow-sm border border-primary/5">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-bold text-2xl text-primary" 
              placeholder="e.g. The Science of Recovery"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
            <input 
              required
              type="text" 
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm text-slate-500" 
              placeholder="the-science-of-recovery"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Excerpt</label>
            <textarea 
              required
              rows={2}
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed" 
              placeholder="A brief summary for the catalog..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Content</label>
            <textarea 
              required
              rows={10}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed" 
              placeholder="Write the full protocol here..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> 
            {isSubmitting ? 'PUBLISHING...' : 'PUBLISH ARTICLE'}
          </button>
        </div>
      </form>
    </div>
  )
}
