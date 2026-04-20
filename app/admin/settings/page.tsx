"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Mail, CreditCard, Truck, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Artisan Gallery",
    storeEmail: "hello@artisangallery.com",
    storePhone: "+91 98765 43210",
    storeAddress: "123, MG Road, Bangalore, Karnataka - 560001",
    currency: "INR",
    taxRate: "18",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newUserRegistration: true,
    abandonedCart: false,
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "2000",
    standardShippingRate: "150",
    expressShippingRate: "350",
    processingTime: "2-3",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="store" className="gap-2 py-3">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-3">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2 py-3">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 py-3">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store that appears across the website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-2 sm:w-1/2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which email notifications are sent to customers and admins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email when an order is placed
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderConfirmation}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, orderConfirmation: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Shipped</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify customer when order is shipped
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderShipped}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, orderShipped: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Delivered</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify customer when order is delivered
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderDelivered}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, orderDelivered: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert admin when product stock is low
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlert}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, lowStockAlert: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert admin when a new user registers
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newUserRegistration}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, newUserRegistration: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Abandoned Cart</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminder for abandoned carts
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.abandonedCart}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, abandonedCart: checked })
                    }
                  />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping rates and delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="freeShipping">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Orders above this amount get free shipping
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="processingTime">Processing Time (days)</Label>
                  <Input
                    id="processingTime"
                    value={shippingSettings.processingTime}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, processingTime: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Time to prepare order for shipping
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="standardShipping">Standard Shipping Rate (₹)</Label>
                  <Input
                    id="standardShipping"
                    type="number"
                    value={shippingSettings.standardShippingRate}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, standardShippingRate: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    5-7 business days delivery
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expressShipping">Express Shipping Rate (₹)</Label>
                  <Input
                    id="expressShipping"
                    type="number"
                    value={shippingSettings.expressShippingRate}
                    onChange={(e) =>
                      setShippingSettings({ ...shippingSettings, expressShippingRate: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    2-3 business days delivery
                  </p>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment gateways and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <CreditCard className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">Razorpay</h4>
                      <p className="text-sm text-muted-foreground">Accept UPI, Cards, Wallets</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                    <Input
                      id="razorpayKey"
                      type="password"
                      placeholder="rzp_test_..."
                      defaultValue="rzp_test_xxxxx"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="razorpaySecret">Razorpay Key Secret</Label>
                    <Input
                      id="razorpaySecret"
                      type="password"
                      placeholder="••••••••••••"
                      defaultValue="secret_xxxxx"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cash on Delivery</h4>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
