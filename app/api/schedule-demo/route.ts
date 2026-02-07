import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            email,
            date,
            businessName,
            businessType,
            industry,
            monthlyRevenue
        } = body;

        // Validate required fields
        if (!name || !email || !date || !businessName || !industry) {
            return NextResponse.json(
                { error: 'Missing required sync parameters' },
                { status: 400 }
            );
        }

        console.log('Demo Scheduled:', {
            name, email, date, businessName, businessType, industry, monthlyRevenue
        });

        // In a real app, you'd save to DB or send to a CRM
        return NextResponse.json({
            success: true,
            message: 'Demo slot synchronized successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Matrix Error' },
            { status: 500 }
        );
    }
}
