import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VELURA | Modern Fashion & Clothing',
  description: 'Discover curated contemporary fashion. Premium clothing for the modern individual. Shop the latest trends in streetwear, casual wear, and designer collections.',
  keywords: ['fashion', 'clothing', 'streetwear', 'modern fashion', 'designer clothes', 'menswear', 'womenswear', 'contemporary style'],
  authors: [{ name: 'VELURA' }],
  creator: 'VELURA',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://velura.com',
    siteName: 'VELURA',
    title: 'VELURA | Modern Fashion & Clothing',
    description: 'Discover curated contemporary fashion. Premium clothing for the modern individual.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELURA | Modern Fashion',
    description: 'Discover curated contemporary fashion. Premium clothing for the modern individual.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
