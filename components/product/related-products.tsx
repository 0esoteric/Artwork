'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { toast } from 'sonner'
import useSWR from 'swr'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

const fetcher = (url: string) => fetch(url).then(res => res.json())

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const { data, isLoading } = useSWR(`/api/products?category=${encodeURIComponent(category)}`, fetcher)
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Filter to show related products (same category, excluding current)
  const relatedProducts = (data?.products || [])
    .filter((p: any) => p.id !== currentProductId)
    .slice(0, 4)

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">You May Also Like</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

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
        {relatedProducts.map((product: any) => {
          const discount = product.compare_price 
            ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
            : null

          const isWishlisted = mounted ? isInWishlist(product.id) : false

          const toggleWishlist = (e: React.MouseEvent) => {
            e.preventDefault()
            if (isWishlisted) {
              removeFromWishlist(product.id)
              toast.success('Removed from wishlist')
            } else {
              addToWishlist(product)
              toast.success('Added to wishlist')
            }
          }

          return (
            <div key={product.id} className="group">
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
                  {product.is_new_arrival && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      New Arrival
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
                  </Button>
                </div>

                {/* Add to Bag */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <Button 
                    className="w-full gap-2" 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      addItem(product)
                      toast.success(`${product.name} added to bag`)
                    }}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Bag'}
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wider">
                  {product.category_name || 'Clothing'}
                </p>
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {product.material || 'Premium Quality'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                  {product.compare_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.compare_price)}
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
