'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Eye, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'
import useSWR from 'swr'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

const fetcher = (url: string) => fetch(url).then(res => res.json())

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product }: { product: any }) {
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

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = PLACEHOLDER_IMAGE
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_ready_to_ship && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Ready to Ship
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Featured
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
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-md" asChild>
            <Link href={`/product/${product.slug}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Quick view</span>
            </Link>
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
            disabled={product.stock_quantity === 0}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-primary font-medium uppercase tracking-wider">
          {product.art_form || product.category_name || 'Handmade'}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          by {product.artist_name || 'Artisan Haven'}
        </p>
        <p className="text-xs text-muted-foreground">
          {product.dimensions || 'Standard Size'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const { data, error, isLoading } = useSWR('/api/products?featured=true', fetcher)
  
  const products = data?.products || []

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <p className="text-primary font-medium tracking-wider uppercase mb-2">
                Editor&apos;s Pick
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Featured Artworks
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>No featured products available at the moment.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/shop">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

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
          {products.slice(0, 8).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
