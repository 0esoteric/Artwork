'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CreditCard, Truck, Shield, ChevronLeft, Check, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/cart-store'
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

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export function CheckoutContent() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  
  // Check if user is logged in
  const { data: sessionData, isLoading: isCheckingAuth } = useSWR('/api/auth/session', fetcher)
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: true,
  })

  useEffect(() => {
    setMounted(true)
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')

  if (!mounted || isCheckingAuth) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!sessionData?.user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to complete your purchase.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login?redirect=/checkout">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/signup?redirect=/checkout">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const subtotal = getSubtotal()
  const shipping = subtotal >= 5000 ? 0 : 499
  const total = subtotal + shipping

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate form
    if (!shippingData.firstName || !shippingData.email || !shippingData.phone || 
        !shippingData.address || !shippingData.city || !shippingData.state || !shippingData.pincode) {
      toast.error('Please fill in all required fields')
      return
    }
    setStep('payment')
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      if (paymentMethod === 'razorpay') {
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo',
          amount: total * 100, // Amount in paise
          currency: 'INR',
          name: 'VELURA',
          description: 'Purchase of premium clothing',
          handler: async function (response: RazorpayResponse) {
            // Save order to DB
            const orderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items,
                subtotal,
                shipping,
                total,
                shippingData,
                paymentMethod: 'razorpay',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })

            if (orderRes.ok) {
              const orderData = await orderRes.json()
              clearCart()
              toast.success('Payment successful! Order placed.')
              router.push(`/orders?success=true&order=${orderData.orderNumber}`)
            } else {
              toast.error('Failed to save order. Please contact support.')
            }
          },
          prefill: {
            name: `${shippingData.firstName} ${shippingData.lastName}`,
            email: shippingData.email,
            contact: shippingData.phone,
          },
          theme: {
            color: '#8B4513',
          },
        }

        if (typeof window !== 'undefined' && window.Razorpay) {
          const razorpay = new window.Razorpay(options)
          razorpay.open()
        } else {
          toast.error('Payment gateway not loaded. Please try again.')
        }
      } else {
        // Cash on Delivery
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            subtotal,
            shipping,
            total,
            shippingData,
            paymentMethod: 'cod',
          })
        })

        if (orderRes.ok) {
          const orderData = await orderRes.json()
          clearCart()
          toast.success('Order placed successfully (Cash on Delivery).')
          router.push(`/orders?success=true&order=${orderData.orderNumber}`)
        } else {
          toast.error('Failed to place order. Please try again.')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-serif font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'payment' ? 'bg-primary text-primary-foreground' : step === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            {step === 'payment' ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span className="text-sm font-medium">Shipping</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Main Content */}
        <div>
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={shippingData.firstName}
                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={shippingData.lastName}
                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  value={shippingData.pincode}
                  onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                  placeholder="400001"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Checkbox
                  id="saveAddress"
                  checked={shippingData.saveAddress}
                  onCheckedChange={(checked) => setShippingData({ ...shippingData, saveAddress: checked === true })}
                />
                <Label htmlFor="saveAddress" className="text-sm">
                  Save this address for future orders
                </Label>
              </div>

              <Button type="submit" className="w-full mt-6" size="lg">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === 'payment' && (
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>

              {/* Shipping Summary */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping to:</p>
                    <p className="font-medium">{shippingData.firstName} {shippingData.lastName}</p>
                    <p className="text-sm text-muted-foreground">
                      {shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.pincode}
                    </p>
                    <p className="text-sm text-muted-foreground">{shippingData.phone}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep('shipping')}>
                    Edit
                  </Button>
                </div>
              </div>

              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'razorpay' | 'cod')} 
                className="space-y-4"
              >
                <div className="flex items-center space-x-4 rounded-lg border p-4">
                   <RadioGroupItem value="razorpay" id="razorpay" />
                   <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="font-medium">Online Payment</p>
                         <p className="text-sm text-muted-foreground">
                           Pay with UPI, Cards, Net Banking, Wallets
                         </p>
                       </div>
                       <Shield className="h-6 w-6 text-primary" />
                     </div>
                   </Label>
                 </div>
                 <div className="flex items-center space-x-4 rounded-lg border p-4">
                   <RadioGroupItem value="cod" id="cod" />
                   <Label htmlFor="cod" className="flex-1 cursor-pointer">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="font-medium">Cash on Delivery</p>
                         <p className="text-sm text-muted-foreground">
                           Pay when you receive your order
                         </p>
                       </div>
                       <Truck className="h-6 w-6 text-primary" />
                     </div>
                   </Label>
                 </div>
               </RadioGroup>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  Your payment information is encrypted and secure
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:mt-0">
          <div className="bg-card rounded-lg border p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = PLACEHOLDER_IMAGE
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
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
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>{paymentMethod === 'cod' ? 'Secure order processing' : 'Secure checkout powered by Razorpay'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
