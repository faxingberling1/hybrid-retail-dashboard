import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch all active equipments
export async function GET() {
    try {
        const equipments = await db.query(
            `SELECT * FROM equipments WHERE is_active = true ORDER BY created_at ASC`
        );
        return NextResponse.json(equipments.rows);
    } catch (error) {
        console.error('Failed to fetch equipments:', error);
        return NextResponse.json({ error: 'Failed to fetch equipments' }, { status: 500 });
    }
}

// POST: Create a new equipment
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, price, description, type } = body;

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const result = await db.query(
            `INSERT INTO equipments (name, description, price, type) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, description || null, price, type || 'Hardware']
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to create equipment:', error);
        return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
    }
}
