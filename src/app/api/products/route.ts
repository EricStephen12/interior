import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        brand: true,
        size: true,
        categories: { include: { category: true } }
      }
    })
    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    if (!data.name || data.price === undefined || data.price === '') {
      return NextResponse.json({ error: 'Missing required fields: Product Name and Price' }, { status: 400 })
    }

    const price = parseFloat(data.price)
    if (isNaN(price)) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 })
    }

    // Resolve Brand
    let brandId = data.brandId
    if (!brandId) {
      const existingBrand = await prisma.brand.findFirst({ where: { isActive: true } }) || await prisma.brand.findFirst()
      if (existingBrand) {
        brandId = existingBrand.id
      } else {
        const newBrand = await prisma.brand.create({
          data: { name: 'SHARERS', slug: `sharers-${Math.random().toString(36).substring(2, 6)}` }
        })
        brandId = newBrand.id
      }
    }

    // Resolve Size
    let sizeId = data.sizeId
    if (!sizeId) {
      const existingSize = await prisma.size.findFirst()
      if (existingSize) {
        sizeId = existingSize.id
      } else {
        const newSize = await prisma.size.create({
          data: { label: 'Standard' }
        })
        sizeId = newSize.id
      }
    }

    // Normalize images array
    let images: string[] = []
    if (Array.isArray(data.images)) {
      images = data.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
    } else if (typeof data.images === 'string' && data.images.trim()) {
      try {
        const parsed = JSON.parse(data.images)
        images = Array.isArray(parsed) ? parsed.filter(Boolean) : [data.images.trim()]
      } catch {
        images = [data.images.trim()]
      }
    }

    const baseSlug = (data.slug || data.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
    
    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        slug: uniqueSlug,
        price: price,
        promoPrice: data.promoPrice && !isNaN(parseFloat(data.promoPrice)) ? parseFloat(data.promoPrice) : null,
        images: images,
        type: data.type || null,
        description: data.description || null,
        materials: data.materials || null,
        firmness: data.firmness || null,
        warranty: data.warranty || null,
        brandId: brandId,
        sizeId: sizeId,
        promoCodeId: data.promoCodeId || null,
        isBestseller: Boolean(data.isBestseller),
      },
      include: {
        brand: true,
        size: true
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 })
    }

    const payload: any = {}

    if (updateData.name !== undefined) payload.name = updateData.name.trim()
    if (updateData.slug !== undefined) payload.slug = updateData.slug.trim()
    if (updateData.price !== undefined && updateData.price !== '') {
      payload.price = parseFloat(updateData.price) || 0
    }
    if (updateData.promoPrice !== undefined) {
      payload.promoPrice = (updateData.promoPrice && !isNaN(parseFloat(updateData.promoPrice))) ? parseFloat(updateData.promoPrice) : null
    }
    if (updateData.brandId) payload.brandId = updateData.brandId
    if (updateData.sizeId) payload.sizeId = updateData.sizeId
    if (updateData.type !== undefined) payload.type = updateData.type || null
    if (updateData.description !== undefined) payload.description = updateData.description || null
    if (updateData.materials !== undefined) payload.materials = updateData.materials || null
    if (updateData.firmness !== undefined) payload.firmness = updateData.firmness || null
    if (updateData.warranty !== undefined) payload.warranty = updateData.warranty || null
    if (updateData.promoCodeId !== undefined) payload.promoCodeId = updateData.promoCodeId || null
    if (updateData.isActive !== undefined) payload.isActive = Boolean(updateData.isActive)
    if (updateData.isBestseller !== undefined) payload.isBestseller = Boolean(updateData.isBestseller)

    if (updateData.images !== undefined) {
      let images: string[] = []
      if (Array.isArray(updateData.images)) {
        images = updateData.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
      } else if (typeof updateData.images === 'string' && updateData.images.trim()) {
        try {
          const parsed = JSON.parse(updateData.images)
          images = Array.isArray(parsed) ? parsed.filter(Boolean) : [updateData.images.trim()]
        } catch {
          images = [updateData.images.trim()]
        }
      }
      payload.images = images
    }

    const product = await prisma.product.update({ 
      where: { id }, 
      data: payload,
      include: {
        brand: true,
        size: true
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    await prisma.productCategory.deleteMany({ where: { productId: id } })
    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
