import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { userId } = params

        // Get user details
        const user = await db.queryOne(
            'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
            [userId]
        )

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Generate a secure random password
        const newPassword = crypto.randomBytes(12).toString('base64').slice(0, 16)
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update user password
        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        )

        // Log the action
        await db.query(
            `INSERT INTO activity_logs (user_id, organization_id, action, details, created_at) 
             VALUES ($1, $2, $3, $4, NOW())`,
            [
                session.user.id,
                null,
                'PASSWORD_RESET',
                JSON.stringify({
                    target_user_id: userId,
                    target_user_email: user.email,
                    reset_by: session.user.email
                })
            ]
        )

        // In production, you would send an email here with the new password
        // For now, we'll return it in the response (ONLY for development)
        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
            // REMOVE THIS IN PRODUCTION - send via email instead
            temporaryPassword: newPassword,
            userEmail: user.email
        })
    } catch (error: any) {
        console.error('❌ Error resetting password:', error)
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        )
    }
}
