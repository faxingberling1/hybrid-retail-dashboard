
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const organizations = await db.query(
            'SELECT id, name, status, settings FROM organizations'
        )

        return NextResponse.json(organizations.rows)
    } catch (error: any) {
        console.error('❌ Error fetching organization POS access:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.role || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { organizationId, posEnabled } = await request.json()

        // Fetch current settings
        const org: any = await db.queryOne(
            'SELECT settings FROM organizations WHERE id = $1::uuid',
            [organizationId]
        )

        if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const settings = typeof org.settings === 'string' ? JSON.parse(org.settings) : (org.settings || {})
        settings.pos_enabled = posEnabled

        await db.query(
            'UPDATE organizations SET settings = $1, updated_at = NOW() WHERE id = $2::uuid',
            [JSON.stringify(settings), organizationId]
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('❌ Error updating organization POS access:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
