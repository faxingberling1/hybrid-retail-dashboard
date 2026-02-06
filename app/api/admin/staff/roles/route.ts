
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

        const roles = await db.queryAll(
            `SELECT id, role_name, permissions, updated_at 
       FROM role_permissions 
       WHERE organization_id = $1`,
            [organizationId]
        )

        return NextResponse.json({ roles })
    } catch (error: any) {
        console.error('❌ Error fetching roles:', error)
        return NextResponse.json(
            { error: 'Failed to fetch roles' },
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

        const { roleName, permissions } = await request.json()
        const organizationId = session.user.organizationId

        if (!roleName || !permissions) {
            return NextResponse.json({ error: 'Role name and permissions are required' }, { status: 400 })
        }

        await db.query(
            `INSERT INTO role_permissions (id, organization_id, role_name, permissions)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (organization_id, role_name) 
       DO UPDATE SET permissions = $4, updated_at = NOW()`,
            [uuidv4(), organizationId, roleName, JSON.stringify(permissions)]
        )

        return NextResponse.json({ success: true, message: 'Role updated successfully' })
    } catch (error: any) {
        console.error('❌ Error updating role:', error)
        return NextResponse.json(
            { error: 'Failed to update role' },
            { status: 500 }
        )
    }
}
