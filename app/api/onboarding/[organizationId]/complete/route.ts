
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
) {
    try {
        const { organizationId } = await params

        // Mark all steps as complete if needed, or just update org status
        // For now, let's just ensure the organization is active
        await db.query(
            "UPDATE organizations SET status = 'active' WHERE id = $1",
            [organizationId]
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('❌ Error completing onboarding:', error)
        return NextResponse.json(
            { error: 'Failed to complete onboarding' },
            { status: 500 }
        )
    }
}
