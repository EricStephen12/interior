'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Sparkles, Loader2, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'
import RichTextEditor from '@/components/RichTextEditor'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/list`) // I'll assume I can find it here or fetch all and filter
        const data = await res.json()
        const blog = (data.blogs || []).find((b: any) => b.id === id)
        if (blog) {
          setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            coverImg: blog.coverImg || '',
            published: blog.published,
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...formData })
      })
      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        alert('Failed to update article.')
      }
    } catch {
      alert('Network error. Try again.')
    }
    setIsSubmitting(false)
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
    } catch {}
    setEnhancing(null)
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link href="/admin/blogs" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Articles</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-lg font-bold text-gray-900">Edit Article</h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 accent-accent rounded"
            />
            <span className="text-xs font-semibold text-gray-600">Published</span>
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors disabled:opacity-40 rounded-md"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10">

          {/* Left — Main Editor */}
          <div className="space-y-8">
            {/* Title & Slug */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Article Details</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Headline</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xl font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL Slug</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Content</h2>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Excerpt</label>
                    <button
                      type="button"
                      onClick={() => enhanceText('excerpt')}
                      disabled={!!enhancing || !formData.excerpt.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/70 disabled:opacity-30 transition-colors"
                    >
                      {enhancing === 'excerpt' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Enhance
                    </button>
                  </div>
                  <RichTextEditor 
                    value={formData.excerpt}
                    onChange={(val) => setFormData({ ...formData, excerpt: val })}
                    placeholder="Brief summary..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Article</label>
                    <button
                      type="button"
                      onClick={() => enhanceText('content')}
                      disabled={!!enhancing || !formData.content.trim()}
                      className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/70 disabled:opacity-30 transition-colors"
                    >
                      {enhancing === 'content' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Enhance
                    </button>
                  </div>
                  <RichTextEditor 
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    placeholder="The full story..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Cover Image */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Cover Image</h2>
              </div>
              <div className="p-8">
                <CldUploadWidget
                  uploadPreset="sharers_gym"
                  options={{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }}
                  onSuccess={(result: any) => {
                    setFormData(prev => ({ ...prev, coverImg: result.info.secure_url }))
                  }}
                >
                  {({ open }) => (
                    <div>
                      {formData.coverImg ? (
                        <div className="space-y-4">
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={formData.coverImg} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => open()}
                            className="w-full py-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Replace Image
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-accent transition-colors" />
                          <span className="text-xs font-bold text-gray-400">Upload Cover Image</span>
                        </button>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
