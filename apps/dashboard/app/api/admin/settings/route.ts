
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const organizationId = session.user.organizationId
        const userId = session.user.id

        // Fetch organization info
        const organization = await db.queryOne(
            'SELECT name, billing_email, address, currency, timezone, settings FROM organizations WHERE id = $1',
            [organizationId]
        )

        // Fetch user notification preferences
        let notifications = await db.queryOne(
            'SELECT email_notifications, push_notifications, desktop_notifications, digest_frequency FROM notification_preferences WHERE user_id = $1',
            [userId]
        )

        if (!notifications) {
            // Default preferences if not found
            notifications = {
                email_notifications: true,
                push_notifications: true,
                desktop_notifications: true,
                digest_frequency: 'realtime'
            }
        }

        return NextResponse.json({
            organization,
            notifications
        })
    } catch (error: any) {
        console.error('❌ Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.organizationId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { organization, notifications } = await request.json()
        const organizationId = session.user.organizationId
        const userId = session.user.id

        // Update organization
        await db.query(
            `UPDATE organizations 
             SET name = $1, billing_email = $2, address = $3, currency = $4, timezone = $5, settings = $6, updated_at = NOW() 
             WHERE id = $7`,
            [
                organization.name,
                organization.billing_email,
                organization.address,
                organization.currency,
                organization.timezone,
                JSON.stringify(organization.settings || {}),
                organizationId
            ]
        )

        // Update or Insert notification preferences
        const existingPrefs = await db.queryOne(
            'SELECT 1 FROM notification_preferences WHERE user_id = $1',
            [userId]
        )

        if (existingPrefs) {
            await db.query(
                `UPDATE notification_preferences 
                 SET email_notifications = $1, push_notifications = $2, desktop_notifications = $3, digest_frequency = $4 
                 WHERE user_id = $5`,
                [
                    notifications.email_notifications,
                    notifications.push_notifications,
                    notifications.desktop_notifications,
                    notifications.digest_frequency,
                    userId
                ]
            )
        } else {
            await db.query(
                `INSERT INTO notification_preferences (user_id, email_notifications, push_notifications, desktop_notifications, digest_frequency)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    userId,
                    notifications.email_notifications,
                    notifications.push_notifications,
                    notifications.desktop_notifications,
                    notifications.digest_frequency
                ]
            )
        }

        return NextResponse.json({ success: true, message: 'Settings updated successfully' })
    } catch (error: any) {
        console.error('❌ Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}
