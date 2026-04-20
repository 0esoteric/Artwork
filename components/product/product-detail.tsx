'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Truck, Shield, RefreshCw, Minus, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/cart-store'

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
    // New fields
    shipmentTime?: string
    couponCode?: string | null
    couponDiscount?: number
    shippingDetails?: string
    returnPolicy?: string
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

import { useWishlistStore } from '@/lib/wishlist-store'

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    // Map product images[0] to image property for the store
    const cartItem = {
      ...product,
      image: product.images[0]
    }
    addItem(cartItem, quantity)
    toast.success(`${product.name} added to cart`)
  }

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  
  const isWishlisted = mounted ? isInWishlist(product.id) : false

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
        <Link href={`/shop?artform=${product.artForm.toLowerCase()}`} className="hover:text-foreground transition-colors">
          {product.artForm}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
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
                <Badge className="bg-accent text-accent-foreground">
                  Ready to Ship
                </Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-primary text-primary-foreground">
                  Bestseller
                </Badge>
              )}
              {discount && (
                <Badge variant="secondary">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ring-2 transition-all',
                  selectedImage === index ? 'ring-primary' : 'ring-transparent hover:ring-muted-foreground/50'
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
          {/* Art Form */}
          <Link 
            href={`/shop?artform=${product.artForm.toLowerCase()}`}
            className="text-sm text-primary font-medium uppercase tracking-wider hover:underline"
          >
            {product.artForm}
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-4">
            {product.name}
          </h1>

          {/* Artist */}
          <p className="text-muted-foreground mb-4">
            by{' '}
            <Link 
              href={`/artists/${product.artistSlug}`}
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              {product.artist}
            </Link>
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <Badge variant="secondary" className="text-sm">
                  Save {formatPrice(product.comparePrice - product.price)}
                </Badge>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-muted-foreground mb-6">
            {product.shortDescription}
          </p>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Dimensions</p>
              <p className="font-medium">{product.dimensions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="font-medium">{product.medium}</p>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            {product.stockQuantity > 0 ? (
              <>
                <Check className="h-5 w-5 text-accent" />
                <span className="text-sm">
                  {product.isReadyToShip 
                    ? `In stock - Ships in ${product.shipmentTime || '3-4 days'}` 
                    : `Made to order - ${product.shipmentTime || 'Ships in 15-20 days'}`
                  }
                </span>
              </>
            ) : (
              <span className="text-sm text-destructive">Out of stock</span>
            )}
          </div>

          {/* Coupon Code Display */}
          {product.couponCode && product.couponDiscount && product.couponDiscount > 0 && (
            <div className="mb-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Use code </span>
                <code className="px-2 py-0.5 bg-primary/10 rounded text-primary font-bold">{product.couponCode}</code>
                <span className="font-medium"> for {product.couponDiscount}% off!</span>
              </p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart */}
            <Button 
              size="lg" 
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToWishlist}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-destructive text-destructive')} />
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Free Shipping above Rs. 5,000</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">100% Authentic</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">14 Day Returns</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {product.tags.map((tag) => (
              <Link
                key={tag}
                href={`/shop?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Badge variant="outline" className="hover:bg-muted transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="artist"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              About the Artist
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 prose prose-neutral max-w-none">
            {product.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </TabsContent>

          <TabsContent value="artist" className="mt-6">
            <div className="flex items-start gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                <span className="text-3xl font-serif font-bold text-muted-foreground">
                  {product.artist.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-2">{product.artist}</h3>
                <p className="text-primary font-medium text-sm mb-2">{product.artForm} Artist</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {product.artistBio || `A renowned ${product.artForm} artist with decades of experience, known for intricate patterns and vibrant colors. Each artwork is a unique expression of traditional techniques passed down through generations.`}
                </p>
                <Button asChild variant="outline">
                  <Link href={`/artists/${product.artistSlug}`}>
                    View All Works
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Shipping</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.shippingDetails || 'Free shipping on orders above Rs. 5,000. Ready to ship items dispatch within 3-4 business days. Made to order items ship within 15-20 business days. All artworks are carefully packaged to ensure safe delivery.'}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Returns & Exchanges</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.returnPolicy || '14-day return policy for all products. Items must be returned in original packaging. Refunds processed within 7 business days. Contact support for any issues with your order.'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
