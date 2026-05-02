import { getBlogBySlug } from '@/lib/services/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react'
import Image from 'next/image'

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug)

  if (!post || (!post.published)) {
    notFound()
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Editorial Hero Header */}
      <header className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
        {post.coverImg && (
          <Image 
            src={post.coverImg} 
            alt={post.title} 
            fill 
            className="object-cover opacity-60 scale-105" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/80" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-accent hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.9] font-display max-w-4xl mx-auto">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-accent" />
              {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-accent" />
              {post.author.name || 'Editorial Team'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-24 md:py-32">
        {/* Intro / Excerpt */}
        {post.excerpt && (
          <div className="mb-16">
            <p className="text-2xl md:text-3xl font-medium text-primary italic leading-relaxed border-l-4 border-accent pl-8 py-4">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-primary
          prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium
          prose-strong:text-primary prose-strong:font-black
          prose-blockquote:border-accent prose-blockquote:bg-secondary/10 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:not-italic
        ">
          {post.content.split('\n').map((para: string, i: number) => (
             para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          ))}
        </div>

        {/* Footer Actions */}
        <footer className="mt-20 pt-10 border-t border-primary/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">
                <Share2 className="w-4 h-4" /> Share Article
              </button>
           </div>
           
           <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
             More From The Journal &rarr;
           </Link>
        </footer>
      </div>

      {/* Recommended Section Placeholder */}
      <section className="bg-secondary/10 py-24 border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <h4 className="text-3xl font-black text-primary tracking-tight font-display">Deepen Your <span className="text-accent italic font-light">Perspective.</span></h4>
            <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary hover:text-accent transition-colors">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-64 bg-white/50 border border-primary/5 animate-pulse" />
            <div className="h-64 bg-white/50 border border-primary/5 animate-pulse" />
          </div>
        </div>
      </section>
    </article>
  )
}
