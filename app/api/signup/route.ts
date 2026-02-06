// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log('📝 Signup data received:', {
      industry: data.industry,
      businessName: data.businessName,
      adminEmail: data.adminEmail
    })

    // Validate required fields
    const requiredFields = ['industry', 'businessName', 'adminEmail', 'adminPassword', 'adminName']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.adminEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.queryOne(
      'SELECT id FROM users WHERE email = $1',
      [data.adminEmail]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Start transaction and execute protocol
    const result = await db.transaction(async (client) => {
      // Create organization
      const organizationId = uuidv4()
      const slug = data.businessName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || `org-${Date.now()}`

      await client.query(
        `INSERT INTO organizations (
          id, name, slug, business_type, industry, 
          employee_count, country, timezone, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          organizationId,
          data.businessName,
          slug,
          data.businessType || 'LLC',
          data.industry,
          data.employees || '1-10',
          data.country || 'US',
          data.timezone || 'UTC',
          'active'
        ]
      )

      // Create admin user
      const hashedPassword = await hashPassword(data.adminPassword)
      const userId = uuidv4()

      await client.query(
        `INSERT INTO users (
          id, organization_id, email, password_hash, name, 
          phone, role, is_active, is_verified, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          userId,
          organizationId,
          data.adminEmail,
          hashedPassword,
          data.adminName,
          data.adminPhone || '',
          'ADMIN',
          true,
          true // Auto-verify for development
        ]
      )

      // Create initial onboarding progress
      await client.query(
        `INSERT INTO onboarding_progress (organization_id, step_id, completed, completed_at)
         VALUES ($1, 'account-created', true, NOW())`,
        [organizationId]
      )

      // Add team members if provided
      if (data.userEmails && data.userEmails.length > 0) {
        const emailSet = new Set(data.userEmails) // Remove duplicates
        const uniqueEmails = Array.from(emailSet)

        for (let i = 0; i < uniqueEmails.length; i++) {
          const email = uniqueEmails[i]

          // Skip if email is the admin's email
          if (email === data.adminEmail) {
            continue
          }

          // Check if user already exists
          const existingInvitedUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
          )

          if (existingInvitedUser.rows.length === 0) {
            const invitedUserId = uuidv4()
            const inviteToken = uuidv4()

            await client.query(
              `INSERT INTO user_invitations (
                id, organization_id, email, role, token, 
                invited_by, created_at, expires_at
              ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '7 days')`,
              [
                invitedUserId,
                organizationId,
                email,
                data.userRoles?.[i] || 'USER',
                inviteToken,
                userId
              ]
            )
          }
        }
      }

      return { organizationId, userId }
    })

    console.log('✅ Account created successfully for:', data.adminEmail)

    return NextResponse.json({
      success: true,
      organizationId: result.organizationId,
      userId: result.userId,
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('❌ Signup error:', error)

    // In development, provide more detail
    const detail = error.detail || error.message || 'Unknown database error'

    // Handle specific database errors
    if (error.code === '23505') { // Unique violation
      return NextResponse.json(
        {
          error: 'Administrator identity already exists.',
          detail: detail
        },
        { status: 409 }
      )
    }

    if (error.code === '23503') { // Foreign key violation
      return NextResponse.json(
        {
          error: 'Invalid reference data provided.',
          detail: detail
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Critical system failure during account provisioning.',
        detail: detail
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for debugging or testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Signup endpoint is active',
    method: 'POST',
    requiredFields: [
      'industry',
      'businessName',
      'adminEmail',
      'adminPassword',
      'adminName'
    ],
    optionalFields: [
      'businessType',
      'employees',
      'country',
      'timezone',
      'adminPhone',
      'userEmails[]',
      'userRoles[]'
    ]
  })
}