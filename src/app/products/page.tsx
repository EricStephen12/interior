import ShopSection from '@/components/ShopSection'
import { getProducts, getBrands, getCategories } from '@/lib/services/product'
import { Metadata } from 'next'

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Shop The Arsenal",
  description: "The stuff we actually use. If it's in the shop, it's because we've tested it and it works.",
};

export default async function ProductsPage() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories()
  ])

  return (
    <div className="pt-16">
      <ShopSection 
        initialProducts={products} 
        brands={brands}
        categories={categories}
      />
    </div>
  )
}

