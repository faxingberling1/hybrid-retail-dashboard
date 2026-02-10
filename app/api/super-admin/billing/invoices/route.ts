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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const orgId = searchParams.get('orgId');
        const search = searchParams.get('search');

        let query = `
            SELECT i.*, o.name as organization_name, s.plan,
            (SELECT COUNT(*) FROM users u WHERE u.organization_id = o.id::text) as user_count
            FROM invoices i
            JOIN organizations o ON i.organization_id = o.id::text
            LEFT JOIN subscriptions s ON i.subscription_id = s.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (status && status !== 'all') {
            params.push(status);
            query += ` AND i.status = $${params.length}`;
        }

        if (orgId) {
            params.push(orgId);
            query += ` AND i.organization_id = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (i.invoice_number ILIKE $${params.length} OR o.name ILIKE $${params.length})`;
        }

        query += ` ORDER BY i.created_at DESC`;

        const invoices = await db.query(query, params);

        return NextResponse.json({ invoices: invoices.rows });
    } catch (error: any) {
        console.error('❌ Error in billing invoices API:', error);
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { organization_id, amount, due_date, notes, items } = data;

        // Generate invoice number: INV-YEAR-MONTH-RANDOM
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        const invoice_number = `INV-${year}${month}-${random}`;

        const newInvoice = await db.queryOne(`
            INSERT INTO invoices (
                organization_id, 
                invoice_number, 
                amount, 
                status, 
                due_date, 
                notes, 
                items,
                created_at
            )
            VALUES ($1, $2, $3, 'pending', $4, $5, $6, NOW())
            RETURNING *
        `, [organization_id, invoice_number, amount, due_date, notes, JSON.stringify(items || [])]);

        return NextResponse.json({ invoice: newInvoice });
    } catch (error: any) {
        console.error('❌ Error creating invoice:', error);
        return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
}
