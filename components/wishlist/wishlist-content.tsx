'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'

import { useWishlistStore } from '@/lib/wishlist-store'
import { useState, useEffect } from 'react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function WishlistContent() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (item: any) => {
    addToCart(item, 1)
    toast.success('Added to cart')
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - Artisan Haven',
        text: 'Check out my wishlist of handmade artworks!',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearWishlist} className="text-destructive hover:text-destructive">
              Clear Wishlist
            </Button>
            <Button variant="outline" onClick={shareWishlist} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Wishlist
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Save your favorite artworks to your wishlist and they&apos;ll appear here
          </p>
          <Button asChild>
            <Link href="/shop">Browse Artworks</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const discount = item.comparePrice
              ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
              : null

            return (
              <div key={item.id} className="group bg-card rounded-lg border overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isReadyToShip && (
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

                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      removeItem(item.id)
                      toast.success('Removed from wishlist')
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-primary font-medium uppercase tracking-wider">
                    {item.artForm}
                  </p>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-medium mt-1 hover:text-primary transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {item.artist}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.dimensions}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-semibold">{formatPrice(item.price)}</span>
                    {item.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.comparePrice)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Continue Shopping */}
      {items.length > 0 && (
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
