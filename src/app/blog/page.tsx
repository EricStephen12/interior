import { getBlogs } from '@/lib/services/blog'
import BlogClient from '@/components/BlogClient'
import { Metadata } from 'next'

export const revalidate = 30;

export const metadata: Metadata = {
  title: "The Playbook | Journal",
  description: "What we're learning, what's working, and what we think you should try. No fluff — just the stuff that actually helps.",
};

export default async function BlogPage() {
  const blogs = await getBlogs()
  const publishedBlogs = blogs.filter((b: any) => b.published)

  return <BlogClient posts={publishedBlogs} />
}
