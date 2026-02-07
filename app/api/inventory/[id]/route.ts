import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const body = await request.json();
        const { name, sku, price, cost, stock, category_id, description, unit } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (sku !== undefined) updateData.sku = sku;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (cost !== undefined) updateData.cost = cost ? parseFloat(cost) : null;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (category_id !== undefined) updateData.category_id = category_id;
        if (description !== undefined) updateData.description = description;
        if (unit !== undefined) updateData.unit = unit;

        const product = await (prisma as any).products.update({
            where: { id },
            data: updateData,
            include: {
                categories: true
            }
        });

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        // check if has transactions
        const transactionCount = await (prisma as any).transaction_items.count({
            where: { product_id: id }
        });

        if (transactionCount > 0) {
            return NextResponse.json({
                error: 'Cannot delete product with existing transaction history'
            }, { status: 400 });
        }

        await (prisma as any).products.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
