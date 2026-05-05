'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Sparkles, Loader2, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

export default function NewBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enhancing, setEnhancing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImg: '',
    published: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        alert('Failed to create blog post. Check all fields.')
      }
    } catch {
      alert('Network error. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const enhanceText = async (field: 'excerpt' | 'content') => {
    const text = formData[field]
    if (!text.trim()) return

    setEnhancing(field)
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: 'blog' })
      })
      const data = await res.json()
      if (data.enhanced) {
        setFormData(prev => ({ ...prev, [field]: data.enhanced }))
      }
    } catch {
      // Silently fail
    } finally {
      setEnhancing(null)
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs" className="p-2 bg-secondary text-primary hover:bg-accent hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase font-display">
            Draft <span className="text-accent italic font-light lowercase">Article.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Publish a new piece to the Journal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 sm:p-8 space-y-8 shadow-sm border border-primary/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
              className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-bold text-lg sm:text-2xl text-primary placeholder:text-slate-300" 
              placeholder="e.g. The Science of Recovery"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Slug</label>
            <input 
              required
              type="text" 
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-mono text-sm text-slate-500 placeholder:text-slate-300" 
              placeholder="the-science-of-recovery"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image (Cloudinary)</label>
            <div className="pt-2">
              <CldUploadWidget 
                uploadPreset="sharers_gym" 
                onSuccess={(result: any) => {
                  setFormData({ ...formData, coverImg: result.info.secure_url })
                }}
              >
                {({ open }) => {
                  return (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-primary/20 hover:border-accent text-primary transition-all w-full justify-center"
                    >
                      <UploadCloud className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {formData.coverImg ? 'Image Uploaded - Click to Change' : 'Upload Cover Image'}
                      </span>
                    </button>
                  )
                }}
              </CldUploadWidget>
              {formData.coverImg && (
                <div className="mt-4 aspect-video w-48 relative border border-primary/10">
                  <img src={formData.coverImg} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Excerpt</label>
              <button
                type="button"
                onClick={() => enhanceText('excerpt')}
                disabled={!!enhancing || !formData.excerpt.trim()}
                className="flex items-center gap-1.5 text-[9px] font-black text-accent uppercase tracking-widest hover:text-accent/70 transition-colors disabled:opacity-30"
              >
                {enhancing === 'excerpt' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Enhance
              </button>
            </div>
            <textarea 
              required
              rows={2}
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed text-sm placeholder:text-slate-300" 
              placeholder="A brief summary for the catalog..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Content</label>
              <button
                type="button"
                onClick={() => enhanceText('content')}
                disabled={!!enhancing || !formData.content.trim()}
                className="flex items-center gap-1.5 text-[9px] font-black text-accent uppercase tracking-widest hover:text-accent/70 transition-colors disabled:opacity-30"
              >
                {enhancing === 'content' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Enhance
              </button>
            </div>
            <textarea 
              required
              rows={10}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-0 py-3 sm:py-4 bg-transparent border-b-2 border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed text-sm placeholder:text-slate-300" 
              placeholder="Write the full article here..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Publish immediately</span>
          </label>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-3 bg-primary text-white px-8 sm:px-10 py-3 sm:py-4 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> 
            {isSubmitting ? 'PUBLISHING...' : 'PUBLISH ARTICLE'}
          </button>
        </div>
      </form>
    </div>
  )
}
