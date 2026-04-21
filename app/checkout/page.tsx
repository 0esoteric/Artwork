import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckoutContent } from '@/components/checkout/checkout-content'

export const metadata = {
  title: 'Checkout | Artisan Haven',
  description: 'Complete your purchase securely',
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-muted/30">
        <CheckoutContent />
      </main>
      <Footer />
    </>
  )
}
