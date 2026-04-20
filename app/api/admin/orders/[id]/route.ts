import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getSession } from "@/lib/auth"

async function checkAdmin() {
  const session = await getSession()
  return session?.user?.role === 'admin'
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, payment_status } = body
    const { id } = await params

    const updates = []
    const params_list = []

    if (status) {
      updates.push("status = ?")
      params_list.push(status)
    }
    if (payment_status) {
      updates.push("payment_status = ?")
      params_list.push(payment_status)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    params_list.push(id)

    await query(
      `UPDATE orders SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
      params_list
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
