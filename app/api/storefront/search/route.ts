import { NextResponse } from 'next/server'
import { queryAll } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const query = `
      SELECT id, name, price, compare_at_price, image_url 
      FROM storefront_products 
      WHERE is_active = true 
      AND name ILIKE $1 
      LIMIT 6
    `
    const products = await queryAll(query, [`%${q}%`])
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}
