'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { useCustomization } from '@/lib/customization-context';

interface BlogClientProps {
  posts: any[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const { get } = useCustomization();

  const blogBadge = get('section.blog.badge', 'OUR JOURNAL');
  const blogTitle1 = get('section.blog.title1', 'The SHARERS');
  const blogTitle2 = get('section.blog.title2', 'Playbook.');
  const blogSubtitle = get('section.blog.subtitle', "We don't follow a script. We follow progress. Insights, techniques, and exactly what your body needs after putting in the work — nothing it doesn't.");
  const blogBg = get('section.blog.bg', '#ffffff');
  const blogText = get('section.blog.text', '#020617');

  useEffect(() => {
    // Notify parent Theme Studio frame if embedded in preview
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SHARERS_IFRAME_NAVIGATE', path: window.location.pathname }, '*');
    }
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 transition-colors" style={{ backgroundColor: blogBg, color: blogText }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12 sm:mb-20">
          <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-3 block">
            {blogBadge}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.9] font-heading uppercase">
            {blogTitle1} <br />
            <span className="text-accent italic font-light lowercase">{blogTitle2}</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-text-muted font-medium leading-relaxed max-w-xl">
            {blogSubtitle}
          </p>
        </div>

        {/* Featured / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 lg:gap-y-24">
          {posts.length === 0 ? (
            <div className="col-span-full py-32 text-center border-t border-primary/5">
              <p className="text-text-muted font-black tracking-widest uppercase text-xs">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-6">
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/30 rounded-xl border border-primary/5">
                  {post.coverImg ? (
                    <Image 
                      src={post.coverImg} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted/40">
                      <span className="text-[10px] font-black uppercase tracking-widest">No Cover Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent">
                    <div className="w-6 h-[1px] bg-accent" />
                    <span>Editorial</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-primary tracking-tight group-hover:text-accent transition-colors leading-tight uppercase font-heading">
                    {post.title}
                  </h3>
                  
                  <p className="text-text-muted line-clamp-3 text-xs sm:text-sm leading-relaxed font-medium">
                    {(post.excerpt || post.content)
                      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                      .replace(/[#*`_~-]/g, '')
                      .replace(/\s+/g, ' ')
                      .trim()
                      .substring(0, 160) + '...'}
                  </p>
                  
                  <div className="pt-3 flex items-center justify-between border-t border-primary/5">
                    <span className="text-[10px] font-mono font-bold text-text-muted flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                    <span className="text-[10px] font-black text-primary group-hover:text-accent group-hover:translate-x-1 transition-all uppercase flex items-center gap-1.5">
                      Read Article <ArrowRight className="w-3 h-3 text-accent" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
