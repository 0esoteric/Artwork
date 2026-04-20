import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock related products
const allProducts = [
  {
    id: 1,
    name: 'Tree of Life in Madhubani',
    slug: 'tree-of-life-madhubani',
    price: 15000,
    comparePrice: 18000,
    artist: 'Ambika Devi',
    artForm: 'Madhubani',
    dimensions: '24 in X 36 in',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    isReadyToShip: true,
    isBestseller: true,
  },
  {
    id: 2,
    name: 'Dancing Peacocks in Gond',
    slug: 'dancing-peacocks-gond',
    price: 12000,
    comparePrice: null,
    artist: 'Sandeep Dhurve',
    artForm: 'Gond',
    dimensions: '20 in X 30 in',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
  },
  {
    id: 3,
    name: 'Village Life Warli',
    slug: 'village-life-warli',
    price: 8500,
    comparePrice: 10000,
    artist: 'Dilip Bahotha',
    artForm: 'Warli',
    dimensions: '18 in X 24 in',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
  },
  {
    id: 4,
    name: 'Krishna Leela Pichwai',
    slug: 'krishna-leela-pichwai',
    price: 45000,
    comparePrice: 52000,
    artist: 'Master Artist',
    artForm: 'Pichwai',
    dimensions: '36 in X 48 in',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
    isReadyToShip: false,
    isBestseller: true,
  },
  {
    id: 7,
    name: 'Fish Motif Madhubani',
    slug: 'fish-motif-madhubani',
    price: 5500,
    comparePrice: 6500,
    artist: 'Ambika Devi',
    artForm: 'Madhubani',
    dimensions: '12 in X 16 in',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

interface RelatedProductsProps {
  currentProductId: number
  artForm: string
}

export function RelatedProducts({ currentProductId, artForm }: RelatedProductsProps) {
  // Filter to show related products (same art form, excluding current)
  const relatedProducts = allProducts
    .filter(p => p.id !== currentProductId)
    .slice(0, 4)

  if (relatedProducts.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold">You May Also Like</h2>
        <Link href="/shop" className="text-primary font-medium hover:underline underline-offset-4">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const discount = product.comparePrice 
            ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
            : null

          return (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isReadyToShip && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      Ready to Ship
                    </Badge>
                  )}
                  {discount && (
                    <Badge variant="secondary" className="text-xs">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-md">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to Cart */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <Button className="w-full gap-2" size="sm">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wider">
                  {product.artForm}
                </p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  by {product.artist}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                  {product.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
