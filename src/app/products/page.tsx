import ShopSection from '@/components/ShopSection'
import { getProducts, getBrands, getCategories } from '@/lib/services/product'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop The Arsenal",
  description: "Explore the SHARERS GYM Arsenal. Performance training gear, recovery tools, and premium athletic apparel.",
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

