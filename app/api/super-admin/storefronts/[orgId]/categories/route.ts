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

    const [storefrontRes, posRes] = await Promise.all([
      db.query(
        `SELECT * FROM storefront_categories WHERE organization_id = $1 ORDER BY created_at DESC`,
        [orgId]
      ),
      db.query(
        `SELECT id, name FROM categories WHERE organization_id = $1 ORDER BY name ASC`,
        [orgId]
      )
    ])

    return NextResponse.json({
      storefrontCategories: storefrontRes.rows,
      posCategories: posRes.rows
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
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
    const { name, slug, description, parent_id, image_url } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const result = await db.query(
      `INSERT INTO storefront_categories (name, slug, description, organization_id, parent_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, slug, description, orgId, parent_id || null, image_url || null]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
