'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Eye, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'
import useSWR from 'swr'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Static fallback products for when database is not connected
const staticProducts = [
  {
    id: 1,
    name: 'Essential Cotton T-Shirt',
    slug: 'essential-cotton-tshirt',
    price: 45,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    category_name: 'T-Shirts',
    is_featured: true,
    stock_quantity: 50,
  },
  {
    id: 2,
    name: 'Classic Hoodie',
    slug: 'classic-hoodie',
    price: 89,
    compare_price: 120,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    category_name: 'Hoodies',
    is_featured: true,
    stock_quantity: 35,
  },
  {
    id: 3,
    name: 'Slim Fit Chinos',
    slug: 'slim-fit-chinos',
    price: 75,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    category_name: 'Pants',
    is_featured: true,
    stock_quantity: 42,
  },
  {
    id: 4,
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    price: 145,
    compare_price: 180,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
    category_name: 'Jackets',
    is_featured: true,
    stock_quantity: 20,
  },
  {
    id: 5,
    name: 'Premium Oxford Shirt',
    slug: 'premium-oxford-shirt',
    price: 85,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    category_name: 'Shirts',
    is_featured: true,
    stock_quantity: 28,
  },
  {
    id: 6,
    name: 'Streetwear Cargo Pants',
    slug: 'streetwear-cargo-pants',
    price: 95,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    category_name: 'Pants',
    is_featured: true,
    stock_quantity: 18,
  },
  {
    id: 7,
    name: 'Oversized Sweatshirt',
    slug: 'oversized-sweatshirt',
    price: 79,
    compare_price: 99,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80',
    category_name: 'Hoodies',
    is_featured: true,
    stock_quantity: 55,
  },
  {
    id: 8,
    name: 'Minimalist Tote Bag',
    slug: 'minimalist-tote-bag',
    price: 55,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    category_name: 'Accessories',
    is_featured: true,
    stock_quantity: 30,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
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
          {product.is_featured && (
            <Badge className="bg-foreground text-background text-xs rounded-none px-2">
              New
            </Badge>
          )}
          {discount && (
            <Badge className="bg-red-600 text-white text-xs rounded-none px-2">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-9 w-9 rounded-none bg-background/90 hover:bg-background"
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-foreground")} />
            <span className="sr-only">
              {mounted ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') : 'Add to wishlist'}
            </span>
          </Button>
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-none bg-background/90 hover:bg-background" asChild>
            <Link href={`/product/${product.slug}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">Quick view</span>
            </Link>
          </Button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <Button 
            className="w-full gap-2 rounded-none"
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
              toast({
                title: "Added to Bag",
                description: `${product.name} has been added to your bag.`,
              })
            }}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock_quantity === 0 ? 'Sold Out' : 'Add to Bag'}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-foreground hover:underline underline-offset-4 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          {product.category_name || 'Clothing'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-medium">
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
  const { data, error } = useSWR('/api/products?featured=true', fetcher)
  
  // Use API data if available, otherwise fall back to static products
  const products = (data?.products && data.products.length > 0) ? data.products : staticProducts

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-2">
              Curated Selection
            </p>
            <h2 className="text-4xl md:text-5xl font-serif">
              Featured Products
            </h2>
          </div>
          <Link 
            href="/shop"
            className="mt-4 sm:mt-0 text-sm font-medium tracking-wide uppercase hover:underline underline-offset-4"
          >
            Shop All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
          {products.slice(0, 8).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
