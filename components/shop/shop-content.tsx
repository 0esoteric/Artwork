'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, Heart, ShoppingBag, X, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

// Mock products data
const allProducts = [
  {
    id: 1,
    name: 'Tree of Life in Madhubani',
    slug: 'tree-of-life-madhubani',
    price: 15000,
    comparePrice: 18000,
    artist: 'Ambika Devi',
    artForm: 'Madhubani',
    dimensions: '24 in X 36 in',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    isReadyToShip: true,
    isBestseller: true,
    category: 'paintings',
  },
  {
    id: 2,
    name: 'Dancing Peacocks in Gond',
    slug: 'dancing-peacocks-gond',
    price: 12000,
    comparePrice: null,
    artist: 'Sandeep Dhurve',
    artForm: 'Gond',
    dimensions: '20 in X 30 in',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 3,
    name: 'Village Life Warli',
    slug: 'village-life-warli',
    price: 8500,
    comparePrice: 10000,
    artist: 'Dilip Bahotha',
    artForm: 'Warli',
    dimensions: '18 in X 24 in',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 4,
    name: 'Krishna Leela Pichwai',
    slug: 'krishna-leela-pichwai',
    price: 45000,
    comparePrice: 52000,
    artist: 'Master Artist',
    artForm: 'Pichwai',
    dimensions: '36 in X 48 in',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
    isReadyToShip: false,
    isBestseller: true,
    category: 'paintings',
  },
  {
    id: 5,
    name: 'Mythological Kalamkari',
    slug: 'mythological-kalamkari',
    price: 28000,
    comparePrice: null,
    artist: 'Harinath N',
    artForm: 'Kalamkari',
    dimensions: '30 in X 40 in',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 6,
    name: 'Durga in Pattachitra',
    slug: 'durga-pattachitra',
    price: 35000,
    comparePrice: 40000,
    artist: 'Gitanjali Das',
    artForm: 'Pattachitra',
    dimensions: '28 in X 38 in',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80',
    isReadyToShip: true,
    isBestseller: true,
    category: 'paintings',
  },
  {
    id: 7,
    name: 'Fish Motif Madhubani',
    slug: 'fish-motif-madhubani',
    price: 5500,
    comparePrice: 6500,
    artist: 'Ambika Devi',
    artForm: 'Madhubani',
    dimensions: '12 in X 16 in',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 8,
    name: 'Elephant Gond Art',
    slug: 'elephant-gond-art',
    price: 18000,
    comparePrice: 22000,
    artist: 'Sandeep Dhurve',
    artForm: 'Gond',
    dimensions: '24 in X 30 in',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    isReadyToShip: false,
    isBestseller: true,
    category: 'paintings',
  },
  {
    id: 9,
    name: 'Sacred Lotus Warli',
    slug: 'sacred-lotus-warli',
    price: 6000,
    comparePrice: null,
    artist: 'Dilip Bahotha',
    artForm: 'Warli',
    dimensions: '14 in X 18 in',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 10,
    name: 'Radha Krishna Pichwai',
    slug: 'radha-krishna-pichwai',
    price: 55000,
    comparePrice: 65000,
    artist: 'Master Artist',
    artForm: 'Pichwai',
    dimensions: '40 in X 52 in',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
    isReadyToShip: false,
    isBestseller: true,
    category: 'paintings',
  },
  {
    id: 11,
    name: 'Wildlife Kalamkari',
    slug: 'wildlife-kalamkari',
    price: 22000,
    comparePrice: null,
    artist: 'Harinath N',
    artForm: 'Kalamkari',
    dimensions: '24 in X 32 in',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
    isReadyToShip: true,
    isBestseller: false,
    category: 'paintings',
  },
  {
    id: 12,
    name: 'Divine Ganesha Pattachitra',
    slug: 'ganesha-pattachitra',
    price: 42000,
    comparePrice: 48000,
    artist: 'Gitanjali Das',
    artForm: 'Pattachitra',
    dimensions: '32 in X 42 in',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80',
    isReadyToShip: true,
    isBestseller: true,
    category: 'paintings',
  },
]

const artForms = ['Madhubani', 'Warli', 'Gond', 'Kalamkari', 'Pichwai', 'Pattachitra']
const priceRanges = [
  { label: 'Under Rs. 5,000', min: 0, max: 5000 },
  { label: 'Rs. 5,000 - Rs. 10,000', min: 5000, max: 10000 },
  { label: 'Rs. 10,000 - Rs. 25,000', min: 10000, max: 25000 },
  { label: 'Rs. 25,000 - Rs. 50,000', min: 25000, max: 50000 },
  { label: 'Above Rs. 50,000', min: 50000, max: 999999 },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'

function ProductCard({ product }: { product: typeof allProducts[0] }) {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const isWishlisted = mounted ? isInWishlist(product.id) : false
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been saved.`,
      })
    }
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isReadyToShip && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              Ready to Ship
            </Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Bestseller
            </Badge>
          )}
          {discount && (
            <Badge variant="secondary" className="text-xs">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-9 w-9 rounded-full shadow-md"
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-destructive text-destructive")} />
            <span className="sr-only">
              {mounted ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') : 'Add to wishlist'}
            </span>
          </Button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <Button 
            className="w-full gap-2"
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
              toast({
                title: "Added to Cart",
                description: `${product.name} has been added to your cart.`,
              })
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-primary font-medium uppercase tracking-wider">
          {product.artForm}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          by {product.artist}
        </p>
        <p className="text-xs text-muted-foreground">
          {product.dimensions}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSidebar({ 
  selectedArtForms, 
  setSelectedArtForms, 
  priceRange, 
  setPriceRange,
  readyToShip,
  setReadyToShip 
}: {
  selectedArtForms: string[]
  setSelectedArtForms: (forms: string[]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  readyToShip: boolean
  setReadyToShip: (value: boolean) => void
}) {
  const toggleArtForm = (form: string) => {
    if (selectedArtForms.includes(form)) {
      setSelectedArtForms(selectedArtForms.filter(f => f !== form))
    } else {
      setSelectedArtForms([...selectedArtForms, form])
    }
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['artform', 'price', 'availability']}>
        {/* Art Form Filter */}
        <AccordionItem value="artform">
          <AccordionTrigger className="text-base font-semibold">Art Form</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {artForms.map((form) => (
                <div key={form} className="flex items-center space-x-3">
                  <Checkbox 
                    id={form} 
                    checked={selectedArtForms.includes(form)}
                    onCheckedChange={() => toggleArtForm(form)}
                  />
                  <Label htmlFor={form} className="text-sm cursor-pointer">
                    {form}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-6">
              <Slider
                value={priceRange}
                min={0}
                max={100000}
                step={1000}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability Filter */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-base font-semibold">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="ready-to-ship" 
                  checked={readyToShip}
                  onCheckedChange={(checked) => setReadyToShip(checked === true)}
                />
                <Label htmlFor="ready-to-ship" className="text-sm cursor-pointer">
                  Ready to Ship
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedArtForms, setSelectedArtForms] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [readyToShip, setReadyToShip] = useState(false)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const q = searchParams.get('q') || ''
      const artform = searchParams.get('artform') || ''
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (artform) params.append('artForm', artform)
      if (selectedArtForms.length > 0) params.append('artForm', selectedArtForms[0])
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())
      if (readyToShip) params.append('readyToShip', 'true')

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [searchParams, selectedArtForms, priceRange, readyToShip])

  // Initialize filters from URL params
  useEffect(() => {
    const artform = searchParams.get('artform')
    if (artform) {
      setSelectedArtForms([artform.charAt(0).toUpperCase() + artform.slice(1)])
    }
    const rts = searchParams.get('ready_to_ship')
    if (rts === 'true') {
      setReadyToShip(true)
    }
  }, [searchParams])

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return b.id - a.id
      default:
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)
    }
  })

  const clearFilters = () => {
    setSelectedArtForms([])
    setPriceRange([0, 100000])
    setReadyToShip(false)
  }

  const hasActiveFilters = selectedArtForms.length > 0 || priceRange[0] > 0 || priceRange[1] < 100000 || readyToShip || searchParams.get('q')

  if (isLoading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-8" />
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="hidden lg:block h-96 bg-muted animate-pulse rounded" />
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Shop All Artworks</h1>
        <p className="text-muted-foreground">
          Discover authentic handmade artworks from master artisans across India
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b">
        <div className="flex flex-1 items-center gap-4">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  selectedArtForms={selectedArtForms}
                  setSelectedArtForms={setSelectedArtForms}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  readyToShip={readyToShip}
                  setReadyToShip={setReadyToShip}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative flex-1 max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const q = formData.get('shop-search')
              const params = new URLSearchParams(searchParams.toString())
              if (q) params.set('q', q.toString())
              else params.delete('q')
              window.history.pushState(null, '', `?${params.toString()}`)
              fetchProducts() // Re-fetch
            }}>
              <Input
                name="shop-search"
                placeholder="Search artworks..."
                defaultValue={searchParams.get('q') || ''}
                className="pl-10"
              />
            </form>
          </div>

          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {sortedProducts.length} products
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="hidden sm:flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-none', viewMode === 'grid' && 'bg-muted')}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-none', viewMode === 'list' && 'bg-muted')}
              onClick={() => setViewMode('list')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {selectedArtForms.map((form) => (
            <Badge key={form} variant="secondary" className="gap-1">
              {form}
              <button onClick={() => setSelectedArtForms(selectedArtForms.filter(f => f !== form))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 100000) && (
            <Badge variant="secondary" className="gap-1">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <button onClick={() => setPriceRange([0, 100000])}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {readyToShip && (
            <Badge variant="secondary" className="gap-1">
              Ready to Ship
              <button onClick={() => setReadyToShip(false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </h2>
            <FilterSidebar
              selectedArtForms={selectedArtForms}
              setSelectedArtForms={setSelectedArtForms}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              readyToShip={readyToShip}
              setReadyToShip={setReadyToShip}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
            )}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
