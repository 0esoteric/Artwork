"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Package, X, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductForm {
  name: string
  description: string
  short_description: string
  category_id: string
  artist_id: string
  price: string
  compare_price: string
  stock_quantity: string
  dimensions: string
  medium: string
  art_form: string
  shipment_time: string
  coupon_code: string
  coupon_discount: string
  about_artist: string
  shipping_details: string
  return_policy: string
  is_featured: boolean
  is_ready_to_ship: boolean
  is_active: boolean
  images: string
}

const defaultProductForm: ProductForm = {
  name: "",
  description: "",
  short_description: "",
  category_id: "",
  artist_id: "",
  price: "",
  compare_price: "",
  stock_quantity: "",
  dimensions: "",
  medium: "",
  art_form: "",
  shipment_time: "7-10 business days",
  coupon_code: "",
  coupon_discount: "",
  about_artist: "",
  shipping_details: "Free shipping on orders above Rs. 999. Standard delivery within 7-10 business days.",
  return_policy: "7-day return policy. Items must be unused and in original packaging.",
  is_featured: false,
  is_ready_to_ship: false,
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
  const [artists, setArtists] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState<ProductForm>(defaultProductForm)
  const [editProduct, setEditProduct] = useState<ProductForm>(defaultProductForm)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(data.products || [])
      
      // Fetch categories
      const catRes = await fetch('/api/categories')
      const catData = await catRes.json()
      setCategories(catData.categories || [])

      // Fetch artists
      const artistRes = await fetch('/api/artists')
      const artistData = await artistRes.json()
      setArtists(artistData.artists || [])
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
        artist_id: newProduct.artist_id ? parseInt(newProduct.artist_id) : null,
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
        artist_id: editProduct.artist_id ? parseInt(editProduct.artist_id) : null,
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
      artist_id: product.artist_id?.toString() || "",
      price: product.price?.toString() || "",
      compare_price: product.compare_price?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      dimensions: product.dimensions || "",
      medium: product.medium || "",
      art_form: product.art_form || "",
      shipment_time: product.shipment_time || "7-10 business days",
      coupon_code: product.coupon_code || "",
      coupon_discount: product.coupon_discount?.toString() || "",
      about_artist: product.about_artist || "",
      shipping_details: product.shipping_details || "Free shipping on orders above Rs. 999. Standard delivery within 7-10 business days.",
      return_policy: product.return_policy || "7-day return policy. Items must be unused and in original packaging.",
      is_featured: product.is_featured || false,
      is_ready_to_ship: product.is_ready_to_ship || false,
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

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (stock: number, isActive: boolean) => {
    if (!isActive) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>
    }
    if (stock === 0) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of Stock</span>
    }
    if (stock < 5) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Low Stock</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">In Stock</span>
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
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Policy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-name`}>Product Name *</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-name`}
            placeholder="e.g., Madhubani Peacock Painting"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-short_description`}>Short Description</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-short_description`}
            placeholder="Brief description for product cards"
            value={product.short_description}
            onChange={(e) => setProduct({ ...product, short_description: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-description`}>Full Description</Label>
          <Textarea
            id={`${isEdit ? 'edit' : 'new'}-description`}
            placeholder="Describe the artwork, its origin, and significance..."
            rows={4}
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
            <Label>Artist</Label>
            <Select
              value={product.artist_id}
              onValueChange={(value) => setProduct({ ...product, artist_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id.toString()}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-images`}>Product Images (URLs, separated by comma)</Label>
          <Textarea
            id={`${isEdit ? 'edit' : 'new'}-images`}
            placeholder="https://image1.jpg, https://image2.jpg..."
            value={product.images}
            onChange={(e) => setProduct({ ...product, images: e.target.value })}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">First image will be the primary image</p>
        </div>
      </TabsContent>
      
      <TabsContent value="details" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${isEdit ? 'edit' : 'new'}-dimensions`}>Dimensions</Label>
            <Input
              id={`${isEdit ? 'edit' : 'new'}-dimensions`}
              placeholder="e.g., 24 x 36 inches"
              value={product.dimensions}
              onChange={(e) => setProduct({ ...product, dimensions: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${isEdit ? 'edit' : 'new'}-medium`}>Medium</Label>
            <Input
              id={`${isEdit ? 'edit' : 'new'}-medium`}
              placeholder="e.g., Acrylic on Canvas"
              value={product.medium}
              onChange={(e) => setProduct({ ...product, medium: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-art_form`}>Art Form</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-art_form`}
            placeholder="e.g., Madhubani, Warli, Tanjore"
            value={product.art_form}
            onChange={(e) => setProduct({ ...product, art_form: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-about_artist`}>About the Artist</Label>
          <Textarea
            id={`${isEdit ? 'edit' : 'new'}-about_artist`}
            placeholder="Information about the artist who created this artwork..."
            rows={4}
            value={product.about_artist}
            onChange={(e) => setProduct({ ...product, about_artist: e.target.value })}
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Featured Product</Label>
              <p className="text-xs text-muted-foreground">Display on homepage featured section</p>
            </div>
            <Switch
              checked={product.is_featured}
              onCheckedChange={(checked) => setProduct({ ...product, is_featured: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Ready to Ship</Label>
              <p className="text-xs text-muted-foreground">Mark as ready for immediate shipping</p>
            </div>
            <Switch
              checked={product.is_ready_to_ship}
              onCheckedChange={(checked) => setProduct({ ...product, is_ready_to_ship: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">Product visible on store</p>
            </div>
            <Switch
              checked={product.is_active}
              onCheckedChange={(checked) => setProduct({ ...product, is_active: checked })}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="pricing" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${isEdit ? 'edit' : 'new'}-price`}>Sale Price (Rs.) *</Label>
            <Input
              id={`${isEdit ? 'edit' : 'new'}-price`}
              type="number"
              placeholder="0"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${isEdit ? 'edit' : 'new'}-compare_price`}>Original Price (Rs.)</Label>
            <Input
              id={`${isEdit ? 'edit' : 'new'}-compare_price`}
              type="number"
              placeholder="0"
              value={product.compare_price}
              onChange={(e) => setProduct({ ...product, compare_price: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Leave empty if no discount</p>
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-stock_quantity`}>Stock Quantity *</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-stock_quantity`}
            type="number"
            placeholder="0"
            value={product.stock_quantity}
            onChange={(e) => setProduct({ ...product, stock_quantity: e.target.value })}
          />
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Product Coupon</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`${isEdit ? 'edit' : 'new'}-coupon_code`}>Coupon Code</Label>
              <Input
                id={`${isEdit ? 'edit' : 'new'}-coupon_code`}
                placeholder="e.g., SAVE10"
                value={product.coupon_code}
                onChange={(e) => setProduct({ ...product, coupon_code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${isEdit ? 'edit' : 'new'}-coupon_discount`}>Discount (%)</Label>
              <Input
                id={`${isEdit ? 'edit' : 'new'}-coupon_discount`}
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={product.coupon_discount}
                onChange={(e) => setProduct({ ...product, coupon_discount: e.target.value })}
              />
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-4 mt-4">
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-shipment_time`}>Estimated Shipment Time</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-shipment_time`}
            placeholder="e.g., 7-10 business days"
            value={product.shipment_time}
            onChange={(e) => setProduct({ ...product, shipment_time: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-shipping_details`}>Shipping Details</Label>
          <Textarea
            id={`${isEdit ? 'edit' : 'new'}-shipping_details`}
            placeholder="Shipping information and policies..."
            rows={4}
            value={product.shipping_details}
            onChange={(e) => setProduct({ ...product, shipping_details: e.target.value })}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-return_policy`}>Return Policy</Label>
          <Textarea
            id={`${isEdit ? 'edit' : 'new'}-return_policy`}
            placeholder="Return and refund policies..."
            rows={4}
            value={product.return_policy}
            onChange={(e) => setProduct({ ...product, return_policy: e.target.value })}
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your artwork inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new artwork to your inventory. Fill in all the details below.
              </DialogDescription>
            </DialogHeader>
            <ProductFormContent 
              product={newProduct} 
              setProduct={setNewProduct}
            />
            <DialogFooter className="mt-4">
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information below.
            </DialogDescription>
          </DialogHeader>
          <ProductFormContent 
            product={editProduct} 
            setProduct={setEditProduct}
            isEdit
          />
          <DialogFooter className="mt-4">
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

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories && categories.length > 0 ? categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                )) : null}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name || 'Product'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = PLACEHOLDER_IMAGE
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category_name || '-'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        {product.compare_price && product.compare_price > product.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.compare_price)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.stock_quantity}</TableCell>
                    <TableCell>{getStatusBadge(product.stock_quantity, product.is_active)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${product.slug}`} target="_blank">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
