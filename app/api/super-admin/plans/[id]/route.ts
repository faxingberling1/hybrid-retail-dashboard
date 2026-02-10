
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const data = await req.json();

        const updatedPlan = await prisma.plan.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error('Failed to update plan:', error);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
        }

        // Use delete for precision; await params prevents the "id=undefined" bulk delete bug
        await prisma.plan.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Handle record not found gracefully even with .delete()
        if (error.code === 'P2025') {
            return NextResponse.json({ success: true, message: 'Record already deleted' });
        }
        console.error('Failed to delete plan:', error);
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
