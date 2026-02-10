import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
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
        const { status } = data;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updateData: any = { status };
        let query = 'UPDATE invoices SET status = $1';
        const queryParams = [status];

        if (status === 'paid') {
            query += ', paid_at = NOW()';
        } else if (status === 'pending') {
            query += ', paid_at = NULL';
        }

        query += ' WHERE id = $2 RETURNING *';
        queryParams.push(id);

        const updatedInvoice = await db.queryOne(query, queryParams);

        if (!updatedInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ invoice: updatedInvoice });
    } catch (error: any) {
        console.error('❌ Error updating invoice:', error);
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}
