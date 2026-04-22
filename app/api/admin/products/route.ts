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
      SELECT p.*, pi.image_url as image, c.name as category_name, col.name as collection_name
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
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
    const { 
      name, 
      description, 
      short_description,
      price, 
      compare_price, 
      stock_quantity, 
      category_id, 
      collection_id,
      // Clothing specific fields
      sizes,
      colors,
      material,
      fit,
      care_instructions,
      // Shipping fields
      shipment_time,
      coupon_code,
      coupon_discount,
      shipping_details,
      return_policy,
      is_featured,
      is_new_arrival,
      is_active,
      images 
    } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '') + '-' + Math.random().toString(36).substring(2, 7)
    
    // Insert product with all clothing fields
    const productResult: any = await query(
      `INSERT INTO products (
        name, slug, description, short_description, price, compare_price, 
        stock_quantity, category_id, collection_id, sizes, colors, material, fit,
        care_instructions, shipment_time, coupon_code, coupon_discount,
        shipping_details, return_policy, is_featured, is_new_arrival, 
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name, 
        slug, 
        description || null, 
        short_description || null,
        price, 
        compare_price || null, 
        stock_quantity || 0, 
        category_id || null,
        collection_id || null,
        sizes ? JSON.stringify(sizes) : null,
        colors ? JSON.stringify(colors) : null,
        material || null,
        fit || 'Regular',
        care_instructions || 'Machine wash cold. Do not bleach. Tumble dry low.',
        shipment_time || '3-5 business days',
        coupon_code || null,
        coupon_discount || 0,
        shipping_details || 'Free shipping on orders over $100. Standard delivery within 3-5 business days.',
        return_policy || '30-day return policy. Items must be unworn with original tags.',
        is_featured ? 1 : 0,
        is_new_arrival ? 1 : 0,
        is_active !== false ? 1 : 0
      ]
    )

    const productId = productResult.insertId

    // Insert images
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const url = images[i]
        if (url && typeof url === 'string' && url.trim()) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())`,
            [productId, url.trim(), i === 0 ? 1 : 0, i]
          )
        }
      }
    }

    return NextResponse.json({ success: true, productId, slug })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
