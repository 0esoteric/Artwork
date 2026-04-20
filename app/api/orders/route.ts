import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { 
      items, 
      subtotal, 
      shipping, 
      total, 
      shippingData, 
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = body

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const userId = session.user.id
    
    // 1. Create order
    const orderResult: any = await query(
      `INSERT INTO orders (
        order_number, user_id, status, payment_status, payment_method, 
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        subtotal, shipping_cost, total, 
        shipping_name, shipping_phone, shipping_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderNumber, 
        userId, 
        paymentMethod === 'cod' ? 'pending' : 'confirmed', 
        paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentMethod,
        razorpay_order_id || null,
        razorpay_payment_id || null,
        razorpay_signature || null,
        subtotal,
        shipping,
        total,
        `${shippingData.firstName} ${shippingData.lastName}`,
        shippingData.phone,
        `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`,
      ]
    )

    const orderId = orderResult.insertId

    // 2. Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [orderId, item.id, item.name, item.image, item.quantity, item.price, item.price * item.quantity]
      )

      // 3. Update product stock
      await query(
        `UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`,
        [item.quantity, item.id]
      )
    }

    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders: any[] = await query(
      `SELECT o.*, COUNT(oi.id) as item_count 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       GROUP BY o.id 
       ORDER BY o.created_at DESC`,
      [session.user.id]
    )
    
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
    console.error('Failed to fetch orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
