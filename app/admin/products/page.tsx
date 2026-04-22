"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Package, 
  X, 
  Loader2,
  Grid3X3,
  List,
  Filter,
  SlidersHorizontal,
  ImagePlus,
  Tag
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ProductForm {
  name: string
  description: string
  short_description: string
  category_id: string
  price: string
  compare_price: string
  stock_quantity: string
  sizes: string
  colors: string
  material: string
  care_instructions: string
  shipment_time: string
  coupon_code: string
  coupon_discount: string
  shipping_details: string
  return_policy: string
  is_featured: boolean
  is_new_arrival: boolean
  is_active: boolean
  images: string
}

const defaultProductForm: ProductForm = {
  name: "",
  description: "",
  short_description: "",
  category_id: "",
  price: "",
  compare_price: "",
  stock_quantity: "",
  sizes: "XS, S, M, L, XL, XXL",
  colors: "",
  material: "",
  care_instructions: "Machine wash cold. Tumble dry low.",
  shipment_time: "3-5 business days",
  coupon_code: "",
  coupon_discount: "",
  shipping_details: "Free shipping on orders above Rs. 999. Standard delivery within 3-5 business days.",
  return_policy: "Easy 30-day returns. Items must be unused with tags attached.",
  is_featured: false,
  is_new_arrival: false,
  is_active: true,
  images: "",
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState<ProductForm>(defaultProductForm)
  const [editProduct, setEditProduct] = useState<ProductForm>(defaultProductForm)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(data.products || [])
      
      const catRes = await fetch('/api/categories')
      const catData = await catRes.json()
      setCategories(catData.categories || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async () => {
    setIsSaving(true)
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        compare_price: parseFloat(newProduct.compare_price) || null,
        stock_quantity: parseInt(newProduct.stock_quantity) || 0,
        category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null,
        coupon_discount: parseFloat(newProduct.coupon_discount) || 0,
        images: newProduct.images.split(',').map(img => img.trim()).filter(img => img !== "")
      }
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (res.ok) {
        setIsAddDialogOpen(false)
        fetchProducts()
        setNewProduct(defaultProductForm)
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Failed to add product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    setIsSaving(true)
    try {
      const productData = {
        ...editProduct,
        price: parseFloat(editProduct.price) || 0,
        compare_price: parseFloat(editProduct.compare_price) || null,
        stock_quantity: parseInt(editProduct.stock_quantity) || 0,
        category_id: editProduct.category_id ? parseInt(editProduct.category_id) : null,
        coupon_discount: parseFloat(editProduct.coupon_discount) || 0,
        images: editProduct.images.split(',').map(img => img.trim()).filter(img => img !== "")
      }
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (res.ok) {
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Failed to update product')
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (product: any) => {
    setEditingProduct(product)
    setEditProduct({
      name: product.name || "",
      description: product.description || "",
      short_description: product.short_description || "",
      category_id: product.category_id?.toString() || "",
      price: product.price?.toString() || "",
      compare_price: product.compare_price?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      sizes: product.sizes || "XS, S, M, L, XL, XXL",
      colors: product.colors || "",
      material: product.material || product.medium || "",
      care_instructions: product.care_instructions || "Machine wash cold. Tumble dry low.",
      shipment_time: product.shipment_time || "3-5 business days",
      coupon_code: product.coupon_code || "",
      coupon_discount: product.coupon_discount?.toString() || "",
      shipping_details: product.shipping_details || defaultProductForm.shipping_details,
      return_policy: product.return_policy || defaultProductForm.return_policy,
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || product.is_ready_to_ship || false,
      is_active: product.is_active !== false,
      images: product.images?.map((img: any) => img.image_url || img).join(', ') || product.image || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || product.category_id?.toString() === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStockBadge = (stock: number, isActive: boolean) => {
    if (!isActive) return <Badge variant="secondary">Inactive</Badge>
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (stock < 10) return <Badge variant="outline" className="border-amber-500 text-amber-600">Low Stock</Badge>
    return <Badge variant="outline" className="border-green-500 text-green-600">In Stock</Badge>
  }

  const ProductFormContent = ({ 
    product, 
    setProduct, 
    isEdit = false 
  }: { 
    product: ProductForm
    setProduct: (p: ProductForm) => void
    isEdit?: boolean 
  }) => (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
        <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
        <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
        <TabsTrigger value="shipping" className="text-xs">Shipping</TabsTrigger>
      </TabsList>
      
      <div className="max-h-[50vh] overflow-y-auto pr-2">
        <TabsContent value="basic" className="space-y-4 mt-0">
          <div className="grid gap-2">
            <Label>Product Name *</Label>
            <Input
              placeholder="e.g., Classic Cotton T-Shirt"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Short Description</Label>
            <Input
              placeholder="Brief tagline for product cards"
              value={product.short_description}
              onChange={(e) => setProduct({ ...product, short_description: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Full Description</Label>
            <Textarea
              placeholder="Detailed product description..."
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={product.category_id}
              onValueChange={(value) => setProduct({ ...product, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Product Images (URLs, comma-separated)</Label>
            <Textarea
              placeholder="https://image1.jpg, https://image2.jpg..."
              value={product.images}
              onChange={(e) => setProduct({ ...product, images: e.target.value })}
              rows={2}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-0">
          <div className="grid gap-2">
            <Label>Available Sizes</Label>
            <Input
              placeholder="XS, S, M, L, XL, XXL"
              value={product.sizes}
              onChange={(e) => setProduct({ ...product, sizes: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Available Colors</Label>
            <Input
              placeholder="Black, White, Navy, Gray"
              value={product.colors}
              onChange={(e) => setProduct({ ...product, colors: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Material / Fabric</Label>
            <Input
              placeholder="e.g., 100% Cotton, Cotton Blend"
              value={product.material}
              onChange={(e) => setProduct({ ...product, material: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Care Instructions</Label>
            <Textarea
              placeholder="Washing and care instructions..."
              rows={2}
              value={product.care_instructions}
              onChange={(e) => setProduct({ ...product, care_instructions: e.target.value })}
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured Product</Label>
                <p className="text-xs text-muted-foreground">Show on homepage</p>
              </div>
              <Switch
                checked={product.is_featured}
                onCheckedChange={(checked) => setProduct({ ...product, is_featured: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>New Arrival</Label>
                <p className="text-xs text-muted-foreground">Mark as new</p>
              </div>
              <Switch
                checked={product.is_new_arrival}
                onCheckedChange={(checked) => setProduct({ ...product, is_new_arrival: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-xs text-muted-foreground">Visible in store</p>
              </div>
              <Switch
                checked={product.is_active}
                onCheckedChange={(checked) => setProduct({ ...product, is_active: checked })}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4 mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Selling Price (Rs.) *</Label>
              <Input
                type="number"
                placeholder="0"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Compare Price (Rs.)</Label>
              <Input
                type="number"
                placeholder="0"
                value={product.compare_price}
                onChange={(e) => setProduct({ ...product, compare_price: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Stock Quantity *</Label>
            <Input
              type="number"
              placeholder="0"
              value={product.stock_quantity}
              onChange={(e) => setProduct({ ...product, stock_quantity: e.target.value })}
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3 text-sm">Discount Coupon</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Coupon Code</Label>
                <Input
                  placeholder="e.g., SAVE10"
                  value={product.coupon_code}
                  onChange={(e) => setProduct({ ...product, coupon_code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={product.coupon_discount}
                  onChange={(e) => setProduct({ ...product, coupon_discount: e.target.value })}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="shipping" className="space-y-4 mt-0">
          <div className="grid gap-2">
            <Label>Estimated Delivery Time</Label>
            <Input
              placeholder="e.g., 3-5 business days"
              value={product.shipment_time}
              onChange={(e) => setProduct({ ...product, shipment_time: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Shipping Details</Label>
            <Textarea
              placeholder="Shipping information..."
              rows={3}
              value={product.shipping_details}
              onChange={(e) => setProduct({ ...product, shipping_details: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Return Policy</Label>
            <Textarea
              placeholder="Return and exchange policy..."
              rows={3}
              value={product.return_policy}
              onChange={(e) => setProduct({ ...product, return_policy: e.target.value })}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage your clothing inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new clothing item for your store.</DialogDescription>
              </DialogHeader>
              <ProductFormContent product={newProduct} setProduct={setNewProduct} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          <ProductFormContent product={editProduct} setProduct={setEditProduct} isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Products Display */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-[3/4] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="py-16">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No products found</h3>
            <p className="text-muted-foreground text-sm mt-1">Add your first product to get started</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const imageUrl = product.images?.[0]?.image_url || product.images?.[0] || product.image || PLACEHOLDER_IMAGE
            return (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative aspect-[3/4] bg-muted">
                  <Image
                    src={imageUrl}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = PLACEHOLDER_IMAGE
                    }}
                  />
                  {product.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-foreground text-background">Featured</Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="secondary" onClick={() => openEditDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" asChild>
                        <Link href={`/shop/${product.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{product.category_name || 'Uncategorized'}</p>
                  <h3 className="font-medium text-sm mt-0.5 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                      {product.compare_price && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compare_price)}</span>
                      )}
                    </div>
                    {getStockBadge(product.stock_quantity, product.is_active)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => {
            const imageUrl = product.images?.[0]?.image_url || product.images?.[0] || product.image || PLACEHOLDER_IMAGE
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={product.name || 'Product'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.category_name || 'Uncategorized'}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStockBadge(product.stock_quantity, product.is_active)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/shop/${product.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
