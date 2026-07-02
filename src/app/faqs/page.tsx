import { Metadata } from 'next'
import FaqsClient from './FaqsClient'

export const metadata: Metadata = {
  title: 'FAQs | SHARERS GYM',
  description: 'Got questions about SHARERS GYM? Find answers about our membership pass, check-in system, delivery, and more.',
  openGraph: {
    title: 'FAQs | SHARERS GYM',
    description: 'Got questions about SHARERS GYM? Find answers about our membership pass, check-in system, delivery, and more.',
    url: 'https://sharersgym.com/faqs',
  }
}

export default function FaqsPage() {
  return <FaqsClient />
}
