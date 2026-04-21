'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const staticProducts = [
  {
    id: 1,
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    price: 45,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    category_name: 'T-Shirts',
    is_featured: true,
    stock_quantity: 50,
  },
  {
    id: 2,
    name: 'Classic Pullover Hoodie',
    slug: 'classic-pullover-hoodie',
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
    name: 'Vintage Denim Jacket',
    slug: 'vintage-denim-jacket',
    price: 145,
    compare_price: 180,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
    category_name: 'Jackets',
    is_featured: true,
    stock_quantity: 20,
  },
  {
    id: 5,
    name: 'Oxford Button Down',
    slug: 'oxford-button-down',
    price: 85,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    category_name: 'Shirts',
    is_featured: true,
    stock_quantity: 28,
  },
  {
    id: 6,
    name: 'Cargo Street Pants',
    slug: 'cargo-street-pants',
    price: 95,
    compare_price: null,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    category_name: 'Pants',
    is_featured: true,
    stock_quantity: 18,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product, index }: { product: any; index: number }) {
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
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({ title: "Removed from Wishlist" })
    } else {
      addToWishlist(product)
      toast({ title: "Added to Wishlist" })
    }
  }

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="group flex-shrink-0 w-[300px] md:w-[350px]">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Sale Badge */}
          {discount && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1">
              SALE
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-foreground")} />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <Button 
              className="w-full h-12 gap-2"
              onClick={(e) => {
                e.preventDefault()
                addItem(product)
                toast({ title: "Added to Bag", description: product.name })
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      {/* Info - Different layout: inline pricing */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium truncate hover:underline underline-offset-4">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{product.category_name}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
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
}

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { data } = useSWR('/api/products?featured=true', fetcher)
  
  const products = (data?.products && data.products.length > 0) ? data.products : staticProducts

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 370
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-[1400px] mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-end justify-between px-6 lg:px-16 mb-8">
          <div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
              Just Dropped
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">New Arrivals</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Scroll Products - Full bleed */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 px-6 lg:px-16 scrollbar-hide snap-x snap-mandatory"
        >
          {products.slice(0, 8).map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
          
          {/* View All Card */}
          <Link 
            href="/shop"
            className="flex-shrink-0 w-[300px] md:w-[350px] aspect-[4/5] bg-foreground text-background flex flex-col items-center justify-center group snap-start"
          >
            <span className="text-6xl font-black mb-4">+</span>
            <span className="text-lg font-medium">View All Products</span>
            <span className="text-sm opacity-60 mt-1 group-hover:opacity-100 transition-opacity">
              {products.length}+ items
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
