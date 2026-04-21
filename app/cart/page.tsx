import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartContent } from '@/components/cart/cart-content'

export const metadata = {
  title: 'Shopping Cart | Artisan Haven',
  description: 'View and manage your shopping cart',
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <CartContent />
      </main>
      <Footer />
    </>
  )
}
