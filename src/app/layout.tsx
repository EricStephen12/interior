import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartProvider } from "@/lib/cart-context";

/**
 * ── FONT CONFIGURATION ────────────────────────────────────────────────────────
 * To change the site font:
 *   1. Import the new font from "next/font/google"
 *   2. Update the variable name (e.g. "--font-cormorant" → "--font-newname")
 *   3. Update src/lib/theme.ts fonts.heading or fonts.body to match
 *   4. Update globals.css @theme and :root font variable names
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Headings — luxury editorial serif */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Body & UI — modern geometric sans-serif */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "SHARERS GYM | Train Different",
    template: "%s | SHARERS GYM"
  },
  description: "We got tired of gyms that all feel the same. So we built our own. Better coaches, better equipment, better energy. That's SHARERS.",
  keywords: ["Gym Lagos", "Personal Training", "SHARERS GYM", "Fitness", "Workout Gear", "Coaching"],
  authors: [{ name: "SHARERS GYM Team" }],
  creator: "SHARERS GYM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sharersgym.com",
    title: "SHARERS GYM | Train Different",
    description: "We got tired of gyms that all feel the same. So we built our own — with coaches who actually coach and equipment that makes sense.",
    siteName: "SHARERS GYM",
    images: [
      {
        url: "https://sharersgym.com/logo.png",
        width: 1200,
        height: 630,
        alt: "SHARERS GYM - Train Different",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHARERS GYM | Train Different",
    description: "We got tired of gyms that all feel the same. So we built our own — with coaches who actually coach and equipment that makes sense.",
    images: ["https://sharersgym.com/logo.png"],
    creator: "@sharersgym",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { MembershipProvider } from "@/lib/membership-context";
import { ClerkProvider } from "@clerk/nextjs";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastProvider } from "@/components/ToastProvider";
import { WishlistProvider } from "@/lib/wishlist-context";

import DynamicTheme from "@/components/DynamicTheme";

import { CustomizationProvider } from "@/lib/customization-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: 'SHARERS GYM',
    url: 'https://sharersgym.com',
    logo: 'https://sharersgym.com/icon.png',
    description: 'Premium fitness gym in Lagos, Nigeria. Better coaches, better equipment, better energy.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '05:00', closes: '23:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '06:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '07:00', closes: '20:00' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'sharersmall@gmail.com',
      contactType: 'customer support',
    },
    sameAs: [
      'https://twitter.com/sharersgym',
    ]
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <DynamicTheme />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${cormorant.variable} ${outfit.variable} font-outfit antialiased`}
        >
          <ScrollToTop />
          <CustomizationProvider>
            <MembershipProvider>
              <CartProvider>
                <WishlistProvider>
                  <ToastProvider>
                    <Layout>
                      {children}
                    </Layout>
                  </ToastProvider>
                </WishlistProvider>
              </CartProvider>
            </MembershipProvider>
          </CustomizationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

