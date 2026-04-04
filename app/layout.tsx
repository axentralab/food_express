
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/features/cart/cart-context'

import './globals.css'
import { Navbar } from '@/components/navbar/navbar'
import { Footer } from '@/components/footer/footer'
import { UIProvider } from '@/components/providers/ui-provider'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });


export const metadata: Metadata = {
  title: 'FoodExpress - Fast Food Delivery',
  description: 'Delicious food delivered fast. Browse restaurants, customize your order, and enjoy premium dining at your doorstep.',
  keywords: 'food delivery, restaurant, fast food, online order',
  generator: 'v0.app',
  openGraph: {
    title: 'FoodExpress - Fast Food Delivery',
    description: 'Delicious food delivered fast',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#E21B70',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geist.variable} ${geistMono.variable}`}>
      <body className={`${geist.className} antialiased flex flex-col min-h-screen`}>
  
        <CartProvider>
        <UIProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </UIProvider>
        </CartProvider>
      
        <Analytics />
      </body>
    </html>
  )
}