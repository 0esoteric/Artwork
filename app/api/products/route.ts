import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const artForm = searchParams.get('artForm') || ''
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
  const isFeatured = searchParams.get('featured') === 'true'
  const isReadyToShip = searchParams.get('readyToShip') === 'true'

  try {
    let sql = `
      SELECT p.*, 
             COALESCE(pi.image_url, '${PLACEHOLDER_IMAGE}') as image,
             c.name as category_name,
             a.name as artist_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artists a ON p.artist_id = a.id
      WHERE p.is_active = 1
    `
    const params: any[] = []

    if (q) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`
      params.push(`%${q}%`, `%${q}%`)
    }

    if (category) {
      sql += ` AND p.category_id = (SELECT id FROM categories WHERE slug = ?)`
      params.push(category)
    }

    if (artForm) {
      sql += ` AND LOWER(p.art_form) = LOWER(?)`
      params.push(artForm)
    }

    if (minPrice) {
      sql += ` AND p.price >= ?`
      params.push(minPrice)
    }

    if (maxPrice) {
      sql += ` AND p.price <= ?`
      params.push(maxPrice)
    }

    if (isFeatured) {
      sql += ` AND p.is_featured = 1`
    }

    if (isReadyToShip) {
      sql += ` AND p.is_ready_to_ship = 1`
    }

    sql += ` ORDER BY p.created_at DESC`

    const products = await query(sql, params)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
