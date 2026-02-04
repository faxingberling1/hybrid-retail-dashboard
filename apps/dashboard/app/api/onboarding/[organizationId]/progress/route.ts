
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
) {
    try {
        const { organizationId } = await params

        const progress = await db.queryAll(
            'SELECT step_id FROM onboarding_progress WHERE organization_id = $1 AND completed = true',
            [organizationId]
        )

        return NextResponse.json({
            completedSteps: progress.map(p => p.step_id)
        })
    } catch (error: any) {
        console.error('❌ Error fetching onboarding progress:', error)
        return NextResponse.json(
            { error: 'Failed to fetch progress' },
            { status: 500 }
        )
    }
}
