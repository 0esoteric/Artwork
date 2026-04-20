'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock featured products - in production, fetch from API
const featuredProducts = [
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
    id: 5,
    name: 'Mythological Kalamkari',
    slug: 'mythological-kalamkari',
    price: 28000,
    comparePrice: null,
    artist: 'Harinath N',
    artForm: 'Kalamkari',
    dimensions: '30 in X 40 in',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
  },
  {
    id: 6,
    name: 'Durga in Pattachitra',
    slug: 'durga-pattachitra',
    price: 35000,
    comparePrice: 40000,
    artist: 'Gitanjali Das',
    artForm: 'Pattachitra',
    dimensions: '28 in X 38 in',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80',
    isReadyToShip: true,
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
  {
    id: 8,
    name: 'Elephant Gond Art',
    slug: 'elephant-gond-art',
    price: 18000,
    comparePrice: 22000,
    artist: 'Sandeep Dhurve',
    artForm: 'Gond',
    dimensions: '24 in X 30 in',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    isReadyToShip: false,
    isBestseller: true,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'

function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isWishlisted = mounted ? isInWishlist(product.id) : false

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been saved.`,
      })
    }
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <div className="group">
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
          {product.isBestseller && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Bestseller
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
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-9 w-9 rounded-full shadow-md"
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-destructive text-destructive")} />
            <span className="sr-only">
              {mounted ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') : 'Add to wishlist'}
            </span>
          </Button>
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-md">
            <Eye className="h-4 w-4" />
            <span className="sr-only">Quick view</span>
          </Button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <Button 
            className="w-full gap-2"
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
              toast({
                title: "Added to Cart",
                description: `${product.name} has been added to your cart.`,
              })
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
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
        <p className="text-xs text-muted-foreground">
          {product.dimensions}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-primary font-medium tracking-wider uppercase mb-2">
              Editor&apos;s Pick
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Featured Artworks
            </h2>
          </div>
          <Link 
            href="/shop"
            className="mt-4 sm:mt-0 text-primary font-medium hover:underline underline-offset-4"
          >
            View All Artworks
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
