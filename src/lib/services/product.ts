import prisma from '@/lib/prisma'

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { brand: true, categories: { include: { category: true } } }
  })
}

export async function createProduct(data: any) {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      brandId: data.brandId,
      sizeId: data.sizeId,
      price: data.price,
      promoPrice: data.promoPrice,
      images: data.images || [],
    }
  })
}

export async function updateProduct(id: string, data: any) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}
