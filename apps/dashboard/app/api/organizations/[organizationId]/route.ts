
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
) {
    try {
        const { organizationId } = await params

        const organization = await db.queryOne(
            'SELECT id, name as business_name, industry, business_type, status FROM organizations WHERE id = $1',
            [organizationId]
        )

        if (!organization) {
            return NextResponse.json(
                { error: 'Organization not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(organization)
    } catch (error: any) {
        console.error('❌ Error fetching organization:', error)
        return NextResponse.json(
            { error: 'Failed to fetch organization' },
            { status: 500 }
        )
    }
}
