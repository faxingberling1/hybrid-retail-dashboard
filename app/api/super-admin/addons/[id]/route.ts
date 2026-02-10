
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const data = await req.json();

        const updatedAddon = await prisma.addon.update({
            where: { id },
            data,
        });

        return NextResponse.json(updatedAddon);
    } catch (error) {
        console.error('Failed to update add-on:', error);
        return NextResponse.json({ error: 'Failed to update add-on' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
        }

        // Use delete for precision; await params prevents the "id=undefined" bulk delete bug
        await prisma.addon.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        // Handle record not found gracefully even with .delete()
        if (error.code === 'P2025') {
            return NextResponse.json({ success: true, message: 'Record already deleted' });
        }
        console.error('Failed to delete add-on:', error);
        return NextResponse.json({ error: 'Failed to delete add-on' }, { status: 500 });
    }
}
