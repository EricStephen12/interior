'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Image as ImageIcon, Eye } from 'lucide-react'
import Link from 'next/link'

export default function BlogForm({ initialData, authorId }: { initialData?: any, authorId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    coverImg: initialData?.coverImg || '',
    published: initialData?.published || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // In a real app, you'd call a server action or API route here
    console.log('Submitting blog data:', { ...formData, authorId })
    
    // Mock success
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/blogs')
      router.refresh()
    }, 1000)
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
    setFormData({ ...formData, slug })
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <div className="flex justify-between items-center">
        <Link href="/admin/blogs" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Link>
        <div className="flex gap-4">
           <button 
             onClick={() => console.log('Previewing...')}
             className="flex items-center gap-2 px-6 py-3 bg-secondary/50 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all"
           >
             <Eye className="w-4 h-4 text-accent" /> Preview
           </button>
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl disabled:opacity-50"
           >
             <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Article'}
           </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Title</label>
            <input
              type="text"
              value={formData.title}
              onBlur={generateSlug}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-4xl font-black text-primary border-none focus:ring-0 placeholder:text-slate-200 bg-transparent p-0"
              placeholder="The Title of Evolved Reality..."
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full text-xs font-bold text-accent border-b border-primary/5 focus:border-accent focus:ring-0 transition-colors py-2 bg-transparent"
              placeholder="article-slug-path"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content Body</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full p-8 bg-white border border-primary/5 focus:border-accent focus:ring-0 transition-all font-medium text-slate-600 leading-relaxed rounded-none shadow-sm"
              placeholder="Speak with authority. The SHARERS journal demands precision..."
              required
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-10">
          <div className="glass-light p-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 border-b border-primary/5 pb-4">Article Intelligence</h3>
            
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Description / Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={4}
                className="w-full p-4 bg-white/50 border border-primary/5 focus:border-accent focus:ring-0 text-xs font-medium"
                placeholder="A brief summary for seekers..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.coverImg}
                  onChange={(e) => setFormData({ ...formData, coverImg: e.target.value })}
                  className="w-full p-3 bg-white/50 border border-primary/5 focus:border-accent focus:ring-0 text-xs font-medium"
                  placeholder="https://unsplash..."
                />
                <button type="button" className="p-3 bg-secondary/50 hover:bg-secondary text-primary transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-primary/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Published</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, published: !formData.published })}
                className={`w-12 h-6 flex items-center px-1 transition-colors duration-500 ${formData.published ? 'bg-accent' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white shadow-sm transform transition-transform duration-500 ${formData.published ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="p-8 border border-accent/20 bg-accent/5">
             <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Security Notice</div>
             <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
               All editorial content is reviewed for bio-mechanical accuracy before public syncing. Secure connections enforced.
             </p>
          </div>
        </div>
      </form>
    </div>
  )
}
