'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Minus, Plus, Check, ChevronDown, Truck, RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'

interface ProductDetailProps {
  product: {
    id: number
    name: string
    slug: string
    description: string
    shortDescription: string
    price: number
    comparePrice: number | null
    artist: string
    artistSlug: string
    artistBio?: string | null
    artForm: string
    dimensions: string
    medium: string
    images: string[]
    isReadyToShip: boolean
    isBestseller: boolean
    stockQuantity: number
    tags: string[]
    shipmentTime?: string
    couponCode?: string | null
    couponDiscount?: number
    shippingDetails?: string
    returnPolicy?: string
  }
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  
  const isWishlisted = mounted ? isInWishlist(product.id) : false

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    const cartItem = {
      ...product,
      image: product.images[0],
      size: selectedSize
    }
    addItem(cartItem, quantity)
    toast.success(`${product.name} added to bag`)
  }

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({
        ...product,
        image: product.images[0]
      })
      toast.success('Added to wishlist')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Section - Full Width Split */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-[calc(100vh-200px)]">
        {/* Left - Sticky Image Gallery */}
        <div className="lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)] lg:overflow-hidden">
          <div className="relative h-full">
            {/* Main Image - Full height on desktop */}
            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-muted">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isBestseller && (
                  <Badge className="bg-foreground text-background">
                    Bestseller
                  </Badge>
                )}
                {discount && (
                  <Badge className="bg-red-600 text-white">
                    -{discount}% OFF
                  </Badge>
                )}
              </div>

              {/* Thumbnail Strip - Bottom overlay */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative w-16 h-20 flex-shrink-0 overflow-hidden transition-all',
                        selectedImage === index 
                          ? 'ring-2 ring-background ring-offset-2 ring-offset-foreground' 
                          : 'opacity-70 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="px-6 lg:px-16 py-8 lg:py-12 lg:overflow-y-auto">
          <div className="max-w-lg">
            {/* Category */}
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
              {product.artForm || 'Clothing'}
            </p>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl lg:text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.shortDescription}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium">Select Size</p>
                <button className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'h-12 text-sm font-medium border transition-all',
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-foreground border-border hover:border-foreground'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              {product.stockQuantity > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>
                    {product.isReadyToShip 
                      ? `In Stock - Ships in ${product.shipmentTime || '2-3 days'}` 
                      : `Made to Order - ${product.shipmentTime || '5-7 days'}`
                    }
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Coupon Banner */}
            {product.couponCode && product.couponDiscount && product.couponDiscount > 0 && (
              <div className="bg-muted p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Extra {product.couponDiscount}% off</p>
                  <p className="text-xs text-muted-foreground">Use code at checkout</p>
                </div>
                <code className="bg-background px-4 py-2 font-mono font-bold text-sm">
                  {product.couponCode}
                </code>
              </div>
            )}

            {/* Quantity + Add to Cart Row */}
            <div className="flex gap-3 mb-4">
              {/* Quantity */}
              <div className="flex items-center border">
                <button
                  className="w-12 h-14 flex items-center justify-center hover:bg-muted transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  className="w-12 h-14 flex items-center justify-center hover:bg-muted transition-colors"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Bag */}
              <Button 
                size="lg" 
                className="flex-1 h-14 gap-2 text-sm font-medium tracking-wide"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Bag
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2"
                onClick={handleAddToWishlist}
              >
                <Heart className={cn('h-5 w-5', isWishlisted && 'fill-foreground')} />
                {isWishlisted ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 p-0"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Features - Horizontal */}
            <div className="flex gap-6 py-6 border-t border-b mb-8 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>30 Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Secure Payment</span>
              </div>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="multiple" defaultValue={['description']} className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {product.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="details">
                <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">
                  Details & Care
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material</span>
                      <span>{product.medium || '100% Cotton'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fit</span>
                      <span>{product.dimensions || 'Regular Fit'}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-muted-foreground mb-2">Care Instructions:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Machine wash cold</li>
                        <li>Do not bleach</li>
                        <li>Tumble dry low</li>
                        <li>Iron on low heat if needed</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground mb-2">Shipping</p>
                      <p>{product.shippingDetails || 'Free standard shipping on orders over $100. Standard shipping takes 3-5 business days.'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-2">Returns</p>
                      <p>{product.returnPolicy || 'We offer a 30-day return policy for unworn items with original tags attached.'}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
