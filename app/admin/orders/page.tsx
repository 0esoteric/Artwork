"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
    },
    items: [
      { name: "Madhubani Peacock Painting", quantity: 1, price: 9500 },
      { name: "Warli Art Frame", quantity: 2, price: 3000 },
    ],
    total: 15500,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "123, MG Road, Bangalore, Karnataka - 560001",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "ORD-2024-002",
    customer: {
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "+91 98765 43211",
    },
    items: [
      { name: "Tanjore Krishna Painting", quantity: 1, price: 30000 },
    ],
    total: 30000,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "456, Park Street, Kolkata, West Bengal - 700016",
    createdAt: "2024-01-14T14:20:00",
  },
  {
    id: "ORD-2024-003",
    customer: {
      name: "Anita Desai",
      email: "anita@example.com",
      phone: "+91 98765 43212",
    },
    items: [
      { name: "Pattachitra Mythological", quantity: 1, price: 15000 },
      { name: "Kalamkari Tree of Life", quantity: 1, price: 7500 },
    ],
    total: 22500,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "789, Marine Drive, Mumbai, Maharashtra - 400002",
    createdAt: "2024-01-13T09:45:00",
  },
  {
    id: "ORD-2024-004",
    customer: {
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "+91 98765 43213",
    },
    items: [
      { name: "Gond Art Elephant", quantity: 1, price: 8000 },
    ],
    total: 8000,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "101, Connaught Place, New Delhi - 110001",
    createdAt: "2024-01-12T16:10:00",
  },
  {
    id: "ORD-2024-005",
    customer: {
      name: "Meera Patel",
      email: "meera@example.com",
      phone: "+91 98765 43214",
    },
    items: [
      { name: "Miniature Mughal Painting", quantity: 1, price: 25000 },
    ],
    total: 25000,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "202, CG Road, Ahmedabad, Gujarat - 380006",
    createdAt: "2024-01-11T11:25:00",
  },
]
const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700" },
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newPaymentStatus, setNewPaymentStatus] = useState("")

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
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

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          payment_status: newPaymentStatus 
        }),
      })
      if (res.ok) {
        setIsStatusDialogOpen(false)
        fetchOrders()
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const openStatusDialog = (order: any) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setNewPaymentStatus(order.payment_status)
    setIsStatusDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length
          const Icon = config.icon
          return (
            <Card key={key} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter(key)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user_name}</p>
                      <p className="text-xs text-muted-foreground">{order.user_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{order.payment_method?.toUpperCase()}</p>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status as keyof typeof statusConfig)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={order.payment_status === "paid" ? "default" : order.payment_status === "refunded" ? "secondary" : "outline"}
                    >
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openOrderDetails(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openStatusDialog(order)}>
                          <Package className="h-4 w-4 mr-2" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Created on {selectedOrder && formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Customer</h4>
                  <p className="font-medium">{selectedOrder.user_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user_email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Shipping Information</h4>
                  <p className="font-medium">{selectedOrder.shipping_name}</p>
                  <p className="text-sm">{selectedOrder.shipping_address}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h4>
                  <p className="text-lg font-bold">{formatPrice(selectedOrder.total)}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                  <p className="font-medium uppercase">{selectedOrder.payment_method}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 pt-4 border-t">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Order Status</h4>
                  {getStatusBadge(selectedOrder.status as keyof typeof statusConfig)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Payment Status</h4>
                  <Badge
                    variant={selectedOrder.payment_status === "paid" ? "default" : selectedOrder.payment_status === "refunded" ? "secondary" : "outline"}
                  >
                    {selectedOrder.payment_status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newStatus">Order Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPaymentStatus">Payment Status</Label>
              <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
