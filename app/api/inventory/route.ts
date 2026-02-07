import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const query = searchParams.get('q');

        console.log('🔍 GET /api/inventory:', {
            user: session.user.email,
            role: session.user.role,
            organizationId: session.user.organizationId,
            categoryId,
            query
        });

        const where: any = {};

        if (categoryId) where.category_id = categoryId;
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ];
        }

        const products = await (prisma as any).products.findMany({
            where,
            include: {
                categories: true
            },
            orderBy: { name: 'asc' }
        });

        console.log(`✅ Found ${products.length} products`);
        if (products.length > 0) {
            console.log('Sample product:', JSON.stringify(products[0]).substring(0, 100));
        }

        return NextResponse.json(products);
    } catch (error: any) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, sku, price, cost, stock, category_id, description, unit } = body;

        if (!name || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await (prisma as any).products.create({
            data: {
                name,
                sku,
                price: parseFloat(price),
                cost: cost ? parseFloat(cost) : null,
                stock: parseInt(stock) || 0,
                category_id,
                description,
                unit: unit || 'Unit',
                // organization_id: session.user.organizationId // If organization tracking is strictly enforced
            },
            include: {
                categories: true
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
