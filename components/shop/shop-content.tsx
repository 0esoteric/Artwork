'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SlidersHorizontal, X, Heart, Plus, Package, ChevronRight, Grid3X3, LayoutList, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'

const categories = [
  { id: 'all', name: 'All Items', count: 156 },
  { id: 'tshirts', name: 'T-Shirts', count: 42 },
  { id: 'shirts', name: 'Shirts', count: 28 },
  { id: 'hoodies', name: 'Hoodies', count: 35 },
  { id: 'jackets', name: 'Jackets', count: 22 },
  { id: 'pants', name: 'Pants', count: 19 },
  { id: 'shorts', name: 'Shorts', count: 10 },
]

const sizes = [
  { id: 'xs', label: 'XS' },
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
  { id: 'xxl', label: 'XXL' },
]

const colors = [
  { id: 'black', label: 'Black', hex: '#000000' },
  { id: 'white', label: 'White', hex: '#ffffff' },
  { id: 'navy', label: 'Navy', hex: '#1e3a5f' },
  { id: 'gray', label: 'Gray', hex: '#71717a' },
  { id: 'beige', label: 'Beige', hex: '#d4b896' },
  { id: 'olive', label: 'Olive', hex: '#4a5d23' },
  { id: 'burgundy', label: 'Burgundy', hex: '#800020' },
  { id: 'brown', label: 'Brown', hex: '#8b4513' },
]

const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'New Arrivals' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'bestseller', label: 'Best Sellers' },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product, layout }: { product: any; layout: 'grid' | 'list' }) {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isWishlisted = mounted ? isInWishlist(product.id) : false
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({ title: "Removed from wishlist" })
    } else {
      addToWishlist(product)
      toast({ title: "Added to wishlist" })
    }
  }

  if (layout === 'list') {
    return (
      <div className="flex gap-6 py-6 border-b group">
        <Link href={`/product/${product.slug}`} className="relative w-32 h-40 flex-shrink-0 bg-muted overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </Link>
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-medium hover:underline">{product.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{product.category_name || 'Clothing'}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="font-semibold">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
              )}
              {discount && <span className="text-sm font-medium text-red-600">-{discount}%</span>}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button
              size="sm"
              onClick={() => {
                addItem(product)
                toast({ title: "Added to bag" })
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add to Bag
            </Button>
            <button onClick={toggleWishlist} className="p-2 hover:bg-muted transition-colors">
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-foreground")} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                isHovered && "scale-105"
              )}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Sale Badge */}
          {discount && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold">
              SALE
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={cn(
              "absolute top-3 right-3 w-9 h-9 bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-foreground")} />
          </button>

          {/* Quick Add */}
          <div className={cn(
            "absolute bottom-3 left-3 right-3 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <Button
              className="w-full h-11 font-medium"
              onClick={(e) => {
                e.preventDefault()
                addItem(product)
                toast({ title: "Added to bag", description: product.name })
              }}
            >
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium line-clamp-1 group-hover:underline underline-offset-4">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('recommended')

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const q = searchParams.get('q') || ''
      const category = searchParams.get('category') || ''
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (category) params.append('category', category)
      if (activeCategory !== 'all') params.append('category', activeCategory)
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [searchParams, activeCategory, priceRange])

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [filterOpen])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'newest': return b.id - a.id
      default: return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    }
  })

  const activeFiltersCount = (activeCategory !== 'all' ? 1 : 0) + selectedSizes.length + selectedColors.length + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0)

  const clearFilters = () => {
    setActiveCategory('all')
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 500])
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-muted animate-pulse mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-muted animate-pulse" />
                <div className="h-4 w-3/4 bg-muted animate-pulse" />
                <div className="h-4 w-1/2 bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Breadcrumb & Title */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Shop</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif">
                  {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
                </h1>
                <p className="text-muted-foreground mt-2">{sortedProducts.length} items</p>
              </div>
              
              {/* Desktop Category Tabs */}
              <div className="hidden lg:flex items-center gap-1 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 text-sm whitespace-nowrap transition-all border-b-2",
                      activeCategory === cat.id
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 lg:top-20 z-40 bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="h-14 flex items-center justify-between">
              {/* Filter Button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-transparent border-0 focus:ring-0 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>

                {/* Layout Toggle */}
                <div className="hidden lg:flex items-center border-l pl-4">
                  <button
                    onClick={() => setLayout('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      layout === 'grid' ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={cn(
                      "p-2 transition-colors",
                      layout === 'list' ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-xl font-serif mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : layout === 'list' ? (
            <div className="max-w-3xl">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-[100] transition-all duration-300",
        filterOpen ? "visible" : "invisible pointer-events-none"
      )}>
        <div
          className={cn(
            "absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity",
            filterOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setFilterOpen(false)}
        />

        {/* Sidebar Panel */}
        <div className={cn(
          "absolute top-0 right-0 bottom-0 w-full max-w-md bg-background overflow-y-auto transition-transform duration-300",
          filterOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Header */}
          <div className="sticky top-0 bg-background z-10 flex items-center justify-between h-16 px-6 border-b">
            <h2 className="font-medium">Filters</h2>
            <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Category - Radio Style List */}
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Category</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between py-3 px-4 text-left transition-colors",
                      activeCategory === cat.id ? "bg-foreground text-background" : "hover:bg-muted"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className="text-sm opacity-60">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size - Grid Style */}
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setSelectedSizes(
                        selectedSizes.includes(size.id)
                          ? selectedSizes.filter(s => s !== size.id)
                          : [...selectedSizes, size.id]
                      )
                    }}
                    className={cn(
                      "h-12 border text-sm font-medium transition-all relative",
                      selectedSizes.includes(size.id)
                        ? "border-foreground bg-foreground text-background"
                        : "hover:border-foreground"
                    )}
                  >
                    {size.label}
                    {selectedSizes.includes(size.id) && (
                      <Check className="absolute top-1 right-1 h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color - Circle Swatches */}
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColors(
                        selectedColors.includes(color.id)
                          ? selectedColors.filter(c => c !== color.id)
                          : [...selectedColors, color.id]
                      )
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                        selectedColors.includes(color.id) ? "border-foreground scale-110" : "border-transparent"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - Slider */}
            <div>
              <h3 className="text-sm font-medium tracking-wider uppercase mb-4">Price Range</h3>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-background border-t p-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => setFilterOpen(false)}>
              View Results
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
