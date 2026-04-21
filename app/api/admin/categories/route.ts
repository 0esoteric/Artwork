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
    const categories = await query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    )
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, image_url, is_active } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Check if slug exists
    const existing: any[] = await query(
      `SELECT id FROM categories WHERE slug = ?`,
      [slug]
    )
    
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 })
    }

    const result: any = await query(
      `INSERT INTO categories (name, slug, description, image_url, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, slug, description || null, image_url || null, is_active !== false ? 1 : 0]
    )

    return NextResponse.json({ success: true, categoryId: result.insertId, slug })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
