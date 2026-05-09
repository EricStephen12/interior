import { getBlogs } from '@/lib/services/blog'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "The Playbook | Journal",
  description: "Explore the SHARERS GYM Playbook. Insights, techniques, and elite recovery protocols designed for high-performance living.",
};

export default async function BlogPage() {
  const blogs = await getBlogs()
  const publishedBlogs = blogs.filter((b: any) => b.published)

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12 sm:mb-24">
          <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-4 block">Our Journal</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-primary tracking-tight leading-[0.9] font-display">
            The SHARERS <br />
            <span className="text-accent italic font-light">Playbook.</span>
          </h1>
          <p className="mt-4 sm:mt-8 text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
            We don't follow a script. We follow progress. Insights, techniques, and exactly what your body needs after putting in the work — nothing it doesn't.
          </p>
        </div>

        {/* Featured / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {publishedBlogs.length === 0 ? (
            <div className="col-span-full py-32 text-center border-t border-primary/5">
                <p className="text-slate-300 font-black tracking-widest uppercase text-[10px]">No posts found yet. Check back soon!</p>
            </div>
          ) : (
            publishedBlogs.map((post: any, idx: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-8">
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/30">
                  {post.coverImg ? (
                    <Image 
                      src={post.coverImg} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <span className="text-[10px] font-black uppercase tracking-widest">No Cover Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-accent">
                    <div className="w-8 h-[1px] bg-accent" />
                    <span>Editorial</span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-primary tracking-tight group-hover:text-accent transition-colors duration-500 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 line-clamp-3 text-sm leading-relaxed font-medium">
                    {(post.excerpt || post.content)
                      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [text](url) -> text
                      .replace(/[#*`_~-]/g, '') // Remove markdown symbols (added hyphen)
                      .replace(/\s+/g, ' ') // Normalize spaces
                      .trim()
                      .substring(0, 160) + '...'}
                  </p>
                  
                  <div className="pt-4 flex items-center justify-between border-t border-primary/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                    <span className="text-[10px] font-black text-primary group-hover:translate-x-2 transition-transform uppercase flex items-center gap-2">
                      Read More <ArrowRight className="w-3 h-3 text-accent" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
