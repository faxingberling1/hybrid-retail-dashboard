import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { isShared } = await request.json();

        // Update invoice sharing status
        const updatedInvoice = await db.queryOne(`
            UPDATE invoices 
            SET is_shared = $1, shared_at = CASE WHEN $1 THEN NOW() ELSE NULL END
            WHERE id = $2
            RETURNING *
        `, [isShared, id]);

        if (!updatedInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // If shared, send a notification to the organization's admin
        if (isShared) {
            // Find organization owner/admin
            const orgAdmin = await db.queryOne(`
                SELECT id FROM users 
                WHERE organization_id = $1::text AND role = 'ADMIN'
                LIMIT 1
            `, [updatedInvoice.organization_id]);

            if (orgAdmin) {
                await db.query(`
                    INSERT INTO notifications (user_id, title, message, type, metadata, created_at)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                `, [
                    orgAdmin.id,
                    'New Invoice Available',
                    `Invoice ${updatedInvoice.invoice_number} for ${updatedInvoice.amount} ${updatedInvoice.currency} is now available in your dashboard.`,
                    'billing',
                    JSON.stringify({ invoiceId: id, invoiceNumber: updatedInvoice.invoice_number })
                ]);
            }
        }

        return NextResponse.json({ message: `Invoice ${isShared ? 'shared' : 'unshared'} successfully` });
    } catch (error: any) {
        console.error('❌ Error sharing invoice:', error);
        return NextResponse.json({ error: 'Failed to share invoice' }, { status: 500 });
    }
}
