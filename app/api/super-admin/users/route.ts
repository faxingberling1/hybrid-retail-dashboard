import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/services/notification.service'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch users with organization information
        const users = await db.query(`
            SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.name,
                u.role,
                u.phone,
                u.avatar_url,
                u.organization_id,
                u.is_active,
                u.is_verified,
                u.last_login_at,
                u.created_at,
                o.name as organization_name,
                o.industry as organization_industry,
                (SELECT COUNT(*) FROM activity_logs al WHERE al.user_id = u.id) as activity_count,
                EXISTS (
                    SELECT 1 FROM notifications n 
                    WHERE n.user_id = $1 
                    AND n.read = false 
                    AND n.metadata->>'entityId' = u.id::text
                    AND n.metadata->>'category' = 'USER'
                ) as is_unread
            FROM users u
            LEFT JOIN organizations o ON u.organization_id = o.id::text
            ORDER BY u.created_at DESC
        `, [session.user.id])

        return NextResponse.json(users.rows)
    } catch (error: any) {
        console.error('❌ Error fetching users for super-admin:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { id, is_active } = data

        if (!id || is_active === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updated = await db.queryOne(
            'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [is_active, id]
        )

        if (!updated) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(updated)
    } catch (error: any) {
        console.error('❌ Error updating user status:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { email, first_name, last_name, role, phone, organization_id } = data

        if (!email || !organization_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user already exists
        const existing = await db.queryOne('SELECT id FROM users WHERE email = $1', [email])
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
        }

        const org = await db.queryOne('SELECT name FROM organizations WHERE id = $1', [organization_id])
        if (!org) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        // Create user
        const bcrypt = require('bcrypt')
        const tempPassword = 'User@123' // Temporary password
        const passwordHash = await bcrypt.hash(tempPassword, 10)

        const newUser = await db.queryOne(
            `INSERT INTO users(
        id, email, first_name, last_name, name, role, phone, organization_id, password_hash, is_active, is_verified, created_at, updated_at
    ) VALUES(gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, true, true, NOW(), NOW())
            RETURNING id, email, name, role`,
            [
                email,
                first_name || null,
                last_name || null,
                `${first_name || ''} ${last_name || ''} `.trim() || null,
                role || 'USER',
                phone || null,
                organization_id,
                passwordHash
            ]
        )

        // Create activity log
        await db.query(`
            INSERT INTO activity_logs(user_id, organization_id, action, entity_type, entity_id, details, created_at)
VALUES($1, $2, $3, $4, $5, $6, NOW())
        `, [
            session.user.id,
            organization_id,
            'USER_ENROLLED',
            'user',
            newUser.id,
            JSON.stringify({
                email,
                role,
                enrolled_by: session.user.email,
                organization_name: org.name
            })
        ])

        // Create notification for Super Admins
        await NotificationService.sendSuperAdminNotification(
            'New Member Enrolled',
            `${first_name || last_name ? `${first_name} ${last_name}` : email} has been enrolled in ${org.name}.`,
            'info',
            { category: 'USER', entityId: newUser.id, entityType: 'user' }
        )

        return NextResponse.json(newUser)
    } catch (error: any) {
        console.error('❌ Error creating user:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create user' },
            { status: 500 }
        )
    }
}
