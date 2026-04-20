import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ShopContent } from '@/components/shop/shop-content'
import { ShopSkeleton } from '@/components/shop/shop-skeleton'

export const metadata = {
  title: 'Shop Handmade Artworks | Artisan Haven',
  description: 'Browse our collection of authentic handmade artworks from master artisans across India.',
}

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
