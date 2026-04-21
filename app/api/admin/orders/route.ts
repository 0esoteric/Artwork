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
    const orders: any[] = await query(`
      SELECT o.*, u.name as user_name, u.email as user_email,
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)
    
    // Fetch items for each order
    for (const order of orders) {
      const items = await query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      )
      order.items = items
    }
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Failed to fetch admin orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
