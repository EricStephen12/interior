import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: parseFloat(data.price),
        promoPrice: data.promoPrice ? parseFloat(data.promoPrice) : null,
        imageUrl: data.imageUrl || null,
        type: data.type || null,
        materials: data.materials || null,
        firmness: data.firmness || null,
        warranty: data.warranty || null,
        brandId: data.brandId,
        sizeId: data.sizeId,
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const { id, ...updateData } = data

    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.promoPrice) updateData.promoPrice = parseFloat(updateData.promoPrice)

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    // Delete associated categories first
    await prisma.productCategory.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
