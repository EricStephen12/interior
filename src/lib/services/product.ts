import prisma from '@/lib/prisma'

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { brand: true, size: true, categories: { include: { category: true } } }
    })
  } catch (err) {
    console.warn('[Product] Could not fetch products from DB:', err)
    return []
  }
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

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
    return ['All', ...brands.map(b => b.name)]
  } catch (err) {
    console.warn('[Product] Could not fetch brands from DB:', err)
    return ['All']
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return ['All', ...categories.map(c => c.name)]
  } catch (err) {
    console.warn('[Product] Could not fetch categories from DB:', err)
    return ['All']
  }
}
