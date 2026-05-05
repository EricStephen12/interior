'use client'

import { getBlogs } from '@/lib/services/blog'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Calendar, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/blogs/list')
      .then(r => r.json())
      .then(d => setBlogs(d.blogs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return

    try {
      const res = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id))
      }
    } catch {
      alert('Failed to delete.')
    }
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase font-display">
            The <span className="text-accent italic font-light lowercase">Journal.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Manage your editorial content.</p>
        </div>
        <Link 
          href="/admin/blogs/new"
          className="flex items-center justify-center gap-3 bg-primary text-white px-6 sm:px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-primary/5 bg-secondary/10">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Article</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Status</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Date</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium text-sm">
                  Loading articles...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium text-sm">
                  No articles found. Start writing the future.
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                      {blog.coverImg ? (
                        <div className="w-16 sm:w-20 aspect-video bg-secondary overflow-hidden flex-shrink-0">
                          <img src={blog.coverImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 sm:w-20 aspect-video bg-secondary flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-primary group-hover:text-accent transition-colors truncate">{blog.title}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${blog.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex justify-end gap-2 sm:gap-3">
                      <Link href={`/blog/${blog.slug}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
  )
}
