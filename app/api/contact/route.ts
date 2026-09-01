import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            name, 
            email, 
            phone, 
            businessName, 
            businessType, 
            storeCount, 
            message, 
            selectedDate, 
            selectedTime, 
            monthName 
        } = body;

        // Ensure we have the minimum required fields
        if (!name || !email || !phone || !selectedDate || !selectedTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Send email via Resend
        const data = await resend.emails.send({
            from: 'HybridPOS Sales <sales@neogentechnologies.com>',
            to: ['arsalan@neogentechnologies.com', 'm.owais@neogentechnologies.com', 'aun@neogentechnologies.com'],
            subject: `New Demo Booking: ${businessName || name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">New Demo Booking Request</h2>
                    <p>A new demo has been booked via the contact page. Here are the details:</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-top: 0;">Contact Details</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</li>
                            <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
                            <li style="margin-bottom: 10px;"><strong>Phone:</strong> ${phone}</li>
                        </ul>

                        <h3>Business Details</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Business Name:</strong> ${businessName || 'N/A'}</li>
                            <li style="margin-bottom: 10px;"><strong>Industry:</strong> ${businessType}</li>
                            <li style="margin-bottom: 10px;"><strong>Stores:</strong> ${storeCount}</li>
                        </ul>

                        <h3>Booking Time</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Date:</strong> ${monthName.split(' ')[0]} ${selectedDate}, ${monthName.split(' ')[1]}</li>
                            <li style="margin-bottom: 10px;"><strong>Time:</strong> ${selectedTime}</li>
                        </ul>
                        
                        ${message ? `
                        <h3>Additional Message</h3>
                        <p style="white-space: pre-wrap;">${message}</p>
                        ` : ''}
                    </div>
                </div>
            `,
        });

        if (data.error) {
            console.error("Resend API error:", data.error);
            return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data.data?.id });
    } catch (error) {
        console.error("Contact API Route error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
