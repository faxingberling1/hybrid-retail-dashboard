import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orgs = await db.query(`
            SELECT 
                o.id, 
                o.name, 
                o.status as org_status,
                s.plan,
                s.status as subscription_status,
                s.add_ons,
                s.current_period_end,
                (
                    SELECT COALESCE(SUM(amount), 0) 
                    FROM invoices 
                    WHERE organization_id = o.id AND status = 'paid'
                ) as total_paid,
                (
                    SELECT COALESCE(SUM(amount), 0) 
                    FROM invoices 
                    WHERE organization_id = o.id AND status != 'paid'
                ) as total_pending,
                (
                    SELECT COUNT(*) 
                    FROM users 
                    WHERE organization_id = o.id::text
                ) as user_count
            FROM organizations o
            LEFT JOIN subscriptions s ON o.id = s.organization_id AND s.status = 'active'
            ORDER BY o.name ASC
        `);

        return NextResponse.json({ organizations: orgs.rows });
    } catch (error: any) {
        console.error('❌ Error in billing organizations API:', error);
        return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }
}
