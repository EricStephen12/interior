import { getBlogs } from '@/lib/services/blog'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react'

export default async function AdminBlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            The <span className="text-accent italic font-light lowercase">Journal.</span>
          </h1>
          <p className="text-slate-500 font-medium whitespace-nowrap">Manage your editorial content.</p>
        </div>
        <Link 
          href="/admin/blogs/new"
          className="flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="glass-light overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/5 bg-secondary/10">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Article</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Date</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">
                  No articles found. Start writing the future.
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      {blog.coverImg ? (
                        <div className="w-20 aspect-video bg-secondary overflow-hidden">
                          <img src={blog.coverImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 aspect-video bg-secondary flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{blog.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${blog.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <Link href={`/blog/${blog.slug}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/blogs/edit/${blog.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
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

import { FileText } from 'lucide-react'
