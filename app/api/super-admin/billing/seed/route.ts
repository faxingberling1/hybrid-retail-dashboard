import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get a random organization
        const org = await db.queryOne('SELECT id, name FROM organizations LIMIT 1');
        if (!org) {
            return NextResponse.json({ error: 'No organization found to seed invoice' }, { status: 400 });
        }

        // 2. Insert Demo Invoice
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        const invoice_number = `DEMO-${year}${month}-${random}`;

        const demoInvoice = await db.queryOne(`
            INSERT INTO invoices (
                id,
                organization_id, 
                invoice_number, 
                amount, 
                currency,
                status, 
                due_date, 
                notes, 
                is_shared,
                shared_at,
                created_at
            )
            VALUES (gen_random_uuid(), $1, $2, $3, 'PKR', 'pending', NOW() + interval '14 days', 'Demo invoice for testing data synchronization.', true, NOW(), NOW())
            RETURNING *
        `, [org.id, invoice_number, 15000]);

        // 3. Optional: Add a notification for the organization admin
        const orgAdmin = await db.queryOne('SELECT id FROM users WHERE organization_id = $1 LIMIT 1', [org.id.toString()]);
        if (orgAdmin) {
            await db.query(`
                INSERT INTO notifications (id, user_id, title, message, type, priority, created_at)
                VALUES (gen_random_uuid(), $1, 'New Invoice Shared', 'A new demo invoice ${invoice_number} has been shared with your organization dashboard.', 'billing', 'high', NOW())
            `, [orgAdmin.id]);
        }

        return NextResponse.json({
            message: 'Demo data seeded successfully',
            invoice: demoInvoice,
            organization: org.name,
            notificationSent: !!orgAdmin
        });
    } catch (error: any) {
        console.error('❌ Error seeding demo data:', error);
        return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
    }
}
