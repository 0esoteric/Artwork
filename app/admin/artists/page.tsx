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
import { Plus, Search, Pencil, Trash2, UserCircle, Loader2, Eye, Award, MapPin, Palette } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Artist {
  id: number
  name: string
  slug: string
  bio?: string
  image_url?: string
  location?: string
  art_form?: string
  awards?: string
  is_featured: boolean
  is_active: boolean
  product_count: number
  created_at: string
}

interface ArtistForm {
  name: string
  bio: string
  image_url: string
  location: string
  art_form: string
  awards: string
  is_featured: boolean
  is_active: boolean
}

const defaultArtistForm: ArtistForm = {
  name: "",
  bio: "",
  image_url: "",
  location: "",
  art_form: "",
  awards: "",
  is_featured: false,
  is_active: true,
}

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export default function AdminArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [newArtist, setNewArtist] = useState<ArtistForm>(defaultArtistForm)
  const [editArtist, setEditArtist] = useState<ArtistForm>(defaultArtistForm)

  const fetchArtists = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/artists')
      const data = await res.json()
      setArtists(data.artists || [])
    } catch (error) {
      console.error('Failed to fetch artists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [])

  const handleAddArtist = async () => {
    if (!newArtist.name.trim()) {
      alert('Artist name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArtist),
      })
      const data = await res.json()
      if (res.ok) {
        setIsAddDialogOpen(false)
        fetchArtists()
        setNewArtist(defaultArtistForm)
      } else {
        alert(data.error || 'Failed to add artist')
      }
    } catch (error) {
      console.error('Failed to add artist:', error)
      alert('Failed to add artist')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditArtist = async () => {
    if (!editingArtist || !editArtist.name.trim()) {
      alert('Artist name is required')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/artists/${editingArtist.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editArtist),
      })
      const data = await res.json()
      if (res.ok) {
        setIsEditDialogOpen(false)
        setEditingArtist(null)
        fetchArtists()
      } else {
        alert(data.error || 'Failed to update artist')
      }
    } catch (error) {
      console.error('Failed to update artist:', error)
      alert('Failed to update artist')
    } finally {
      setIsSaving(false)
    }
  }

  const openEditDialog = (artist: Artist) => {
    setEditingArtist(artist)
    setEditArtist({
      name: artist.name || "",
      bio: artist.bio || "",
      image_url: artist.image_url || "",
      location: artist.location || "",
      art_form: artist.art_form || "",
      awards: artist.awards || "",
      is_featured: artist.is_featured || false,
      is_active: artist.is_active !== false,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteArtist = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artist? This will also remove artist association from their products.')) return
    try {
      const res = await fetch(`/api/admin/artists/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        fetchArtists()
      } else {
        alert(data.error || 'Failed to delete artist')
      }
    } catch (error) {
      console.error('Failed to delete artist:', error)
    }
  }

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.art_form?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ArtistFormContent = ({ 
    artist, 
    setArtist, 
    isEdit = false 
  }: { 
    artist: ArtistForm
    setArtist: (a: ArtistForm) => void
    isEdit?: boolean 
  }) => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-name`}>Artist Name *</Label>
        <Input
          id={`${isEdit ? 'edit' : 'new'}-name`}
          placeholder="e.g., Ambika Devi"
          value={artist.name}
          onChange={(e) => setArtist({ ...artist, name: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-image_url`}>Profile Image URL</Label>
        <Input
          id={`${isEdit ? 'edit' : 'new'}-image_url`}
          placeholder="https://example.com/image.jpg"
          value={artist.image_url}
          onChange={(e) => setArtist({ ...artist, image_url: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-location`}>Location</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-location`}
            placeholder="e.g., Bihar, India"
            value={artist.location}
            onChange={(e) => setArtist({ ...artist, location: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${isEdit ? 'edit' : 'new'}-art_form`}>Art Form</Label>
          <Input
            id={`${isEdit ? 'edit' : 'new'}-art_form`}
            placeholder="e.g., Madhubani"
            value={artist.art_form}
            onChange={(e) => setArtist({ ...artist, art_form: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-bio`}>Biography</Label>
        <Textarea
          id={`${isEdit ? 'edit' : 'new'}-bio`}
          placeholder="Tell the story of this artist, their journey, expertise, and achievements..."
          rows={5}
          value={artist.bio}
          onChange={(e) => setArtist({ ...artist, bio: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${isEdit ? 'edit' : 'new'}-awards`}>Awards & Recognition</Label>
        <Textarea
          id={`${isEdit ? 'edit' : 'new'}-awards`}
          placeholder="List any awards, certifications, or recognition received..."
          rows={3}
          value={artist.awards}
          onChange={(e) => setArtist({ ...artist, awards: e.target.value })}
        />
      </div>
      
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured Artist</Label>
            <p className="text-xs text-muted-foreground">Display on homepage featured section</p>
          </div>
          <Switch
            checked={artist.is_featured}
            onCheckedChange={(checked) => setArtist({ ...artist, is_featured: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Active</Label>
            <p className="text-xs text-muted-foreground">Artist visible on store</p>
          </div>
          <Switch
            checked={artist.is_active}
            onCheckedChange={(checked) => setArtist({ ...artist, is_active: checked })}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Artists</h1>
          <p className="text-muted-foreground mt-1">Manage artisans and their profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Artist</DialogTitle>
              <DialogDescription>
                Create a new artist profile. Artists can be linked to products.
              </DialogDescription>
            </DialogHeader>
            <ArtistFormContent 
              artist={newArtist} 
              setArtist={setNewArtist}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleAddArtist} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Artist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Artist</DialogTitle>
            <DialogDescription>
              Update the artist information below.
            </DialogDescription>
          </DialogHeader>
          <ArtistFormContent 
            artist={editArtist} 
            setArtist={setEditArtist}
            isEdit
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleEditArtist} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{artists.length}</p>
                <p className="text-sm text-muted-foreground">Total Artists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{artists.filter(a => a.is_featured).length}</p>
                <p className="text-sm text-muted-foreground">Featured Artists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-secondary">
                <Palette className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{[...new Set(artists.map(a => a.art_form).filter(Boolean))].length}</p>
                <p className="text-sm text-muted-foreground">Art Forms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search artists..."
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
          ) : filteredArtists.length === 0 ? (
            <div className="text-center py-8">
              <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No artists found</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first artist
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Art Form</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
                        {artist.image_url ? (
                          <Image
                            src={artist.image_url}
                            alt={artist.name || 'Artist'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = PLACEHOLDER_IMAGE
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <UserCircle className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        {artist.is_featured && (
                          <span className="text-xs text-primary">Featured</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{artist.art_form || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{artist.location || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{artist.product_count || 0}</TableCell>
                    <TableCell>
                      {artist.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link href={`/artists/${artist.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(artist)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteArtist(artist.id)}
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
