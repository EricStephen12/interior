import prisma from '@/lib/prisma'

export async function getBlogs() {
  console.log('[BLOG_SERVICE]: Fetching all blog posts from database...')
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    })
  } catch (error) {
    console.error('[BLOG_SERVICE_ERROR]: Failed to fetch blogs:', error)
    throw error
  }
}

export async function getBlogBySlug(slug: string) {
  console.log(`[BLOG_SERVICE]: Fetching blog post with slug: ${slug}`)
  return await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true }
  })
}

export async function createBlog(data: any) {
  console.log('[BLOG_SERVICE]: Creating new blog post...')
  return await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      coverImg: data.coverImg,
      authorId: data.authorId,
      published: data.published ?? false,
    }
  })
}

export async function updateBlog(id: string, data: any) {
  return await prisma.blogPost.update({
    where: { id },
    data
  })
}

export async function deleteBlog(id: string) {
  return await prisma.blogPost.delete({
    where: { id }
  })
}
