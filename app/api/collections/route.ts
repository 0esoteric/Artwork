import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const collections = await query(
      `SELECT * FROM collections WHERE is_active = 1 ORDER BY name`
    )
    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Failed to fetch collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}
