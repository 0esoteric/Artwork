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
import { Plus, Search, Pencil, Trash2, Layers, Loader2, Sparkles, Tag, Calendar } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Collection {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  type: string
  is_featured: boolean
  is_active: boolean
  product_count: number
  created_at: string
}

interface CollectionForm {
  name: string
  description: string
  image_url: string
  type: string
  is_featured: boolean
  is_active: boolean
}

const defaultCollectionForm: CollectionForm = {
  name: "",
  description: "",
  image_url: "",
  type: "style",
  is_featured: false,
  is_active: true,
}

const collectionTypes = [
  { value: "style", label: "Style Collection", description: "e.g., Streetwear, Minimalist" },
  { value: "seasonal", label: "Seasonal", description: "e.g., Summer 2024, Winter Essentials" },
  { value: "occasion", label: "Occasion", description: "e.g., Workwear, Weekend Casual" },
  { value: "collab", label: "Collaboration", description: "e.g., Designer Collabs" },
]

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export default function AdminCollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [newCollection, setNewCollection] = useState<CollectionForm>(defaultCollectionForm)
  const [editCollection, setEditCollection] = useState<CollectionForm>(defaultCollectionForm)
  const [typeFilter, setTypeFilter] = useState("all")

  const fetchCollections = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/collections')
      const data = await res.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) {
      alert('Collection name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCollection.name,
          description: newCollection.description,
          image_url: newCollection.image_url,
          type: newCollection.type,
          is_featured: newCollection.is_featured,
          is_active: newCollection.is_active,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setIsAddDialogOpen(false)
        fetchCollections()
        setNewCollection(defaultCollectionForm)
      } else {
        alert(data.error || 'Failed to add collection')
      }
    } catch (error) {
      console.error('Failed to add collection:', error)
      alert('Failed to add collection')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCollection = async () => {
    if (!editingCollection || !editCollection.name.trim()) {
      alert('Collection name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/collections/${editingCollection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editCollection.name,
          description: editCollection.description,
          image_url: editCollection.image_url,
          type: editCollection.type,
          is_featured: editCollection.is_featured,
          is_active: editCollection.is_active,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setIsEditDialogOpen(false)
        setEditingCollection(null)
        fetchCollections()
      } else {
        alert(data.error || 'Failed to update collection')
      }
    } catch (error) {
      console.error('Failed to update collection:', error)
      alert('Failed to update collection')
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection)
    setEditCollection({
      name: collection.name || "",
      description: collection.description || "",
      image_url: collection.image_url || "",
      type: collection.type || "style",
      is_featured: collection.is_featured || false,
      is_active: collection.is_active !== false,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        fetchCollections()
      } else {
        alert(data.error || 'Failed to delete collection')
      }
    } catch (error) {
      console.error('Failed to delete collection:', error)
    }
  }

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || collection.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeBadge = (type: string) => {
    const config = collectionTypes.find(t => t.value === type)
    const colors: Record<string, string> = {
      style: "bg-violet-100 text-violet-700",
      seasonal: "bg-amber-100 text-amber-700",
      occasion: "bg-blue-100 text-blue-700",
      collab: "bg-pink-100 text-pink-700",
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[type] || colors.style}`}>
        {config?.label || type}
      </span>
    )
  }

  const CollectionFormContent = ({ 
    collection, 
    setCollection, 
    isEdit = false 
  }: { 
    collection: CollectionForm
    setCollection: (c: CollectionForm) => void
    isEdit?: boolean 
  }) => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Collection Name *</Label>
        <Input
          placeholder="e.g., Summer Essentials, Streetwear"
          value={collection.name}
          onChange={(e) => setCollection({ ...collection, name: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Collection Type</Label>
        <Select
          value={collection.type}
          onValueChange={(value) => setCollection({ ...collection, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {collectionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <p>{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe this collection..."
          rows={3}
          value={collection.description}
          onChange={(e) => setCollection({ ...collection, description: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label>Cover Image URL</Label>
        <Input
          placeholder="https://example.com/collection-image.jpg"
          value={collection.image_url}
          onChange={(e) => setCollection({ ...collection, image_url: e.target.value })}
        />
        {collection.image_url && (
          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted mt-2">
            <Image
              src={collection.image_url}
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
      
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured Collection</Label>
            <p className="text-xs text-muted-foreground">Highlight on homepage</p>
          </div>
          <Switch
            checked={collection.is_featured}
            onCheckedChange={(checked) => setCollection({ ...collection, is_featured: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Active</Label>
            <p className="text-xs text-muted-foreground">Show in store</p>
          </div>
          <Switch
            checked={collection.is_active}
            onCheckedChange={(checked) => setCollection({ ...collection, is_active: checked })}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create curated collections for your store</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
              <DialogDescription>Add a new curated collection to your store.</DialogDescription>
            </DialogHeader>
            <CollectionFormContent collection={newCollection} setCollection={setNewCollection} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleAddCollection} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collectionTypes.map((type) => {
          const count = collections.filter(c => c.type === type.value).length
          return (
            <Card 
              key={type.value} 
              className={`cursor-pointer transition-all ${typeFilter === type.value ? 'ring-2 ring-foreground' : 'hover:border-foreground/30'}`}
              onClick={() => setTypeFilter(typeFilter === type.value ? "all" : type.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{type.label}</p>
                  </div>
                  {typeFilter === type.value && (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {typeFilter !== "all" && (
          <Button variant="outline" onClick={() => setTypeFilter("all")}>
            Clear Filter
          </Button>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update the collection details.</DialogDescription>
          </DialogHeader>
          <CollectionFormContent collection={editCollection} setCollection={setEditCollection} isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditCollection} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collections List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <Card className="py-16">
          <div className="text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg">No collections found</h3>
            <p className="text-muted-foreground text-sm mt-1">Create collections to showcase curated products</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredCollections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden group">
              <div className="flex">
                <div className="relative w-32 h-32 flex-shrink-0 bg-muted">
                  {collection.image_url ? (
                    <Image
                      src={collection.image_url}
                      alt={collection.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Layers className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{collection.name}</h3>
                        {collection.is_featured && (
                          <Sparkles className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeBadge(collection.type)}
                        {!collection.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(collection)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {collection.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{collection.description}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {collection.product_count || 0} products
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
