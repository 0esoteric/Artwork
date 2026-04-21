'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, Shield, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

// Demo items for showcase
const demoItems = [
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
  },
]

export function CartContent() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, addItem } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Add demo items for showcase
  const addDemoItems = () => {
    demoItems.forEach((item) => {
      addItem(item)
    })
    toast.success('Demo items added to cart')
  }

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-muted rounded mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-80 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const shipping = subtotal >= 5000 ? 0 : 499
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'artisan10') {
      setCouponApplied(true)
      toast.success('Coupon applied! 10% discount added')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any artworks to your cart yet. 
            Explore our collection of handmade masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={addDemoItems}>
              Add Demo Items
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/50 rounded-t-lg text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                    {/* Product Info */}
                    <div className="col-span-6 flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/product/${item.slug}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          by {item.artist}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.dimensions}
                        </p>
                        {item.isReadyToShip && (
                          <span className="inline-block text-xs text-accent mt-1">
                            Ready to Ship
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center mt-4 md:mt-0">
                      <span className="md:hidden text-sm text-muted-foreground mr-2">Price:</span>
                      <span>{formatPrice(item.price)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex items-center justify-center mt-4 md:mt-0">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2 flex items-center justify-between md:justify-end mt-4 md:mt-0">
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive ml-2"
                        onClick={() => {
                          removeItem(item.id)
                          toast.success('Item removed from cart')
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-destructive hover:text-destructive"
              onClick={() => {
                clearCart()
                toast.success('Cart cleared')
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-card rounded-lg border p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <Button 
                variant="outline" 
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode}
              >
                Apply
              </Button>
            </div>

            <Separator className="mb-4" />

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? 'text-accent' : ''}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-accent">
                  <span>Discount (10%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Trust Badges */}
            <div className="mt-6 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free shipping on orders above Rs. 5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure checkout with Razorpay</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span>Use code ARTISAN10 for 10% off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
