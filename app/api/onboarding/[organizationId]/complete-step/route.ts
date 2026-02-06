
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ organizationId: string }> }
) {
    try {
        const { organizationId } = await params
        const { step } = await request.json()

        if (!step) {
            return NextResponse.json(
                { error: 'Step ID is required' },
                { status: 400 }
            )
        }

        await db.query(
            `INSERT INTO onboarding_progress (organization_id, step_id, completed, completed_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (organization_id, step_id) 
       DO UPDATE SET completed = true, completed_at = NOW()`,
            [organizationId, step]
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('❌ Error completing step:', error)
        return NextResponse.json(
            { error: 'Failed to complete step' },
            { status: 500 }
        )
    }
}
