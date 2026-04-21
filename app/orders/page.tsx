import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OrdersContent } from '@/components/orders/orders-content'

export const metadata = {
  title: 'My Orders | Artisan Haven',
  description: 'Track and manage your orders',
}

export default function OrdersPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-muted/30">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><div className="animate-pulse h-96 bg-card rounded-lg" /></div>}>
          <OrdersContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
