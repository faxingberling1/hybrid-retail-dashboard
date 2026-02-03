import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db' // Add this import
import { UserRepository } from '@/lib/repositories/user.repository'

const userRepository = new UserRepository()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    
    let users
    if (organizationId) {
      // Get users for specific organization
      const result = await pool.query(
        `SELECT u.*, o.name as organization_name 
         FROM users u 
         LEFT JOIN organizations o ON u.organization_id = o.id 
         WHERE u.organization_id = $1 AND u.deleted_at IS NULL 
         ORDER BY u.created_at DESC`,
        [organizationId]
      )
      users = result.rows
    } else {
      // Get all users (for super admin)
      const result = await pool.query(
        `SELECT u.*, o.name as organization_name 
         FROM users u 
         LEFT JOIN organizations o ON u.organization_id = o.id 
         WHERE u.deleted_at IS NULL 
         ORDER BY u.created_at DESC 
         LIMIT 100`
      )
      users = result.rows
    }
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await userRepository.create(body)
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}