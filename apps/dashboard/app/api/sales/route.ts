import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, totalAmount, paymentMethod, description } = body;

        if (!items || !items.length || !totalAmount) {
            return NextResponse.json({ error: 'Invalid sale data' }, { status: 400 });
        }

        // Perform transaction to ensure atomic stock deduction and sale creation
        const result = await (prisma as any).$transaction(async (tx: any) => {
            // 1. Create the main transaction record
            const transaction = await tx.transactions.create({
                data: {
                    user_id: session.user.id,
                    amount: totalAmount,
                    payment_method: paymentMethod || 'CASH',
                    status: 'COMPLETED',
                    description: description || 'Sale from Quick Sale',
                    // organization_id: session.user.organizationId
                }
            });

            // 2. Create transaction items and update stock
            const transactionItems = [];
            for (const item of items) {
                // Create the record
                const txnItem = await tx.transactionItem.create({
                    data: {
                        transaction_id: transaction.id,
                        product_id: item.id,
                        quantity: item.qty,
                        unit_price: item.price,
                        total_price: item.price * item.qty
                    }
                });
                transactionItems.push(txnItem);

                // Update stock level
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                });

                if (!product) {
                    throw new Error(`Product ${item.id} not found`);
                }

                if (product.stock < item.qty) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.qty
                        }
                    }
                });
            }

            return { transaction, transactionItems };
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Error processing sale:', error);
        return NextResponse.json({ error: 'Transaction failed', message: error.message }, { status: 500 });
    }
}
