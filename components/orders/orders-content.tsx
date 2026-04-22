'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'



function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-100' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-600 bg-blue-100' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-600 bg-purple-100' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-100' },
}

export function OrdersContent() {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-muted rounded mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-card rounded-lg border" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {isSuccess && (
        <div className="mb-8 p-6 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-4">
            <PartyPopper className="h-10 w-10 text-accent" />
            <div>
              <h2 className="text-xl font-semibold text-accent">Order Placed Successfully!</h2>
              <p className="text-muted-foreground">
                Thank you for your purchase. You will receive a confirmation email shortly.
                {searchParams.get('order') && (
                  <span className="block mt-1 font-medium">Order: {searchParams.get('order')}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">My Orders</h1>
        <Button asChild variant="outline">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start exploring our collection of premium clothing
          </p>
          <Button asChild>
            <Link href="/shop">Browse Collection</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <div key={order.id} className="bg-card rounded-lg border overflow-hidden">
                {/* Order Header */}
                <div className="p-4 bg-muted/50 border-b flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Order ID:</span>{' '}
                      <span className="font-medium">{order.order_number}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>{' '}
                      <span className="font-medium">{formatDate(order.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>{' '}
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <Badge className={cn('gap-1', status.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Order Items Summary */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items && order.items.length > 0 ? (
                        order.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={item.id} className="relative w-12 h-12 rounded-lg bg-muted border-2 border-card overflow-hidden" style={{ zIndex: 3 - idx }}>
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border-2 border-card">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      {order.items && order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border-2 border-card text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {order.item_count || order.items?.length || 0} {(order.item_count || order.items?.length || 0) === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Payment: <span className="uppercase">{order.payment_method}</span> ({order.payment_status})
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 text-sm pt-4 border-t">
                    <span className="text-muted-foreground">Shipping to:</span>{' '}
                    <span className="font-medium">{order.shipping_name}</span>
                    <p className="text-xs text-muted-foreground ml-[72px]">{order.shipping_address}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
