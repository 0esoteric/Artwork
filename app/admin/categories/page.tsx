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
import { Plus, Search, Pencil, Trash2, FolderOpen, Loader2 } from "lucide-react"
import Image from "next/image"

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
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-name`}>Category Name *</Label>
        <Input
          id={`${isEdit ? 'edit' : 'new'}-name`}
          placeholder="e.g., Madhubani Art"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-description`}>Description</Label>
        <Textarea
          id={`${isEdit ? 'edit' : 'new'}-description`}
          placeholder="Brief description of the category..."
          rows={3}
          value={category.description}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-image_url`}>Image URL</Label>
        <Input
          id={`${isEdit ? 'edit' : 'new'}-image_url`}
          placeholder="https://example.com/image.jpg"
          value={category.image_url}
          onChange={(e) => setCategory({ ...category, image_url: e.target.value })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label>Active</Label>
          <p className="text-xs text-muted-foreground">Category visible on store</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing products.
              </DialogDescription>
            </DialogHeader>
            <CategoryFormContent 
              category={newCategory} 
              setCategory={setNewCategory}
            />
            <DialogFooter className="mt-4">
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information below.
            </DialogDescription>
          </DialogHeader>
          <CategoryFormContent 
            category={editCategory} 
            setCategory={setEditCategory}
            isEdit
          />
          <DialogFooter className="mt-4">
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

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No categories found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
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
                          <div className="flex items-center justify-center h-full w-full">
                            <FolderOpen className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{category.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{category.slug}</p>
                    </TableCell>
                    <TableCell>{category.product_count || 0}</TableCell>
                    <TableCell>
                      {category.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
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
