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
    const { name, description, price, stock_quantity, category_id, is_active } = body
    const { id } = await params

    await query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, is_active = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name, description, price, stock_quantity, category_id, is_active ? 1 : 0, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
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
    await query("DELETE FROM products WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
