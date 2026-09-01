import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const monthName = searchParams.get('monthName');

        if (!monthName) {
            return NextResponse.json({ error: 'Missing monthName parameter' }, { status: 400 });
        }

        // Fetch all bookings for the requested month
        const bookings = await prisma.demoBooking.findMany({
            where: {
                monthName
            },
            select: {
                selectedDate: true,
                selectedTime: true
            }
        });

        return NextResponse.json({ success: true, bookings });
    } catch (error) {
        console.error('Fetch Bookings API Route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

