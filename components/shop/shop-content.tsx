'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SlidersHorizontal, Grid2X2, LayoutGrid, Heart, ShoppingBag, X, ChevronDown, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'

// Clothing categories
const categories = ['All', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories']

// Clothing sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Colors
const colors = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Navy', value: 'navy', hex: '#1e3a5f' },
  { name: 'Gray', value: 'gray', hex: '#6b7280' },
  { name: 'Beige', value: 'beige', hex: '#d4c4b0' },
  { name: 'Olive', value: 'olive', hex: '#556b2f' },
]

// Price ranges
const priceRanges = [
  { label: 'All Prices', min: 0, max: 1000 },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: 1000 },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product, viewMode }: { product: any; viewMode: 'grid' | 'large' }) {
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
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({ title: "Removed from Wishlist" })
    } else {
      addToWishlist(product)
      toast({ title: "Added to Wishlist" })
    }
  }

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  if (viewMode === 'large') {
    return (
      <div className="group">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            
            {/* Badges */}
            {discount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5">
                -{discount}%
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={toggleWishlist}
                className="w-10 h-10 bg-background flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-foreground")} />
              </button>
            </div>

            {/* Add to Bag */}
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <Button 
                className="w-full h-12 gap-2"
                onClick={(e) => {
                  e.preventDefault()
                  addItem(product)
                  toast({ title: "Added to Bag", description: product.name })
                }}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </Button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="mt-4">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-base hover:underline underline-offset-4 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {product.category_name || 'Clothing'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Compact grid view
  return (
    <div className="group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          
          {discount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1">
              -{discount}%
            </div>
          )}

          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-foreground")} />
          </button>
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium hover:underline underline-offset-4 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compare_price)}
            </span>
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
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('large')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const q = searchParams.get('q') || ''
      const category = searchParams.get('category') || ''
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (category) params.append('category', category)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      params.append('minPrice', selectedPriceRange.min.toString())
      params.append('maxPrice', selectedPriceRange.max.toString())

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams, selectedCategory, selectedPriceRange])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      const formattedCat = category.charAt(0).toUpperCase() + category.slice(1)
      if (categories.some(c => c.toLowerCase() === category.toLowerCase())) {
        setSelectedCategory(formattedCat)
      }
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
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    }
  })

  const clearAllFilters = () => {
    setSelectedCategory('All')
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedPriceRange(priceRanges[0])
  }

  const activeFilterCount = 
    (selectedCategory !== 'All' ? 1 : 0) + 
    selectedSizes.length + 
    selectedColors.length + 
    (selectedPriceRange !== priceRanges[0] ? 1 : 0)

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <div className="h-10 w-48 bg-muted animate-pulse mb-8" />
          <div className="h-14 bg-muted animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-muted/30 py-12 mb-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-muted-foreground">
            {sortedProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pb-20">
        {/* Horizontal Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b mb-8">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                Category
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={selectedCategory === cat}
                  onCheckedChange={() => setSelectedCategory(cat)}
                >
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Size Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                Size
                {selectedSizes.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                    {selectedSizes.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {sizes.map((size) => (
                <DropdownMenuCheckboxItem
                  key={size}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSizes([...selectedSizes, size])
                    } else {
                      setSelectedSizes(selectedSizes.filter(s => s !== size))
                    }
                  }}
                >
                  {size}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Color Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                Color
                {selectedColors.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                    {selectedColors.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {colors.map((color) => (
                <DropdownMenuCheckboxItem
                  key={color.value}
                  checked={selectedColors.includes(color.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedColors([...selectedColors, color.value])
                    } else {
                      setSelectedColors(selectedColors.filter(c => c !== color.value))
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                Price
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {priceRanges.map((range) => (
                <DropdownMenuCheckboxItem
                  key={range.label}
                  checked={selectedPriceRange === range}
                  onCheckedChange={() => setSelectedPriceRange(range)}
                >
                  {range.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all ({activeFilterCount})
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border divide-x">
            <button
              onClick={() => setViewMode('large')}
              className={cn(
                'p-2.5 transition-colors',
                viewMode === 'large' ? 'bg-foreground text-background' : 'hover:bg-muted'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2.5 transition-colors',
                viewMode === 'grid' ? 'bg-foreground text-background' : 'hover:bg-muted'
              )}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSizes.map(size => (
              <Badge key={size} variant="secondary" className="gap-1 px-3 py-1.5">
                Size: {size}
                <button onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedColors.map(color => (
              <Badge key={color} variant="secondary" className="gap-1 px-3 py-1.5 capitalize">
                {color}
                <button onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedPriceRange !== priceRanges[0] && (
              <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                {selectedPriceRange.label}
                <button onClick={() => setSelectedPriceRange(priceRanges[0])}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={cn(
            'grid gap-6',
            viewMode === 'large' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          )}>
            {sortedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
