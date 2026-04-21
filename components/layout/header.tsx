'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Heart, ShoppingBag, User, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'New Arrivals', href: '/shop?sort=newest' },
  { name: 'Shop', href: '/shop' },
  { 
    name: 'Categories', 
    href: '/shop',
    children: [
      { name: 'T-Shirts', href: '/shop?category=tshirts' },
      { name: 'Shirts', href: '/shop?category=shirts' },
      { name: 'Hoodies', href: '/shop?category=hoodies' },
      { name: 'Jackets', href: '/shop?category=jackets' },
      { name: 'Pants', href: '/shop?category=pants' },
      { name: 'Shorts', href: '/shop?category=shorts' },
      { name: 'Accessories', href: '/shop?category=accessories' },
    ]
  },
  { 
    name: 'Collections', 
    href: '/shop',
    children: [
      { name: 'Summer Essentials', href: '/shop?collection=summer' },
      { name: 'Streetwear', href: '/shop?collection=streetwear' },
      { name: 'Minimalist', href: '/shop?collection=minimalist' },
      { name: 'Vintage', href: '/shop?collection=vintage' },
    ]
  },
  { name: 'Sale', href: '/shop?sale=true' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const itemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())

  useEffect(() => {
    setMounted(true)
    fetchUser()
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b' 
          : 'bg-background'
      )}
    >
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 text-xs tracking-widest uppercase">
        <p>Free Shipping on orders over $150 | New Season Collection Available</p>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left - Mobile menu & Navigation */}
          <div className="flex items-center gap-8">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-left font-serif text-2xl tracking-tight">VELURA</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-3 py-3 text-sm font-medium tracking-wide uppercase transition-colors',
                          pathname === item.href
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.children && (
                        <div className="ml-4 border-l pl-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) => (
                item.children ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className={cn(
                      'flex items-center gap-1 text-xs font-medium tracking-widest uppercase transition-colors hover:text-muted-foreground',
                      pathname.startsWith(item.href) ? 'text-foreground' : 'text-foreground'
                    )}>
                      {item.name}
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.name} asChild>
                          <Link href={child.href} className="w-full text-sm">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-xs font-medium tracking-widest uppercase transition-colors hover:text-muted-foreground',
                      pathname === item.href ? 'text-foreground' : 'text-foreground',
                      item.name === 'Sale' && 'text-red-600 hover:text-red-700'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="text-2xl font-serif font-medium tracking-tight">
              VELURA
            </span>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <div className="max-w-2xl mx-auto py-8">
                  <form 
                    className="relative"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const q = formData.get('q')
                      if (q) {
                        router.push(`/shop?q=${encodeURIComponent(q.toString())}`)
                        setSearchOpen(false)
                      }
                    }}
                  >
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      name="q"
                      placeholder="Search for products..." 
                      className="pl-8 h-12 text-lg border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-foreground"
                      autoFocus
                    />
                  </form>
                  <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
                    <span>Trending:</span>
                    <button onClick={() => { router.push('/shop?q=hoodie'); setSearchOpen(false) }} className="hover:text-foreground transition-colors">Hoodies</button>
                    <button onClick={() => { router.push('/shop?q=jacket'); setSearchOpen(false) }} className="hover:text-foreground transition-colors">Jackets</button>
                    <button onClick={() => { router.push('/shop?q=tshirt'); setSearchOpen(false) }} className="hover:text-foreground transition-colors">T-Shirts</button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" className="relative hover:bg-transparent" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-foreground text-[10px] font-medium text-background flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative hover:bg-transparent" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-foreground text-[10px] font-medium text-background flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {mounted && user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                      <p className="truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-normal">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="font-medium">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Create Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Track Order</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
