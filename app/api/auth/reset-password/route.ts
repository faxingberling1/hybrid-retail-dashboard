import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/server-auth-utils';

export async function POST(request: NextRequest) {
    try {
        const { token, otp, identifier, newPassword } = await request.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        let user;

        if (token) {
            user = await db.queryOne(
                'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
                [token]
            );
        } else if (otp && identifier) {
            user = await db.queryOne(
                'SELECT id FROM users WHERE otp_code = $1 AND phone = $2 AND otp_expires > NOW()',
                [otp, identifier]
            );
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset token/code' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await db.query(
            `UPDATE users SET 
                password_hash = $1, 
                reset_token = NULL, 
                reset_token_expires = NULL, 
                otp_code = NULL, 
                otp_expires = NULL,
                updated_at = NOW()
            WHERE id = $2`,
            [hashedPassword, user.id]
        );

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('❌ Reset Password API Error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
