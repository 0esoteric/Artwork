import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

export async function GET() {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const artists = await query(
      `SELECT a.*, COUNT(p.id) as product_count
       FROM artists a
       LEFT JOIN products p ON a.id = p.artist_id
       GROUP BY a.id
       ORDER BY a.name ASC`
    )
    return NextResponse.json({ artists })
  } catch (error) {
    console.error('Failed to fetch artists:', error)
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, bio, image_url, location, art_form, awards, is_featured, is_active } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Check if slug exists
    const existing: any[] = await query(
      `SELECT id FROM artists WHERE slug = ?`,
      [slug]
    )
    
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Artist with this name already exists' }, { status: 400 })
    }

    const result: any = await query(
      `INSERT INTO artists (name, slug, bio, image_url, location, art_form, awards, is_featured, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name, 
        slug, 
        bio || null, 
        image_url || null, 
        location || null, 
        art_form || null, 
        awards || null,
        is_featured ? 1 : 0, 
        is_active !== false ? 1 : 0
      ]
    )

    return NextResponse.json({ success: true, artistId: result.insertId, slug })
  } catch (error) {
    console.error('Failed to create artist:', error)
    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 })
  }
}
