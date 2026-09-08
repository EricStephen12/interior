import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sharers Gym Admin',
    short_name: 'SG Admin',
    description: 'Executive Management & Front Desk Portal for Sharers Gym',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
