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

        // Send alert email to internal team
        const internalEmail = await resend.emails.send({
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

        if (internalEmail.error) {
            console.error("Resend API error (Internal):", internalEmail.error);
            return NextResponse.json({ error: 'Failed to send internal email via Resend' }, { status: 500 });
        }

        // Send confirmation email to the customer
        const customerEmail = await resend.emails.send({
            from: 'HybridPOS Sales <sales@neogentechnologies.com>',
            to: [email],
            subject: `Demo Booking Confirmed - HybridPOS`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">Your Demo is Confirmed!</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for booking a demo with HybridPOS. We have received your request and our sales team will be ready to walk you through our platform.</p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-top: 0;">Your Booking Details</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Date:</strong> ${monthName.split(' ')[0]} ${selectedDate}, ${monthName.split(' ')[1]}</li>
                            <li style="margin-bottom: 10px;"><strong>Time:</strong> ${selectedTime} (Pakistan Standard Time)</li>
                        </ul>
                    </div>
                    
                    <p style="margin-top: 20px;">If you need to reschedule or have any immediate questions, feel free to reply to this email or reach us on WhatsApp at +92 370 1335392.</p>
                    <p>Best regards,<br>The HybridPOS Team</p>
                </div>
            `,
        });

        if (customerEmail.error) {
            console.error("Resend API error (Customer):", customerEmail.error);
            // We still return success because the internal team got the email, but log the error
        }

        return NextResponse.json({ success: true, id: internalEmail.data?.id });
    } catch (error) {
        console.error("Contact API Route error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
