"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  LogOut,
  ChevronDown,
  FolderOpen,
  Tags,
  Search,
  Bell,
  X,
  Layers,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mainNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Customers", icon: Users },
]

const quickStats = [
  { label: "Today Sales", value: "12,450", trend: "+12%" },
  { label: "Orders", value: "48", trend: "+8%" },
  { label: "Visitors", value: "1,294", trend: "+23%" },
]

function TopNavigation() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-foreground text-background">
      {/* Top Bar */}
      <div className="border-b border-background/10">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-background text-foreground flex items-center justify-center font-bold text-sm">
              V
            </div>
            <span className="font-semibold tracking-wide hidden sm:block">VELURA ADMIN</span>
          </Link>

          {/* Quick Stats - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-background/60 text-xs uppercase tracking-wider">{stat.label}</span>
                <span className="font-semibold">{stat.value}</span>
                <span className="text-xs text-green-400">{stat.trend}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-background/70 hover:text-background hover:bg-background/10"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-background/70 hover:text-background hover:bg-background/10 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <div className="p-3 text-sm text-muted-foreground">
                  <p>3 new orders received</p>
                  <p className="text-xs mt-1">2 minutes ago</p>
                </div>
                <div className="p-3 text-sm text-muted-foreground border-t">
                  <p>Low stock alert: Classic White Tee</p>
                  <p className="text-xs mt-1">1 hour ago</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-background/70 hover:text-background hover:bg-background/10 gap-2"
                >
                  <div className="h-7 w-7 rounded-full bg-background/20 flex items-center justify-center">
                    <span className="text-xs font-medium">AD</span>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="text-muted-foreground">
                    <LogOut className="h-4 w-4 mr-2" />
                    Exit Admin
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        {searchOpen && (
          <div className="px-4 lg:px-6 pb-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/40" />
              <Input
                placeholder="Search products, orders, customers..."
                className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/30"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 px-4 lg:px-6 overflow-x-auto scrollbar-hide">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                isActive
                  ? "border-background text-background"
                  : "border-transparent text-background/60 hover:text-background hover:border-background/30"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ml-auto",
            pathname === "/admin/settings"
              ? "border-background text-background"
              : "border-transparent text-background/60 hover:text-background hover:border-background/30"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <nav className="flex items-center justify-around py-2">
        {mainNavItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          )
        })}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-1 p-2 text-xs text-muted-foreground">
              <Menu className="h-5 w-5" />
              <span>More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <div className="grid grid-cols-3 gap-4 py-4">
              {[...mainNavItems.slice(4), { href: "/admin/settings", label: "Settings", icon: Settings }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <LogOut className="h-6 w-6" />
                <span className="text-sm">Exit</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Top Navigation */}
      <div className="hidden lg:block">
        <TopNavigation />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-foreground text-background">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-7 w-7 bg-background text-foreground flex items-center justify-center font-bold text-xs">
              V
            </div>
            <span className="font-semibold text-sm">VELURA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-background/70 hover:text-background hover:bg-background/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-background/70 hover:text-background hover:bg-background/10 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-6 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
