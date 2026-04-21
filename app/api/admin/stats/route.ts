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
    // 1. Total Revenue
    const revenueResult: any = await query(`SELECT SUM(total) as total FROM orders WHERE status != 'cancelled' AND payment_status = 'paid'`)
    const totalRevenue = revenueResult[0]?.total || 0

    // 2. Total Orders
    const ordersResult: any = await query(`SELECT COUNT(*) as total FROM orders`)
    const totalOrders = ordersResult[0]?.total || 0

    // 3. Total Products
    const productsResult: any = await query(`SELECT COUNT(*) as total FROM products`)
    const totalProducts = productsResult[0]?.total || 0

    // 4. Total Users
    const usersResult: any = await query(`SELECT COUNT(*) as total FROM users WHERE role = 'customer'`)
    const totalUsers = usersResult[0]?.total || 0

    // 5. Recent Orders
    const recentOrders = await query(`
      SELECT o.order_number as id, u.name as customer, o.total as amount, o.status, o.created_at as date
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `)

    // 6. Top Products
    const topProducts = await query(`
      SELECT p.name, COUNT(oi.id) as sales, SUM(oi.price * oi.quantity) as revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT 5
    `)

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers
      },
      recentOrders,
      topProducts
    })
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
