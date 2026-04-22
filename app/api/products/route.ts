import { NextResponse } from "next/server"
import { query } from "@/lib/db"

const PLACEHOLDER_IMAGE = "/placeholder.svg"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const collection = searchParams.get('collection') || ''
  const size = searchParams.get('size') || ''
  const color = searchParams.get('color') || ''
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
  const isFeatured = searchParams.get('featured') === 'true'
  const isNewArrival = searchParams.get('newArrival') === 'true'

  try {
    let sql = `
      SELECT p.*, 
             COALESCE(pi.image_url, '${PLACEHOLDER_IMAGE}') as image,
             c.name as category_name,
             col.name as collection_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
      WHERE p.is_active = 1
    `
    const params: any[] = []

    if (q) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`
      params.push(`%${q}%`, `%${q}%`)
    }

    if (category) {
      sql += ` AND (c.slug = ? OR c.id = ?)`
      params.push(category, category)
    }

    if (collection) {
      sql += ` AND (col.slug = ? OR col.id = ?)`
      params.push(collection, collection)
    }

    if (size) {
      // Size is stored as JSON array, search within it
      sql += ` AND p.sizes LIKE ?`
      params.push(`%${size}%`)
    }

    if (color) {
      // Color is stored as JSON array, search within it
      sql += ` AND p.colors LIKE ?`
      params.push(`%${color}%`)
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

    if (isNewArrival) {
      sql += ` AND p.is_new_arrival = 1`
    }

    sql += ` ORDER BY p.created_at DESC`

    const products = await query(sql, params)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
