"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Pencil, Trash2, FolderOpen, Loader2, Package, MoreHorizontal, GripVertical } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  product_count: number
  created_at: string
}

interface CategoryForm {
  name: string
  description: string
  image_url: string
  is_active: boolean
}

const defaultCategoryForm: CategoryForm = {
  name: "",
  description: "",
  image_url: "",
  is_active: true,
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<CategoryForm>(defaultCategoryForm)
  const [editCategory, setEditCategory] = useState<CategoryForm>(defaultCategoryForm)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Category name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })
      const data = await res.json()
      if (res.ok) {
        setIsAddDialogOpen(false)
        fetchCategories()
        setNewCategory(defaultCategoryForm)
      } else {
        alert(data.error || 'Failed to add category')
      }
    } catch (error) {
      console.error('Failed to add category:', error)
      alert('Failed to add category')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCategory = async () => {
    if (!editingCategory || !editCategory.name.trim()) {
      alert('Category name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategory),
      })
      const data = await res.json()
      if (res.ok) {
        setIsEditDialogOpen(false)
        setEditingCategory(null)
        fetchCategories()
      } else {
        alert(data.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('Failed to update category')
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setEditCategory({
      name: category.name || "",
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active !== false,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        fetchCategories()
      } else {
        alert(data.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)
  const activeCategories = categories.filter(c => c.is_active).length

  const CategoryFormContent = ({ 
    category, 
    setCategory, 
    isEdit = false 
  }: { 
    category: CategoryForm
    setCategory: (c: CategoryForm) => void
    isEdit?: boolean 
  }) => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Category Name *</Label>
        <Input
          placeholder="e.g., T-Shirts, Hoodies, Jackets"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Brief description of this category..."
          rows={3}
          value={category.description}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Cover Image URL</Label>
        <Input
          placeholder="https://example.com/category-image.jpg"
          value={category.image_url}
          onChange={(e) => setCategory({ ...category, image_url: e.target.value })}
        />
        {category.image_url && (
          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted mt-2">
            <Image
              src={category.image_url}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = PLACEHOLDER_IMAGE
              }}
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <div>
          <Label>Active</Label>
          <p className="text-xs text-muted-foreground">Show category in store navigation</p>
        </div>
        <Switch
          checked={category.is_active}
          onCheckedChange={(checked) => setCategory({ ...category, is_active: checked })}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Organize your products into categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for your products.</DialogDescription>
            </DialogHeader>
            <CategoryFormContent category={newCategory} setCategory={setNewCategory} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <FolderOpen className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Total Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FolderOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCategories}</p>
                <p className="text-xs text-muted-foreground">Active Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category information.</DialogDescription>
          </DialogHeader>
          <CategoryFormContent category={editCategory} setCategory={setEditCategory} isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card className="py-16">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No categories found</h3>
            <p className="text-muted-foreground text-sm mt-1">Create categories to organize your products</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="group overflow-hidden">
              <div className="relative aspect-[4/3] bg-muted">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name || 'Category'}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = PLACEHOLDER_IMAGE
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.product_count || 0} products</p>
                </div>
                {!category.is_active && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    Inactive
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(category)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
