'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronRight, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { cn } from '@/lib/utils'

const categories = [
  {
    name: 'Men',
    href: '/shop?gender=men',
    featured: [
      { name: 'New Arrivals', href: '/shop?gender=men&sort=newest', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80' },
      { name: 'Best Sellers', href: '/shop?gender=men&featured=true', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80' },
    ],
    links: [
      { name: 'T-Shirts', href: '/shop?gender=men&category=tshirts' },
      { name: 'Shirts', href: '/shop?gender=men&category=shirts' },
      { name: 'Hoodies', href: '/shop?gender=men&category=hoodies' },
      { name: 'Jackets', href: '/shop?gender=men&category=jackets' },
      { name: 'Pants', href: '/shop?gender=men&category=pants' },
      { name: 'Shorts', href: '/shop?gender=men&category=shorts' },
    ],
  },
  {
    name: 'Women',
    href: '/shop?gender=women',
    featured: [
      { name: 'New Arrivals', href: '/shop?gender=women&sort=newest', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
      { name: 'Best Sellers', href: '/shop?gender=women&featured=true', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80' },
    ],
    links: [
      { name: 'Tops', href: '/shop?gender=women&category=tops' },
      { name: 'Dresses', href: '/shop?gender=women&category=dresses' },
      { name: 'Jackets', href: '/shop?gender=women&category=jackets' },
      { name: 'Pants', href: '/shop?gender=women&category=pants' },
      { name: 'Skirts', href: '/shop?gender=women&category=skirts' },
      { name: 'Activewear', href: '/shop?gender=women&category=activewear' },
    ],
  },
  {
    name: 'Collections',
    href: '/shop',
    featured: [
      { name: 'Summer 2026', href: '/shop?collection=summer', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80' },
      { name: 'Streetwear', href: '/shop?collection=streetwear', image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80' },
    ],
    links: [
      { name: 'Minimalist', href: '/shop?collection=minimalist' },
      { name: 'Vintage', href: '/shop?collection=vintage' },
      { name: 'Athletic', href: '/shop?collection=athletic' },
      { name: 'Casual', href: '/shop?collection=casual' },
      { name: 'Formal', href: '/shop?collection=formal' },
      { name: 'Limited Edition', href: '/shop?collection=limited' },
    ],
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
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
      setIsScrolled(window.scrollY > 0)
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
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background shadow-sm' : 'bg-background'
      )}>
        {/* Top Bar */}
        <div className="bg-foreground text-background">
          <div className="max-w-[1400px] mx-auto px-6 h-9 flex items-center justify-between text-xs">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/stores" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <MapPin className="h-3.5 w-3.5" />
                Find a Store
              </Link>
              <Link href="/contact" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <Phone className="h-3.5 w-3.5" />
                1-800-THREADS
              </Link>
            </div>
            <p className="font-medium tracking-wide">FREE SHIPPING ON ORDERS OVER $100</p>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/help" className="hover:opacity-70 transition-opacity">Help</Link>
              <Link href="/orders" className="hover:opacity-70 transition-opacity">Track Order</Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="h-16 flex items-center justify-between gap-8">
              {/* Logo - Left */}
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-black tracking-tighter">THREADS</h1>
              </Link>

              {/* Center Navigation - Desktop */}
              <nav className="hidden lg:flex items-center gap-1">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(category.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <Link
                      href={category.href}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors hover:text-muted-foreground',
                        activeCategory === category.name && 'text-muted-foreground'
                      )}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
                <Link
                  href="/shop?sale=true"
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Sale
                </Link>
              </nav>

              {/* Search - Desktop */}
              <div className="hidden lg:flex flex-1 max-w-md">
                <form
                  className="relative w-full"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const q = formData.get('q')
                    if (q) {
                      router.push(`/shop?q=${encodeURIComponent(q.toString())}`)
                    }
                  }}
                >
                  <Input
                    name="q"
                    placeholder="Search products..."
                    className="w-full h-10 pl-10 pr-4 bg-muted/50 border-0 rounded-full focus-visible:ring-1 focus-visible:ring-foreground"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1">
                {/* Mobile Search Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Account */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {mounted && user ? (
                      <>
                        <div className="px-3 py-3 border-b">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href="/orders" className="cursor-pointer">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/wishlist" className="cursor-pointer">Wishlist</Link>
                        </DropdownMenuItem>
                        {user.role === 'admin' && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer font-medium">Admin Dashboard</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                          Sign Out
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/login" className="cursor-pointer">Sign In</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/register" className="cursor-pointer">Create Account</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Wishlist */}
                <Button variant="ghost" size="icon" className="h-10 w-10 relative" asChild>
                  <Link href="/wishlist">
                    <Heart className="h-5 w-5" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>

                {/* Cart */}
                <Button variant="ghost" size="icon" className="h-10 w-10 relative" asChild>
                  <Link href="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {mounted && itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menu - Desktop */}
        {categories.map((category) => (
          <div
            key={category.name}
            className={cn(
              'absolute left-0 right-0 bg-background border-b shadow-lg transition-all duration-200 hidden lg:block',
              activeCategory === category.name ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            )}
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="max-w-[1400px] mx-auto px-6 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Links */}
                <div className="col-span-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Shop {category.name}
                  </h3>
                  <ul className="space-y-3">
                    {category.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm hover:underline underline-offset-4"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={category.href}
                    className="inline-flex items-center gap-1 text-sm font-medium mt-6 hover:underline underline-offset-4"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Featured Images */}
                <div className="col-span-8 grid grid-cols-2 gap-6">
                  {category.featured.map((item) => (
                    <Link key={item.name} href={item.href} className="group relative">
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-background font-medium">{item.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Search */}
        <div className={cn(
          'lg:hidden border-b bg-background overflow-hidden transition-all duration-300',
          searchOpen ? 'max-h-20' : 'max-h-0'
        )}>
          <div className="px-6 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const q = formData.get('mobile-q')
                if (q) {
                  router.push(`/shop?q=${encodeURIComponent(q.toString())}`)
                  setSearchOpen(false)
                }
              }}
            >
              <Input
                name="mobile-q"
                placeholder="Search products..."
                className="w-full h-10"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-300',
        mobileMenuOpen ? 'visible' : 'invisible'
      )}>
        <div
          className={cn(
            'absolute inset-0 bg-foreground/50 transition-opacity',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={cn(
          'absolute top-0 left-0 bottom-0 w-full max-w-sm bg-background overflow-y-auto transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tighter">THREADS</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-6">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    href={category.href}
                    className="text-lg font-medium block mb-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <ul className="space-y-2 pl-4 border-l-2 border-muted">
                    {category.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link
                href="/shop?sale=true"
                className="text-lg font-medium text-red-600 block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t space-y-3">
              <Link
                href="/stores"
                className="flex items-center gap-3 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="h-4 w-4" />
                Find a Store
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[100px]" />
    </>
  )
}
