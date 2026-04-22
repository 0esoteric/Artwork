"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

function getStatusConfig(status: string) {
  switch (status) {
    case "delivered":
      return { label: "Delivered", icon: CheckCircle, className: "bg-green-50 text-green-700 border-green-200" }
    case "shipped":
      return { label: "Shipped", icon: Truck, className: "bg-blue-50 text-blue-700 border-blue-200" }
    case "processing":
      return { label: "Processing", icon: Package, className: "bg-amber-50 text-amber-700 border-amber-200" }
    case "pending":
      return { label: "Pending", icon: Clock, className: "bg-orange-50 text-orange-700 border-orange-200" }
    default:
      return { label: status, icon: Clock, className: "bg-muted text-muted-foreground" }
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-background rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-background rounded-lg animate-pulse" />
          <div className="h-96 bg-background rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatPrice(data?.stats?.totalRevenue || 0),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      title: "Total Orders",
      value: data?.stats?.totalOrders || 0,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: data?.stats?.totalProducts || 0,
      change: "Active",
      trend: "neutral",
      icon: Package,
      color: "bg-violet-500",
    },
    {
      title: "Customers",
      value: data?.stats?.totalUsers || 0,
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex items-center gap-2">
          {["today", "week", "month"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period === "today" ? "Today" : period === "week" ? "This Week" : "This Month"}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid - Horizontal Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                {stat.trend !== "neutral" && (
                  <div className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Recent Orders</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest customer orders</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y">
            {(data?.recentOrders || []).slice(0, 5).map((order: any) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon
              return (
                <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{order.customer}</p>
                      <span className="text-xs text-muted-foreground">{order.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(order.amount)}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <div className="p-8 text-center">
                <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Products */}
          <Card>
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Top Products</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Best sellers this month</p>
              </div>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="p-4 space-y-4">
              {(data?.topProducts || []).slice(0, 4).map((product: any, index: number) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 relative">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(product.revenue)}</p>
                </div>
              ))}
              {(!data?.topProducts || data.topProducts.length === 0) && (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground text-sm">No sales data yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-xs">Add Product</span>
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">View Orders</span>
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Categories</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Customers</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
