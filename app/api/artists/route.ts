import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const artists = await query(
      `SELECT * FROM artists WHERE is_active = 1 ORDER BY name ASC`
    )
    return NextResponse.json({ artists })
  } catch (error) {
    console.error('Failed to fetch artists:', error)
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
  }
}
