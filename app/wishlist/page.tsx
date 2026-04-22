import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WishlistContent } from '@/components/wishlist/wishlist-content'

export const metadata = {
  title: 'Wishlist | VELURA',
  description: 'Your saved items',
}

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <WishlistContent />
      </main>
      <Footer />
    </>
  )
}
