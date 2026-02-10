import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { plan, add_ons } = await request.json();

        console.log(`🔄 Syncing subscription for organization: ${id}`);
        console.log(`📦 Plan: ${plan}`);
        console.log(`🔌 Add-ons received:`, add_ons);
        console.log(`🔌 Add-ons JSON:`, JSON.stringify(add_ons));

        // Check if subscription exists
        const existingSub = await db.queryOne(
            'SELECT id FROM subscriptions WHERE organization_id = $1 AND status = \'active\'',
            [id]
        );

        if (existingSub) {
            // Update existing subscription
            await db.query(`
                UPDATE subscriptions 
                SET plan = $1, add_ons = $2, updated_at = NOW()
                WHERE id = $3
            `, [plan, JSON.stringify(add_ons), existingSub.id]);
            console.log(`✅ Updated existing subscription ${existingSub.id} with ${add_ons.length} add-ons`);
        } else {
            // Create new subscription if none active
            const result = await db.query(`
                INSERT INTO subscriptions (
                    organization_id, 
                    plan, 
                    add_ons, 
                    status, 
                    current_period_start, 
                    current_period_end, 
                    created_at, 
                    updated_at
                )
                VALUES ($1, $2, $3, 'active', NOW(), NOW() + interval '1 month', NOW(), NOW())
                RETURNING id
            `, [id, plan, JSON.stringify(add_ons)]);
            console.log(`✅ Created new subscription ${result.rows[0].id} with ${add_ons.length} add-ons`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('❌ Error syncing organization subscription:', error);
        return NextResponse.json({ error: 'Failed to sync subscription' }, { status: 500 });
    }
}
