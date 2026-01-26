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
  title: "EXRICX BEAUTY - High-End Jewelry & Fragrance",
  description: "Where tech-precision meets timeless beauty. Premium necklaces, rings, earrings, and signature perfumes from the house of EXRICX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${crimson.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Layout>
            {children}
          </Layout>
        </CartProvider>
      </body>
    </html>
  );
}
