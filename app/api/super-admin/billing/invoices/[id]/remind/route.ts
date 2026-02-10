import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { message } = data;

        // 1. Get invoice and organization details
        const invoice = await db.queryOne(`
            SELECT i.*, o.name as organization_name 
            FROM invoices i 
            JOIN organizations o ON i.organization_id = o.id 
            WHERE i.id = $1
        `, [id]);

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // 2. Get organization admin or a user to notify
        const user = await db.queryOne('SELECT id FROM users WHERE organization_id = $1 LIMIT 1', [invoice.organization_id.toString()]);

        if (user) {
            // 3. Create notification
            await db.query(`
                INSERT INTO notifications (id, user_id, title, message, type, priority, created_at)
                VALUES ($1, $2, $3, $4, 'billing', 'high', NOW())
            `, [
                uuidv4(),
                user.id,
                `Payment Reminder: ${invoice.invoice_number}`,
                message || `This is a reminder to settle your outstanding invoice ${invoice.invoice_number} of amount ${invoice.amount}.`
            ]);
        }

        return NextResponse.json({ message: 'Reminder sent successfully' });
    } catch (error: any) {
        console.error('❌ Error sending reminder:', error);
        return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 });
    }
}
