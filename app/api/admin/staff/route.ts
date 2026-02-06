
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const organizationId = session.user.organizationId

        const users = await db.queryAll(
            `SELECT id, name, email, role, is_active, created_at 
       FROM users 
       WHERE organization_id = $1 AND deleted_at IS NULL 
       ORDER BY created_at DESC`,
            [organizationId]
        )

        const invitations = await db.queryAll(
            `SELECT id, email, role, created_at, expires_at 
       FROM user_invitations 
       WHERE organization_id = $1 AND expires_at > NOW() 
       ORDER BY created_at DESC`,
            [organizationId]
        )

        return NextResponse.json({ users, invitations })
    } catch (error: any) {
        console.error('❌ Error fetching staff:', error)
        return NextResponse.json(
            { error: 'Failed to fetch staff' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { email, role } = await request.json()
        const organizationId = session.user.organizationId
        const invitedBy = session.user.id

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await db.queryOne(
            'SELECT id FROM users WHERE email = $1 AND organization_id = $2',
            [email, organizationId]
        )

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists in this organization' }, { status: 400 })
        }

        const token = uuidv4()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

        await db.query(
            `INSERT INTO user_invitations (id, organization_id, email, role, token, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [uuidv4(), organizationId, email, role, token, invitedBy, expiresAt]
        )

        return NextResponse.json({ success: true, message: 'Invitation sent successfully' })
    } catch (error: any) {
        console.error('❌ Error creating invitation:', error)
        return NextResponse.json(
            { error: 'Failed to create invitation' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const type = searchParams.get('type') // 'staff' or 'invite'
        const organizationId = session.user.organizationId

        if (!id || !type) {
            return NextResponse.json({ error: 'ID and type are required' }, { status: 400 })
        }

        if (type === 'invite') {
            await db.query(
                'DELETE FROM user_invitations WHERE id = $1 AND organization_id = $2',
                [id, organizationId]
            )
        } else if (type === 'staff') {
            // Soft delete users
            await db.query(
                'UPDATE users SET deleted_at = NOW(), is_active = false WHERE id = $1 AND organization_id = $2',
                [id, organizationId]
            )
        }

        return NextResponse.json({ success: true, message: `${type} deleted successfully` })
    } catch (error: any) {
        console.error('❌ Error deleting staff/invite:', error)
        return NextResponse.json(
            { error: 'Failed to delete' },
            { status: 500 }
        )
    }
}
