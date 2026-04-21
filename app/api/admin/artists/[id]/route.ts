import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const artists: any[] = await query(
      `SELECT * FROM artists WHERE id = ?`,
      [id]
    )

    if (artists.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    return NextResponse.json({ artist: artists[0] })
  } catch (error) {
    console.error('Failed to fetch artist:', error)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { name, bio, image_url, location, art_form, awards, is_featured, is_active } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Check if slug exists for other artists
    const existing: any[] = await query(
      `SELECT id FROM artists WHERE slug = ? AND id != ?`,
      [slug, id]
    )
    
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Artist with this name already exists' }, { status: 400 })
    }

    await query(
      `UPDATE artists 
       SET name = ?, slug = ?, bio = ?, image_url = ?, location = ?, art_form = ?, awards = ?, is_featured = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name, 
        slug, 
        bio || null, 
        image_url || null, 
        location || null, 
        art_form || null, 
        awards || null,
        is_featured ? 1 : 0, 
        is_active !== false ? 1 : 0,
        id
      ]
    )

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Failed to update artist:', error)
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Products will have artist_id set to NULL due to ON DELETE SET NULL
    await query(`DELETE FROM artists WHERE id = ?`, [id])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete artist:', error)
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 })
  }
}
