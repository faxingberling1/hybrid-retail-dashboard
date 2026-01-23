import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = searchParams.get('end_date') || new Date().toISOString().split('T')[0]

    // Get platform statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT o.id) as total_organizations,
        COUNT(DISTINCT u.id) as total_users,
        COALESCE(SUM(t.amount), 0) as total_revenue,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as total_transactions
      FROM organizations o
      LEFT JOIN users u ON o.id = u.organization_id AND u.deleted_at IS NULL
      LEFT JOIN transactions t ON o.id = t.organization_id 
        AND t.status = 'completed' 
        AND t.created_at BETWEEN $1 AND $2
      WHERE o.deleted_at IS NULL
    `

    // Get growth data
    const growthQuery = `
      SELECT 
        DATE_TRUNC('month', o.created_at) as month,
        COUNT(DISTINCT o.id) as new_organizations,
        COUNT(DISTINCT u.id) as new_users,
        COALESCE(SUM(t.amount), 0) as revenue
      FROM organizations o
      LEFT JOIN users u ON o.id = u.organization_id 
        AND u.deleted_at IS NULL 
        AND DATE_TRUNC('month', u.created_at) = DATE_TRUNC('month', o.created_at)
      LEFT JOIN transactions t ON o.id = t.organization_id 
        AND t.status = 'completed' 
        AND DATE_TRUNC('month', t.created_at) = DATE_TRUNC('month', o.created_at)
      WHERE o.created_at BETWEEN $1 AND $2
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month
    `

    const [statsResult, growthResult] = await Promise.all([
      pool.query(statsQuery, [startDate, endDate]),
      pool.query(growthQuery, [startDate, endDate])
    ])

    return NextResponse.json({
      stats: statsResult.rows[0],
      growth: growthResult.rows
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}