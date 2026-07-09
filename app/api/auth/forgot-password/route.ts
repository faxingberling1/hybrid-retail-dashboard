import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { sendPasswordResetSMS } from '@/lib/sms';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { method, identifier } = await request.json();

        if (!method || !identifier) {
            return NextResponse.json({ error: 'Missing method or identifier' }, { status: 400 });
        }

        const user = await db.queryOne(
            `SELECT id, email, phone FROM users WHERE ${method === 'email' ? 'email' : 'phone'} = $1 AND is_active = true`,
            [identifier]
        );

        if (!user) {
            // Generic message for security
            return NextResponse.json({ message: 'If the account exists, a reset link/code has been sent.' });
        }

        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        if (method === 'email') {
            const token = crypto.randomBytes(32).toString('hex');
            await db.query(
                'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
                [token, expiry, user.id]
            );
            // In a real environment, this would send an email
            try {
                await sendPasswordResetEmail(user.email, token);
            } catch (e) {
                console.warn('Email sending failed (normal for demo mode).');
            }
            
            const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
            console.log("====================================");
            console.log("DEMO FORGOT PASSWORD LINK:");
            console.log(resetLink);
            console.log("====================================");

            return NextResponse.json({ 
                message: 'Reset instruction sent successfully.',
                _demoLink: resetLink 
            });
        } else {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await db.query(
                'UPDATE users SET otp_code = $1, otp_expires = $2 WHERE id = $3',
                [otp, expiry, user.id]
            );
            try {
                await sendPasswordResetSMS(user.phone, otp);
            } catch (e) {
                console.warn('SMS sending failed (normal for demo mode).');
            }

            console.log("====================================");
            console.log("DEMO OTP:", otp);
            console.log("====================================");

            return NextResponse.json({ 
                message: 'Reset instruction sent successfully.',
                _demoOtp: otp
            });
        }
    } catch (error: any) {
        console.error('❌ Forgot Password API Error:', error);
        return NextResponse.json({ error: 'Request failed. Please try again later.' }, { status: 500 });
    }
}
