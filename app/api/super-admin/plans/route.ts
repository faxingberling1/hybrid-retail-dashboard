
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all active plans
export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            where: { is_active: true },
            orderBy: { price: 'asc' },
        });
        return NextResponse.json(plans);
    } catch (error) {
        console.error('Failed to fetch plans:', error);
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

// POST: Create a new plan
export async function POST(req: Request) {
    try {
        const { name, price, interval, features } = await req.json();

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const newPlan = await prisma.plan.create({
            data: {
                name,
                price,
                interval: interval || 'month',
                features: features || [],
            },
        });

        return NextResponse.json(newPlan);
    } catch (error) {
        console.error('Failed to create plan:', error);
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}
