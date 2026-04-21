'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight, Plus, Minus } from 'lucide-react'
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

const navLinks = [
  { name: 'New In', href: '/shop?sort=newest' },
  { name: 'Shop', href: '/shop' },
  { name: 'Sale', href: '/shop?sale=true', highlight: true },
]

const shopCategories = [
  {
    title: 'Clothing',
    items: [
      { name: 'T-Shirts & Tops', href: '/shop?category=tshirts' },
      { name: 'Shirts', href: '/shop?category=shirts' },
      { name: 'Hoodies & Sweatshirts', href: '/shop?category=hoodies' },
      { name: 'Jackets & Coats', href: '/shop?category=jackets' },
      { name: 'Pants & Trousers', href: '/shop?category=pants' },
      { name: 'Shorts', href: '/shop?category=shorts' },
    ]
  },
  {
    title: 'Collections',
    items: [
      { name: 'Summer Essentials', href: '/shop?collection=summer' },
      { name: 'Streetwear', href: '/shop?collection=streetwear' },
      { name: 'Minimalist', href: '/shop?collection=minimalist' },
      { name: 'Premium Line', href: '/shop?collection=premium' },
    ]
  },
  {
    title: 'Accessories',
    items: [
      { name: 'Bags', href: '/shop?category=bags' },
      { name: 'Hats & Caps', href: '/shop?category=hats' },
      { name: 'Belts', href: '/shop?category=belts' },
      { name: 'Socks', href: '/shop?category=socks' },
    ]
  }
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const itemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())

  useEffect(() => {
    setMounted(true)
    fetchUser()
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title)
  }

  return (
    <>
      {/* Main Header - Minimal Bar */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b' 
          : 'bg-transparent'
      )}>
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8">
          {/* Left - Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 flex flex-col justify-center gap-1.5">
              <span className="w-6 h-0.5 bg-foreground transition-all group-hover:w-8" />
              <span className="w-8 h-0.5 bg-foreground" />
              <span className="w-4 h-0.5 bg-foreground transition-all group-hover:w-8" />
            </div>
            <span className="hidden lg:block text-sm font-medium tracking-wide">MENU</span>
          </button>

          {/* Center - Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-xl lg:text-2xl font-serif font-semibold tracking-wider">VELURA</h1>
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <User className="h-5 w-5" />
                </button>
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
            <Link 
              href="/wishlist"
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors relative"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/cart"
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div className={cn(
        'fixed inset-0 z-[100] transition-all duration-500',
        menuOpen ? 'visible' : 'invisible pointer-events-none'
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            'absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-500',
            menuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Panel - Slides from Left */}
        <div className={cn(
          'absolute top-0 left-0 bottom-0 w-full max-w-lg bg-background flex flex-col transition-transform duration-500 ease-out',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {/* Menu Header */}
          <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b">
            <h2 className="text-sm font-medium tracking-widest">MENU</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Primary Links */}
            <div className="py-6 px-6 border-b">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between py-4 text-3xl lg:text-4xl font-serif tracking-wide transition-colors hover:text-muted-foreground',
                    link.highlight && 'text-red-600 hover:text-red-700'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                  <ArrowRight className="h-6 w-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>

            {/* Shop Categories - Accordion Style */}
            <div className="py-4">
              {shopCategories.map((category) => (
                <div key={category.title} className="border-b last:border-b-0">
                  <button
                    onClick={() => toggleSection(category.title)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-sm font-medium tracking-widest uppercase">{category.title}</span>
                    {expandedSection === category.title ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    expandedSection === category.title ? 'max-h-96 pb-4' : 'max-h-0'
                  )}>
                    <div className="px-6 space-y-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Footer */}
          <div className="border-t p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Link href="/about" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/help" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                Help & FAQ
              </Link>
              <Link href="/stores" onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                Find a Store
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground tracking-wide">FREE SHIPPING ON ORDERS OVER $100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={cn(
        'fixed inset-0 z-[100] transition-all duration-300',
        searchOpen ? 'visible' : 'invisible pointer-events-none'
      )}>
        <div 
          className={cn(
            'absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity',
            searchOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setSearchOpen(false)}
        />
        
        {/* Search Panel - Drops from Top */}
        <div className={cn(
          'absolute top-0 left-0 right-0 bg-background transition-transform duration-300',
          searchOpen ? 'translate-y-0' : '-translate-y-full'
        )}>
          <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-4">
              <form
                className="flex-1"
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
                <div className="relative">
                  <Input
                    name="q"
                    placeholder="Search for products..."
                    className="h-14 text-lg pl-14 pr-4 border-0 border-b-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    autoFocus={searchOpen}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Quick Links */}
            <div className="mt-8 pb-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground mb-4">TRENDING</p>
              <div className="flex flex-wrap gap-2">
                {['Summer Collection', 'Hoodies', 'New Arrivals', 'Sale'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/shop?q=${encodeURIComponent(term)}`)
                      setSearchOpen(false)
                    }}
                    className="px-4 py-2 border hover:bg-muted transition-colors text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  )
}
