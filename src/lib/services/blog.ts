import prisma from '@/lib/prisma'

export async function getBlogs() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })
}

export async function getBlogBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true }
  })
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
