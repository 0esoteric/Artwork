import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

// Helper to check if user is admin
async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

export async function GET() {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = `
      SELECT p.*, pi.image_url as image, c.name as category_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `
    const products = await query(sql)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch admin products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, price, compare_price, stock_quantity, category_id, images } = body

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') + '-' + Math.random().toString(36).substring(2, 7)
    
    // Insert product
    const productResult: any = await query(
      `INSERT INTO products (name, slug, description, price, compare_price, stock_quantity, category_id, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [name, slug, description, price, compare_price || null, stock_quantity, category_id]
    )

    const productId = productResult.insertId

    // Insert images
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const url = images[i]
        if (url) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())`,
            [productId, url, i === 0 ? 1 : 0, i]
          )
        }
      }
    } else if (body.image_url) {
      // Fallback for single image
      await query(
        `INSERT INTO product_images (product_id, image_url, is_primary, created_at) VALUES (?, ?, 1, NOW())`,
        [productId, body.image_url]
      )
    }

    return NextResponse.json({ success: true, productId, slug })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
