'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Eye, Calendar, FileText, Loader2, ArrowLeft } from 'lucide-react'

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blogs/list')
      .then(r => r.json())
      .then(d => setBlogs(d.blogs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete.')
      }
    } catch {
      alert('Failed to delete.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-bold text-gray-900">Blog Articles</h1>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-accent transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Article
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-10">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Article</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="w-6 h-6 text-gray-300 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-400 text-sm">No articles yet. Write your first one.</td>
                </tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {blog.coverImg ? (
                          <div className="w-16 aspect-video bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={blog.coverImg} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 aspect-video bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{blog.title}</p>
                          <p className="text-xs text-gray-400 truncate">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${blog.published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link href={`/blog/${blog.slug}`} className="p-2 text-gray-300 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)} 
                          disabled={deletingId === blog.id}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-30"
                        >
                          {deletingId === blog.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
  )
}
