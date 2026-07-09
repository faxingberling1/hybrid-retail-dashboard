import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = await params

    const result = await db.query(
      `SELECT * FROM storefront_products WHERE organization_id = $1 ORDER BY created_at DESC`,
      [orgId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = await params
    const body = await request.json()
    const { name, slug, price, category_id, description, image_url } = body

    if (!name || !slug || !price || !category_id) {
      return NextResponse.json({ error: 'Name, slug, price, and category are required' }, { status: 400 })
    }

    const result = await db.query(
      `INSERT INTO storefront_products (name, slug, price, category_id, description, image_url, organization_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, slug, price, category_id, description, image_url, orgId]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
