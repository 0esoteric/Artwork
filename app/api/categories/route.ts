import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const categories = await query(
      `SELECT c.*, COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
       GROUP BY c.id
       ORDER BY c.name ASC`
    )

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
