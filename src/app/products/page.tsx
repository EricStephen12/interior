import ShopSection from '@/components/ShopSection'
import { getProducts } from '@/lib/services/product'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop The Arsenal",
  description: "Explore the SHARERS GYM Arsenal. Performance training gear, recovery tools, and premium athletic apparel.",
};

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="pt-16">
      <ShopSection initialProducts={products} />
    </div>
  )
}

