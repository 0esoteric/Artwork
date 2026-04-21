import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Please login to view wishlist" },
        { status: 401 }
      )
    }

    const wishlist = await query(
      `SELECT w.*, p.name, p.slug, p.price, p.sale_price, p.stock,
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.display_order LIMIT 1) as image
       FROM wishlist w
       LEFT JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [session.user.id]
    )

    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Please login to add to wishlist" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    // Check if already in wishlist
    const existing = await query(
      "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?",
      [session.user.id, productId]
    )

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 }
      )
    }

    await query(
      "INSERT INTO wishlist (user_id, product_id, created_at) VALUES (?, ?, NOW())",
      [session.user.id, productId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist add error:", error)
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Please login to remove from wishlist" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    await query(
      "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
      [session.user.id, productId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist remove error:", error)
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    )
  }
}
