import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import ShopSection from '@/components/ShopSection'
import { getProducts, getBrands, getCategories } from '@/lib/services/product'

export const revalidate = 0;

export default async function Home() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories()
  ])

  return (
    <>
      <HeroSection />
      <StorySection />
      <ShopSection 
        initialProducts={products} 
        brands={brands}
        categories={categories}
      />
    </>
  )
}
