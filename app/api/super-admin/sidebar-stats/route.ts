import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get unread notification counts by category for the sidebar
        const [orgs, users, billing] = await Promise.all([
            db.queryOne("SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false AND metadata->>'category' = 'ORGANIZATION'", [session.user.id]),
            db.queryOne("SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false AND metadata->>'category' = 'USER'", [session.user.id]),
            db.queryOne("SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND read = false AND metadata->>'category' = 'BILLING'", [session.user.id])
        ])

        return NextResponse.json({
            organizations: parseInt(orgs?.count || '0'),
            users: parseInt(users?.count || '0'),
            billing: parseInt(billing?.count || '0')
        })
    } catch (error: any) {
        console.error('❌ Error fetching sidebar stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch sidebar stats' },
            { status: 500 }
        )
    }
}
