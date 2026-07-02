import { Metadata } from 'next'
import DeliveryClient from './DeliveryClient'

export const metadata: Metadata = {
  title: 'Delivery Info | SHARERS GYM',
  description: 'Learn about SHARERS GYM delivery zones, shipping costs, and timelines for Lagos and other locations in Nigeria.',
  openGraph: {
    title: 'Delivery Info | SHARERS GYM',
    description: 'Learn about SHARERS GYM delivery zones, shipping costs, and timelines for Lagos and other locations in Nigeria.',
    url: 'https://sharersgym.com/delivery',
  }
}

export default function DeliveryPage() {
  return <DeliveryClient />
}
