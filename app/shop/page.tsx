import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ShopContent } from '@/components/shop/shop-content'
import { ShopSkeleton } from '@/components/shop/shop-skeleton'

export const metadata = {
  title: 'Shop | VELURA',
  description: 'Browse our collection of premium clothing and apparel. Find the latest styles in t-shirts, hoodies, jackets, and more.',
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
