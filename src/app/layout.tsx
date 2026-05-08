import type { Metadata } from "next";
import { Playfair_Display, Inter, Crimson_Text, Montserrat } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartProvider } from "@/lib/cart-context";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SHARERS GYM | Elite Performance & Athletic Mastery",
    template: "%s | SHARERS GYM"
  },
  description: "Experience the pinnacle of human potential. SHARERS GYM offers master-tier coaching and premium athletic apparel in an elite editorial environment.",
  keywords: ["Elite Gym", "High-Performance Training", "SHARERS GYM", "Luxury Fitness", "Athletic Power", "Professional Coaching"],
  authors: [{ name: "SHARERS GYM Team" }],
  creator: "SHARERS GYM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sharersgym.com",
    title: "SHARERS GYM | Elite Performance & Athletic Mastery",
    description: "Experience the pinnacle of human potential. Master-tier coaching and premium athletic gear.",
    siteName: "SHARERS GYM",
    images: [
      {
        url: "https://sharersgym.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SHARERS GYM - The Forge of Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SHARERS GYM | Elite Performance & Athletic Mastery",
    description: "Experience the pinnacle of human potential. Master-tier coaching and premium athletic gear.",
    images: ["https://sharersgym.com/og-image.jpg"],
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
import CustomCursor from "@/components/CustomCursor";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${playfair.variable} ${inter.variable} ${crimson.variable} ${montserrat.variable} font-sans antialiased`}
        >
          <ScrollToTop />
          <CustomCursor />
          <MembershipProvider>
            <CartProvider>
              <Layout>
                {children}
              </Layout>
            </CartProvider>
          </MembershipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
