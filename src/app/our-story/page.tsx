import StorySection from '@/components/StorySection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story | SHARERS GYM',
  description: 'We got tired of gyms that all feel the same. Learn the story behind SHARERS GYM — built by athletes, for athletes, right here in Lagos.',
  openGraph: {
    title: 'Our Story | SHARERS GYM',
    description: 'We got tired of gyms that all feel the same. Learn the story behind SHARERS GYM — built by athletes, for athletes, right here in Lagos.',
    url: 'https://sharersgym.com/our-story',
  }
}

export default function OurStoryPage() {
  return (
    <div className="pt-16">
      <StorySection />
    </div>
  )
}
