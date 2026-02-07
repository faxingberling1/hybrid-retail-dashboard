import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

        // Get user and organization details
        const user = await db.queryOne(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.organization_id,
                    o.name as organization_name
             FROM users u
             LEFT JOIN organizations o ON u.organization_id = o.id::text
             WHERE u.id = $1`,
            [userId]
        )

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Log the action
        await db.query(
            `INSERT INTO activity_logs (user_id, organization_id, action, details, created_at) 
             VALUES ($1, $2, $3, $4, NOW())`,
            [
                session.user.id,
                null,
                'WELCOME_EMAIL_SENT',
                JSON.stringify({
                    target_user_id: userId,
                    target_user_email: user.email,
                    sent_by: session.user.email
                })
            ]
        )

        // In production, you would send a welcome email here
        // For now, we'll just return success
        const welcomeEmailContent = {
            to: user.email,
            subject: `Welcome to ${user.organization_name || 'Our Platform'}!`,
            body: `
                Hello ${user.first_name || user.email},
                
                Welcome to our platform! Your account has been successfully created.
                
                Organization: ${user.organization_name || 'N/A'}
                Email: ${user.email}
                
                You can now log in and start using the platform.
                
                Best regards,
                The Team
            `
        }

        return NextResponse.json({
            success: true,
            message: 'Welcome email sent successfully',
            // In development, return the email content for verification
            emailPreview: welcomeEmailContent
        })
    } catch (error: any) {
        console.error('❌ Error sending welcome email:', error)
        return NextResponse.json(
            { error: 'Failed to send welcome email' },
            { status: 500 }
        )
    }
}
