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
      `SELECT * FROM organization_storefronts WHERE organization_id = $1`,
      [orgId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Storefront not found for this organization' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching storefront config:', error)
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
    const { subdomain, theme_config } = body

    // Basic validation
    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 })
    }

    // Check if subdomain is taken by another org
    const checkSubdomain = await db.query(
      `SELECT id FROM organization_storefronts WHERE subdomain = $1`,
      [subdomain]
    )

    if (checkSubdomain.rows.length > 0) {
      return NextResponse.json({ error: 'Subdomain is already in use' }, { status: 400 })
    }

    const inserted = await db.query(
      `INSERT INTO organization_storefronts (organization_id, subdomain, theme_config)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [orgId, subdomain, JSON.stringify(theme_config || {})]
    )
    return NextResponse.json(inserted.rows[0])
  } catch (error) {
    console.error('Error creating storefront config:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
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
    const { subdomain, theme_config } = body

    // Basic validation
    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain is required' }, { status: 400 })
    }

    // Check if subdomain is taken by another org
    const checkSubdomain = await db.query(
      `SELECT id FROM organization_storefronts WHERE subdomain = $1 AND organization_id != $2`,
      [subdomain, orgId]
    )

    if (checkSubdomain.rows.length > 0) {
      return NextResponse.json({ error: 'Subdomain is already in use' }, { status: 400 })
    }

    const updated = await db.query(
      `UPDATE organization_storefronts 
       SET subdomain = $1, theme_config = $2, updated_at = NOW() 
       WHERE organization_id = $3 
       RETURNING *`,
      [subdomain, JSON.stringify(theme_config || {}), orgId]
    )

    if (updated.rows.length === 0) {
      // If it doesn't exist, we can try to insert it as a fallback
      const inserted = await db.query(
        `INSERT INTO organization_storefronts (organization_id, subdomain, theme_config)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [orgId, subdomain, JSON.stringify(theme_config || {})]
      )
      return NextResponse.json(inserted.rows[0])
    }

    return NextResponse.json(updated.rows[0])
  } catch (error) {
    console.error('Error updating storefront config:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
