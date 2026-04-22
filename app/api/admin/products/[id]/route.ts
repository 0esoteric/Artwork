import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

// Get single product with all details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    
    // Get product
    const products: any[] = await query(
      `SELECT p.*, c.name as category_name, col.name as collection_name
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN collections col ON p.collection_id = col.id
       WHERE p.id = ?`,
      [id]
    )
    
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get images
    const images = await query(
      `SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order`,
      [id]
    )

    return NextResponse.json({ 
      product: { ...products[0], images } 
    })
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
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
    const { id } = await params

    // Update product with all clothing fields
    await query(
      `UPDATE products SET 
        name = ?, 
        description = ?, 
        short_description = ?,
        price = ?, 
        compare_price = ?,
        stock_quantity = ?, 
        category_id = ?,
        collection_id = ?,
        sizes = ?,
        colors = ?,
        material = ?,
        fit = ?,
        care_instructions = ?,
        shipment_time = ?,
        coupon_code = ?,
        coupon_discount = ?,
        shipping_details = ?,
        return_policy = ?,
        is_featured = ?,
        is_new_arrival = ?,
        is_active = ?, 
        updated_at = NOW() 
       WHERE id = ?`,
      [
        name, 
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
        shipping_details || null,
        return_policy || null,
        is_featured ? 1 : 0,
        is_new_arrival ? 1 : 0,
        is_active !== false ? 1 : 0, 
        id
      ]
    )

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete old images
      await query(`DELETE FROM product_images WHERE product_id = ?`, [id])
      
      // Insert new images
      for (let i = 0; i < images.length; i++) {
        const url = images[i]
        if (url && typeof url === 'string' && url.trim()) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) VALUES (?, ?, ?, ?, NOW())`,
            [id, url.trim(), i === 0 ? 1 : 0, i]
          )
        }
      }
    }

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
    // Images will be deleted automatically due to CASCADE
    await query("DELETE FROM products WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
