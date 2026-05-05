import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    if (!data.name || !data.price || !data.brandId || !data.sizeId) {
      return NextResponse.json({ error: 'Missing required fields: Name, Price, Brand, or Size' }, { status: 400 })
    }

    const price = parseFloat(data.price)
    if (isNaN(price)) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 })
    }

    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
        price: price,
        promoPrice: data.promoPrice ? parseFloat(data.promoPrice) : null,
        images: data.images || [],
        type: data.type || null,
        description: data.description || null,
        materials: data.materials || null,
        firmness: data.firmness || null,
        warranty: data.warranty || null,
        brandId: data.brandId,
        sizeId: data.sizeId,
        promoCodeId: data.promoCodeId || null,
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
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.promoPrice !== undefined) {
       updateData.promoPrice = updateData.promoPrice ? parseFloat(updateData.promoPrice) : null
    }

    const product = await prisma.product.update({ 
      where: { id }, 
      data: {
        ...updateData,
        promoCodeId: updateData.promoCodeId || null
      } 
    })
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.productCategory.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
