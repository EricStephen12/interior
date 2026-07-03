import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Metadata } from 'next';

export const revalidate = 30;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { brand: true }
    });

    if (!product) {
      return {
        title: 'Product Not Found | SHARERS GYM',
        description: 'The requested product could not be found.'
      };
    }

    return {
      title: `${product.name} | SHARERS GYM`,
      description: product.description || `Buy ${product.name} at SHARERS GYM.`
    };
  } catch (error) {
    return {
      title: 'Product Details | SHARERS GYM'
    };
  }
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      size: true,
      categories: {
        include: {
          category: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Normalize structure slightly for client alignment
  const detailsSchema = {
    ...product,
    type: product.type || product.categories?.[0]?.category?.name || 'Standard'
  };

  return <ProductDetailsClient product={detailsSchema} />;
}
