import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Artisan Haven | Handmade Artworks & Traditional Indian Art',
  description: 'Discover authentic handmade artworks from master artisans across India. Shop Madhubani, Warli, Gond, Kalamkari, Pichwai, and more traditional art forms.',
  keywords: ['handmade art', 'Indian art', 'Madhubani', 'Warli', 'Gond', 'Kalamkari', 'Pichwai', 'traditional art', 'artisan', 'handcrafted'],
  authors: [{ name: 'Artisan Haven' }],
  creator: 'Artisan Haven',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://artisanhaven.com',
    siteName: 'Artisan Haven',
    title: 'Artisan Haven | Handmade Artworks & Traditional Indian Art',
    description: 'Discover authentic handmade artworks from master artisans across India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artisan Haven | Handmade Artworks',
    description: 'Discover authentic handmade artworks from master artisans across India.',
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
  themeColor: '#8B4513',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
