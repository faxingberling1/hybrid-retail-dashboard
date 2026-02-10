
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all active add-ons
export async function GET() {
    try {
        const addons = await prisma.addon.findMany({
            where: { is_active: true },
            orderBy: { created_at: 'asc' },
        });
        return NextResponse.json(addons);
    } catch (error) {
        console.error('Failed to fetch add-ons:', error);
        return NextResponse.json({ error: 'Failed to fetch add-ons' }, { status: 500 });
    }
}

// POST: Create a new add-on
export async function POST(req: Request) {
    try {
        const { name, price, description, icon, interval } = await req.json();

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const newAddon = await prisma.addon.create({
            data: {
                name,
                price,
                description,
                icon,
                interval: interval || 'month',
            },
        });

        return NextResponse.json(newAddon);
    } catch (error) {
        console.error('Failed to create add-on:', error);
        return NextResponse.json({ error: 'Failed to create add-on' }, { status: 500 });
    }
}
