import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('organization_id')

    let result
    if (orgId) {
      result = await db.query(
        `SELECT s.*, a.name as addon_name, a.price as addon_price, a.interval as addon_interval 
         FROM subscriptions s
         LEFT JOIN addons a ON s.addon_id = a.id
         WHERE s.organization_id = $1
         ORDER BY s.created_at DESC`,
        [orgId]
      )
    } else {
      result = await db.query(
        `SELECT s.*, a.name as addon_name, a.price as addon_price, a.interval as addon_interval 
         FROM subscriptions s
         LEFT JOIN addons a ON s.addon_id = a.id
         ORDER BY s.created_at DESC`
      )
    }

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { organization_id, addon_id, plan, current_period_start, current_period_end } = body

    if (!organization_id || !addon_id || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const start = current_period_start || new Date().toISOString()
    const end = current_period_end || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()

    const result = await db.query(
      `INSERT INTO subscriptions (
        organization_id, addon_id, plan, status, 
        current_period_start, current_period_end
      ) 
      VALUES ($1, $2, $3, 'active', $4, $5) 
      RETURNING *`,
      [organization_id, addon_id, plan, start, end]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
