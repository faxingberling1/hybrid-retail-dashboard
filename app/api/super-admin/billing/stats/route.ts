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

        const [revenueStats, monthOverMonth, planDistribution] = await Promise.all([
            // Total Revenue, Pending, Overdue
            db.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_revenue,
                    COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_payments,
                    COALESCE(SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END), 0) as overdue_payments
                FROM invoices
            `),
            // Month over Month Revenue
            db.query(`
                SELECT 
                    TO_CHAR(created_at, 'Mon') as name,
                    SUM(amount) as revenue
                FROM invoices
                WHERE created_at >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
                ORDER BY DATE_TRUNC('month', created_at)
            `),
            // Plan Distribution
            db.query(`
                SELECT plan as name, COUNT(*) as value
                FROM subscriptions
                WHERE status = 'active'
                GROUP BY plan
            `)
        ]);

        const stats = revenueStats.rows[0];

        // Add-on revenue is a bit trickier since it's JSONB in subscriptions. 
        // For now, we'll return a placeholder or calculate if we have a robust way.
        // Let's try a simple aggregation from subscriptions JSONB if possible.
        const addonRevenue = await db.queryOne(`
            SELECT SUM((item->>'price')::decimal * (item->>'quantity')::int) as addon_total
            FROM subscriptions s,
            jsonb_array_elements(s.add_ons) as item
            WHERE s.status = 'active'
        `);

        return NextResponse.json({
            stats: [
                { title: "Total Revenue", value: stats.total_revenue, change: "+12%", color: "bg-green-100 text-green-600" },
                { title: "Pending Payments", value: stats.pending_payments, change: "-5%", color: "bg-yellow-100 text-yellow-600" },
                { title: "Overdue Payments", value: stats.overdue_payments, change: "+2%", color: "bg-red-100 text-red-600" },
                { title: "Add-on Revenue", value: addonRevenue?.addon_total || 0, change: "+18%", color: "bg-purple-100 text-purple-600" },
            ],
            revenueData: monthOverMonth.rows,
            planDistribution: planDistribution.rows
        });
    } catch (error: any) {
        console.error('❌ Error in billing stats API:', error);
        return NextResponse.json({ error: 'Failed to fetch billing stats' }, { status: 500 });
    }
}
