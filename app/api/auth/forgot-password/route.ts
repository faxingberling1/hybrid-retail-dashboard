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
            await sendPasswordResetEmail(user.email, token);
        } else {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await db.query(
                'UPDATE users SET otp_code = $1, otp_expires = $2 WHERE id = $3',
                [otp, expiry, user.id]
            );
            await sendPasswordResetSMS(user.phone, otp);
        }

        return NextResponse.json({ message: 'Reset instruction sent successfully.' });
    } catch (error: any) {
        console.error('❌ Forgot Password API Error:', error);
        return NextResponse.json({ error: 'Request failed. Please try again later.' }, { status: 500 });
    }
}
