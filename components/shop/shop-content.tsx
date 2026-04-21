'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Filter, SlidersHorizontal, Grid3X3, LayoutGrid, Heart, ShoppingBag, X, Search, Package } from 'lucide-react'
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
import { useCartStore } from '@/lib/cart-store'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useToast } from '@/hooks/use-toast'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

// Clothing categories
const categories = ['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories']

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

// Styles
const styles = ['Streetwear', 'Minimalist', 'Casual', 'Vintage', 'Athletic']

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function ProductCard({ product }: { product: any }) {
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

  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = PLACEHOLDER_IMAGE
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_ready_to_ship && (
            <Badge className="bg-foreground text-background text-xs rounded-none px-2">
              In Stock
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-foreground text-background text-xs rounded-none px-2">
              New
            </Badge>
          )}
          {discount && (
            <Badge className="bg-red-600 text-white text-xs rounded-none px-2">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-9 w-9 rounded-none bg-background/90 hover:bg-background"
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-foreground")} />
            <span className="sr-only">
              {mounted ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') : 'Add to wishlist'}
            </span>
          </Button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <Button 
            className="w-full gap-2 rounded-none"
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
              toast({
                title: "Added to Bag",
                description: `${product.name} has been added to your bag.`,
              })
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Bag
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-foreground hover:underline underline-offset-4 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          {product.category_name || 'Clothing'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
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

function FilterSidebar({ 
  selectedCategories, 
  setSelectedCategories, 
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  selectedStyles,
  setSelectedStyles,
  priceRange, 
  setPriceRange,
  inStock,
  setInStock 
}: {
  selectedCategories: string[]
  setSelectedCategories: (cats: string[]) => void
  selectedSizes: string[]
  setSelectedSizes: (sizes: string[]) => void
  selectedColors: string[]
  setSelectedColors: (colors: string[]) => void
  selectedStyles: string[]
  setSelectedStyles: (styles: string[]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  inStock: boolean
  setInStock: (value: boolean) => void
}) {
  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style))
    } else {
      setSelectedStyles([...selectedStyles, style])
    }
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'size', 'color', 'style', 'price', 'availability']}>
        {/* Category Filter */}
        <AccordionItem value="category" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pb-4">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-3">
                  <Checkbox 
                    id={cat} 
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="rounded-none"
                  />
                  <Label htmlFor={cat} className="text-sm cursor-pointer font-normal">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pb-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    'px-3 py-2 text-xs border transition-colors',
                    selectedSizes.includes(size)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-foreground border-border hover:border-foreground'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 pb-4">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => toggleColor(color.value)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    selectedColors.includes(color.value)
                      ? 'ring-2 ring-offset-2 ring-foreground'
                      : 'ring-0'
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Style Filter */}
        <AccordionItem value="style" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Style</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pb-4">
              {styles.map((style) => (
                <div key={style} className="flex items-center space-x-3">
                  <Checkbox 
                    id={style} 
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={() => toggleStyle(style)}
                    className="rounded-none"
                  />
                  <Label htmlFor={style} className="text-sm cursor-pointer font-normal">
                    {style}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Price</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={500}
                step={10}
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
        <AccordionItem value="availability" className="border-b">
          <AccordionTrigger className="text-sm font-medium tracking-wide uppercase py-4">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pb-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="in-stock" 
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(checked === true)}
                  className="rounded-none"
                />
                <Label htmlFor="in-stock" className="text-sm cursor-pointer font-normal">
                  In Stock Only
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [inStock, setInStock] = useState(false)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const q = searchParams.get('q') || ''
      const category = searchParams.get('category') || ''
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (category) params.append('category', category)
      if (selectedCategories.length > 0) params.append('category', selectedCategories[0])
      params.append('minPrice', priceRange[0].toString())
      params.append('maxPrice', priceRange[1].toString())
      if (inStock) params.append('inStock', 'true')

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
  }, [searchParams, selectedCategories, priceRange, inStock])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      const formattedCat = category.charAt(0).toUpperCase() + category.slice(1)
      if (categories.some(c => c.toLowerCase() === category.toLowerCase())) {
        setSelectedCategories([formattedCat])
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

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedStyles([])
    setPriceRange([0, 500])
    setInStock(false)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0 || selectedStyles.length > 0 || priceRange[0] > 0 || priceRange[1] < 500 || inStock || searchParams.get('q')

  if (isLoading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-muted animate-pulse mb-8" />
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="hidden lg:block h-[600px] bg-muted animate-pulse" />
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
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
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Shop All</h1>
        <p className="text-muted-foreground text-sm">
          Discover our latest collection of premium clothing
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b">
        <div className="flex flex-1 items-center gap-4">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2 rounded-none">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left font-serif">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedStyles={selectedStyles}
                  setSelectedStyles={setSelectedStyles}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  inStock={inStock}
                  setInStock={setInStock}
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
              fetchProducts()
            }}>
              <Input
                name="shop-search"
                placeholder="Search products..."
                defaultValue={searchParams.get('q') || ''}
                className="pl-10 rounded-none"
              />
            </form>
          </div>

          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] rounded-none">
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
          <div className="hidden sm:flex items-center border">
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
          {selectedCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1 rounded-none">
              {cat}
              <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedSizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1 rounded-none">
              Size: {size}
              <button onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedColors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1 rounded-none">
              {color}
              <button onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="secondary" className="gap-1 rounded-none">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <button onClick={() => setPriceRange([0, 500])}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {inStock && (
            <Badge variant="secondary" className="gap-1 rounded-none">
              In Stock
              <button onClick={() => setInStock(false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FilterSidebar
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedStyles={selectedStyles}
              setSelectedStyles={setSelectedStyles}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStock={inStock}
              setInStock={setInStock}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-2">No products found</p>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters</p>
              <Button onClick={clearFilters} variant="outline" className="rounded-none">Clear Filters</Button>
            </div>
          ) : (
            <div className={cn(
              'grid gap-x-4 gap-y-8',
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
