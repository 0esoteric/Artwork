"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Store, 
  Mail, 
  CreditCard, 
  Truck, 
  Bell,
  Palette,
  Globe,
  Shield,
  Save,
  ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const settingsSections = [
  { id: "store", label: "Store Details", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "payments", label: "Payments", icon: CreditCard },
]

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("store")
  const [isSaving, setIsSaving] = useState(false)
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: "VELURA",
    storeEmail: "hello@velura.com",
    storePhone: "+91 98765 43210",
    storeAddress: "123, Fashion Street, Mumbai, Maharashtra - 400001",
    currency: "INR",
    taxRate: "18",
    tagline: "Elevate Your Style",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newUserRegistration: true,
    abandonedCart: false,
    promotionalEmails: true,
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "999",
    standardShippingRate: "99",
    expressShippingRate: "199",
    processingTime: "1-2",
    domesticDelivery: "3-5",
    expressDelivery: "1-2",
  })

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure your store preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "store" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
                <CardDescription>
                  Basic information about your clothing store
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
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={storeSettings.tagline}
                      onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                      placeholder="Your brand tagline"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="storeEmail">Contact Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="storePhone">Contact Phone</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxRate">GST Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={storeSettings.taxRate}
                      onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure which emails are sent to customers and admins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="divide-y">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">Order Confirmation</Label>
                      <p className="text-sm text-muted-foreground">Send email when an order is placed</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderConfirmation}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, orderConfirmation: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">Shipping Updates</Label>
                      <p className="text-sm text-muted-foreground">Notify when order is shipped</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderShipped}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, orderShipped: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">Delivery Confirmation</Label>
                      <p className="text-sm text-muted-foreground">Notify when order is delivered</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderDelivered}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, orderDelivered: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert admin when product stock is low</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStockAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, lowStockAlert: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">New Customer Registration</Label>
                      <p className="text-sm text-muted-foreground">Alert when a new user signs up</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newUserRegistration}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newUserRegistration: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">Abandoned Cart Recovery</Label>
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Send reminders for abandoned carts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.abandonedCart}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, abandonedCart: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="font-medium">Promotional Emails</Label>
                      <p className="text-sm text-muted-foreground">Send sale and promotion updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.promotionalEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, promotionalEmails: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Settings
                </CardTitle>
                <CardDescription>
                  Configure shipping rates and delivery options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="freeShipping">Free Shipping Above (Rs.)</Label>
                    <Input
                      id="freeShipping"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Orders above this get free shipping</p>
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
                    <p className="text-xs text-muted-foreground">Time to prepare order</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Shipping Rates</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Standard Delivery</h5>
                          <Badge variant="secondary">{shippingSettings.domesticDelivery} days</Badge>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="standardRate">Rate (Rs.)</Label>
                          <Input
                            id="standardRate"
                            type="number"
                            value={shippingSettings.standardShippingRate}
                            onChange={(e) =>
                              setShippingSettings({ ...shippingSettings, standardShippingRate: e.target.value })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Express Delivery</h5>
                          <Badge variant="secondary">{shippingSettings.expressDelivery} days</Badge>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="expressRate">Rate (Rs.)</Label>
                          <Input
                            id="expressRate"
                            type="number"
                            value={shippingSettings.expressShippingRate}
                            onChange={(e) =>
                              setShippingSettings({ ...shippingSettings, expressShippingRate: e.target.value })
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Settings
                </CardTitle>
                <CardDescription>
                  Configure payment gateways and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Razorpay */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <CreditCard className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium">Razorpay</h4>
                          <p className="text-sm text-muted-foreground">UPI, Cards, Wallets, NetBanking</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-600">Connected</Badge>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="razorpayKey">Key ID</Label>
                        <Input
                          id="razorpayKey"
                          type="password"
                          placeholder="rzp_live_..."
                          defaultValue="rzp_live_xxxxx"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="razorpaySecret">Key Secret</Label>
                        <Input
                          id="razorpaySecret"
                          type="password"
                          placeholder="••••••••••••"
                          defaultValue="secret_xxxxx"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* COD */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Truck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">Cash on Delivery</h4>
                          <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                {/* UPI */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Globe className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                          <h4 className="font-medium">Direct UPI</h4>
                          <p className="text-sm text-muted-foreground">Accept UPI payments directly</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
