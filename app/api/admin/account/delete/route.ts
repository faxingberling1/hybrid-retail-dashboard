
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const organizationId = session.user.organizationId
        const userId = session.user.id

        // Verify if user is admin
        const user = await db.queryOne('SELECT role FROM users WHERE id = $1', [userId])
        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only administrators can delete the organization account' }, { status: 403 })
        }

        // Complete deletion protocol
        await db.transaction(async (client) => {
            // Delete invitations
            await client.query('DELETE FROM user_invitations WHERE organization_id = $1', [organizationId])

            // Delete role permissions
            await client.query('DELETE FROM role_permissions WHERE organization_id = $1', [organizationId])

            // Delete organization members
            await client.query('DELETE FROM users WHERE organization_id = $1', [organizationId])

            // Delete organization
            await client.query('DELETE FROM organizations WHERE id = $1', [organizationId])
        })

        return NextResponse.json({ success: true, message: 'Organization and account deleted successfully' })
    } catch (error: any) {
        console.error('❌ Error during account deletion:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}
