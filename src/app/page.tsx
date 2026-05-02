import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import ShopSection from '@/components/ShopSection'
import { getProducts } from '@/lib/services/product'

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <HeroSection />
      <StorySection />
      <ShopSection initialProducts={products} />
    </>
  )
}
