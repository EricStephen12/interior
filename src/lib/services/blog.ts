import prisma from '@/lib/prisma'

export async function getBlogs() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true }
    })
  } catch (err) {
    console.warn('[Blog] Could not fetch blogs from DB:', err)
    return []
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true }
    })
  } catch (err) {
    console.warn(`[Blog] Could not fetch blog ${slug} from DB:`, err)
    return null
  }
}

export async function createBlog(data: any) {
  return prisma.blogPost.create({
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
  return prisma.blogPost.update({ where: { id }, data })
}

export async function deleteBlog(id: string) {
  return prisma.blogPost.delete({ where: { id } })
}
