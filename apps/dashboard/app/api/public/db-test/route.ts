import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Test query - get organization count
    const orgResult = await pool.query('SELECT COUNT(*) as count FROM organizations')
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users')
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      data: {
        organizations: parseInt(orgResult.rows[0].count),
        users: parseInt(userResult.rows[0].count),
        superAdmin: 'superadmin@platform.com'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}