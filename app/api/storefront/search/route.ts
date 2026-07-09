import { NextResponse } from 'next/server'
import { queryAll } from '@/lib/db'
import { getStorefrontOrg } from '@/lib/storefront-utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const orgStorefront = await getStorefrontOrg();
    const orgId = orgStorefront?.organization_id;

    let query = '';
    let params = [];

    if (orgId) {
      query = `
        SELECT id, name, price, compare_at_price, image_url 
        FROM storefront_products 
        WHERE is_active = true AND organization_id = $1 
        AND name ILIKE $2 
        LIMIT 6
      `;
      params = [orgId, `%${q}%`];
    } else {
      query = `
        SELECT id, name, price, compare_at_price, image_url 
        FROM storefront_products 
        WHERE is_active = true AND organization_id IS NULL 
        AND name ILIKE $1 
        LIMIT 6
      `;
      params = [`%${q}%`];
    }

    const products = await queryAll(query, params)
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}
