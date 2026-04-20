import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
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
    const { name, description, image_url, is_active } = body
    const { id } = await params

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    await query(
      `UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, is_active = ? WHERE id = ?`,
      [name, slug, description || null, image_url || null, is_active !== false ? 1 : 0, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
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
    
    // Check if category has products
    const products: any[] = await query(
      `SELECT COUNT(*) as count FROM products WHERE category_id = ?`,
      [id]
    )
    
    if (products && products[0]?.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category with products. Remove or reassign products first.' 
      }, { status: 400 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
