import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — stops your site from being embedded in iframes on other domains
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME sniffing — stops browsers from misinterpreting file types
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer info sent with requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Force HTTPS for 1 year (HSTS)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Basic permissions policy — allow camera for staff QR check-in scanner
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://clerk.sharersgym.com https://*.clerk.accounts.dev",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://images.cloudinary.com https://*.cloudinary.com https://img.clerk.com https://www.transparenttextures.com https://*.transparenttextures.com",
              "connect-src 'self' https://api.kingspay-gs.com https://*.kingspay-gs.com https://api.groq.com https://api.resend.com https://clerk.sharersgym.com https://*.clerk.accounts.dev https://*.neon.tech wss://*.pusher.com",
              "frame-src 'self' https://kingspay-gs.com https://*.kingspay-gs.com https://clerk.sharersgym.com https://*.clerk.accounts.dev",
              "frame-ancestors 'self'",
            ].join('; ')
          },
        ],
      },
    ]
  },
};

export default nextConfig;

