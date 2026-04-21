'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Truck, Shield, RefreshCw, Minus, Plus, Check, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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

// Available sizes for clothing
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isReadyToShip && (
                <Badge className="bg-foreground text-background rounded-none">
                  In Stock
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-foreground text-background rounded-none">
                  Bestseller
                </Badge>
              )}
              {discount && (
                <Badge className="bg-red-600 text-white rounded-none">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all',
                  selectedImage === index ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-8 lg:mt-0">
          {/* Category */}
          <p className="text-sm text-muted-foreground tracking-wide uppercase mb-2">
            {product.artForm || 'Clothing'}
          </p>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-serif mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <Badge variant="secondary" className="rounded-none text-xs">
                  Save {formatPrice(product.comparePrice - product.price)}
                </Badge>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium tracking-wide uppercase">Size</p>
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'min-w-[48px] h-12 px-4 border text-sm transition-colors',
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

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            {product.stockQuantity > 0 ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  {product.isReadyToShip 
                    ? `In stock - Ships in ${product.shipmentTime || '2-3 days'}` 
                    : `Made to order - ${product.shipmentTime || 'Ships in 5-7 days'}`
                  }
                </span>
              </>
            ) : (
              <span className="text-sm text-red-600">Out of stock</span>
            )}
          </div>

          {/* Coupon Code Display */}
          {product.couponCode && product.couponDiscount && product.couponDiscount > 0 && (
            <div className="mb-6 p-4 border border-dashed">
              <p className="text-sm">
                Use code{' '}
                <code className="px-2 py-1 bg-muted font-medium">{product.couponCode}</code>
                {' '}for {product.couponDiscount}% off
              </p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center border">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-12 w-12"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none h-12 w-12"
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart */}
            <Button 
              size="lg" 
              className="flex-1 gap-2 rounded-none h-12"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Bag
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="lg"
              className="rounded-none h-12 w-12 p-0"
              onClick={handleAddToWishlist}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-foreground')} />
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="lg"
              className="rounded-none h-12 w-12 p-0"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
            <div className="text-center">
              <Truck className="h-5 w-5 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Free Shipping $150+</p>
            </div>
            <div className="text-center">
              <Shield className="h-5 w-5 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Secure Checkout</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-5 w-5 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 text-sm tracking-wide uppercase"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 text-sm tracking-wide uppercase"
            >
              Details & Care
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3 text-sm tracking-wide uppercase"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8 max-w-3xl">
            {product.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </TabsContent>

          <TabsContent value="details" className="mt-8 max-w-3xl">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-medium">{product.medium || '100% Cotton'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fit</p>
                  <p className="font-medium">{product.dimensions || 'Regular Fit'}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Care Instructions</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-8 max-w-3xl space-y-6">
            <div>
              <h4 className="font-medium mb-2">Shipping</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {product.shippingDetails || 'Free standard shipping on orders over $150. Standard shipping takes 3-5 business days. Express shipping available at checkout for an additional fee.'}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Returns & Exchanges</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {product.returnPolicy || 'We offer a 30-day return policy for unworn items with original tags attached. Exchanges are free for different sizes. Refunds are processed within 5-7 business days.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
