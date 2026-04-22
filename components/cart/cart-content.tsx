'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, X, Truck, RotateCcw, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// Demo items for showcase
const demoItems = [
  {
    id: 1,
    name: 'Essential Cotton Tee',
    slug: 'essential-cotton-tee',
    price: 45,
    comparePrice: null,
    category: 'T-Shirts',
    size: 'M',
    color: 'Black',
    material: '100% Cotton',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    isNewArrival: true,
  },
  {
    id: 2,
    name: 'Classic Pullover Hoodie',
    slug: 'classic-pullover-hoodie',
    price: 89,
    comparePrice: 120,
    category: 'Hoodies',
    size: 'L',
    color: 'Navy',
    material: 'Cotton Blend',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    isNewArrival: false,
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

  const addDemoItems = () => {
    demoItems.forEach((item) => {
      addItem(item)
    })
    toast.success('Demo items added to bag')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-muted mb-12" />
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-32 h-40 bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-48 bg-muted" />
                      <div className="h-4 w-24 bg-muted" />
                      <div className="h-6 w-20 bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-2 h-80 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const shipping = subtotal >= 100 ? 0 : 9.99
  const discount = couponApplied ? Math.round(subtotal * 0.15) : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'threads15') {
      setCouponApplied(true)
      toast.success('Coupon applied! 15% discount added')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4">Your Bag is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything yet. Let&apos;s change that.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="h-14">
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14" onClick={addDemoItems}>
              Add Demo Items
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
            Your Bag
          </h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Cart Items - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="space-y-0 divide-y">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0">
                  <div className="flex gap-6">
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-28 h-36 md:w-32 md:h-40 bg-muted overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link 
                            href={`/product/${item.slug}`}
                            className="font-medium hover:underline underline-offset-4 line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.category} {item.size && `/ Size ${item.size}`} {item.color && `/ ${item.color}`}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.id)
                            toast.success('Item removed')
                          }}
                          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-auto pt-4 flex items-end justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border">
                          <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t mt-6">
              <Button variant="ghost" asChild>
                <Link href="/shop">
                  Continue Shopping
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  clearCart()
                  toast.success('Bag cleared')
                }}
              >
                Clear Bag
              </Button>
            </div>
          </div>

          {/* Order Summary - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-muted/30 p-6 lg:p-8 sticky top-[120px]">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Promo Code</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="h-12"
                  />
                  <Button 
                    variant="outline"
                    className="h-12 px-6"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {!couponApplied && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: THREADS15 for 15% off
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t pt-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (15%)</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between py-6 border-t mt-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>

              <Button asChild size="lg" className="w-full h-14 text-sm font-medium tracking-wide">
                <Link href="/checkout">
                  Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {/* Trust Badges - Vertical Stack */}
              <div className="mt-8 pt-6 border-t space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Free Shipping over $100</p>
                    <p className="text-xs text-muted-foreground">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-xs text-muted-foreground">Free returns & exchanges</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
