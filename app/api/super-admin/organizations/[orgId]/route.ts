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
        const { orgId } = await params

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch deep organization details
        const [org, subscription, invoices, transactions, users, logs] = await Promise.all([
            // Basic Org Info
            db.queryOne('SELECT * FROM organizations WHERE id = $1', [orgId]),

            // Current Subscription
            db.queryOne('SELECT * FROM subscriptions WHERE organization_id = $1 AND status = \'active\' LIMIT 1', [orgId]),

            // Recent Invoices
            db.query('SELECT * FROM invoices WHERE organization_id = $1 ORDER BY created_at DESC LIMIT 10', [orgId]),

            // Recent Transactions
            db.query('SELECT * FROM transactions WHERE organization_id = $1 ORDER BY created_at DESC LIMIT 10', [orgId]),

            // Linked Users
            db.query(`
                SELECT 
                    u.id, u.name, u.email, u.role, u.is_active, u.last_login_at,
                    EXISTS (
                        SELECT 1 FROM notifications n 
                        WHERE n.user_id = $1 
                        AND n.read = false 
                        AND n.metadata->>'entityId' = u.id::text
                        AND n.metadata->>'category' = 'USER'
                    ) as is_unread
                FROM users u 
                WHERE organization_id = $2::text
            `, [session.user.id, orgId]),

            // Activity Logs
            db.query(`
                SELECT al.*, u.name as user_name 
                FROM activity_logs al 
                LEFT JOIN users u ON al.user_id = u.id 
                WHERE al.organization_id = $1 
                ORDER BY al.created_at DESC 
                LIMIT 20
            `, [orgId])
        ])

        if (!org) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        return NextResponse.json({
            organization: org,
            subscription: subscription || null,
            invoices: invoices.rows,
            transactions: transactions.rows,
            users: users.rows,
            activityLogs: logs.rows
        })
    } catch (error: any) {
        console.error('❌ Error fetching deep organization details:', error)
        return NextResponse.json(
            { error: 'Failed to fetch details' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ orgId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { orgId } = await params

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get organization name for logging before deletion
        const org = await db.queryOne('SELECT name FROM organizations WHERE id = $1', [orgId])
        if (!org) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        // Perform deletion
        // Note: Depending on foreign key constraints, this might require cascading or manual cleanup of related data
        await db.query('DELETE FROM organizations WHERE id = $1', [orgId])

        // Log the action
        await db.query(
            `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, created_at) 
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [
                session.user.id,
                'ORGANIZATION_DELETED',
                'organization',
                orgId,
                JSON.stringify({
                    organization_name: org.name,
                    deleted_by: session.user.email
                })
            ]
        )

        return NextResponse.json({ message: 'Organization deleted successfully' })
    } catch (error: any) {
        console.error('❌ Error deleting organization:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete organization' },
            { status: 500 }
        )
    }
}
