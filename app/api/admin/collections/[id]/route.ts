import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const collections: any[] = await query(`SELECT * FROM collections WHERE id = ?`, [id])
    
    if (!collections || collections.length === 0) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json({ collection: collections[0] })
  } catch (error) {
    console.error('Failed to fetch collection:', error)
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, image_url, type, is_featured, is_active } = body
    const { id } = await params

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    await query(
      `UPDATE collections SET name = ?, slug = ?, description = ?, image_url = ?, type = ?, is_featured = ?, is_active = ? WHERE id = ?`,
      [name, slug, description || null, image_url || null, type || 'style', is_featured ? 1 : 0, is_active !== false ? 1 : 0, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update collection:', error)
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await query("DELETE FROM collections WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete collection:', error)
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 })
  }
}
