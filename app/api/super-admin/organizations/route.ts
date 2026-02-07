
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NotificationService } from '@/lib/services/notification.service'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch organizations with aggregated data including industry, add-ons, and contact info
        const organizations = await db.query(`
            SELECT 
                o.id, 
                o.name, 
                o.status, 
                o.industry,
                o.business_type,
                o.contact_person,
                o.contact_email,
                o.contact_phone,
                o.address,
                o.city,
                o.country,
                o.created_at,
                (SELECT COUNT(*) FROM users u WHERE u.organization_id = o.id::text) as user_count,
                (SELECT plan FROM subscriptions s WHERE s.organization_id = o.id AND s.status = 'active' LIMIT 1) as current_plan,
                (SELECT add_ons FROM subscriptions s WHERE s.organization_id = o.id AND s.status = 'active' LIMIT 1) as add_ons,
                (SELECT current_period_start FROM subscriptions s WHERE s.organization_id = o.id AND s.status = 'active' LIMIT 1) as subscription_start,
                (SELECT current_period_end FROM subscriptions s WHERE s.organization_id = o.id AND s.status = 'active' LIMIT 1) as subscription_end,
                (SELECT SUM(amount) FROM transactions t WHERE t.organization_id = o.id AND t.status = 'success') as total_revenue,
                (SELECT created_at FROM activity_logs al WHERE al.organization_id = o.id ORDER BY created_at DESC LIMIT 1) as last_activity,
                EXISTS (
                    SELECT 1 FROM notifications n 
                    WHERE n.user_id = $1 
                    AND n.read = false 
                    AND n.metadata->>'entityId' = o.id::text
                    AND n.metadata->>'category' = 'ORGANIZATION'
                ) as is_unread
            FROM organizations o
            ORDER BY o.created_at DESC
        `, [session.user.id])

        return NextResponse.json(organizations.rows)
    } catch (error: any) {
        console.error('❌ Error fetching organizations for super-admin:', error)
        return NextResponse.json(
            { error: 'Failed to fetch organizations' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('🔵 POST /api/super-admin/organizations - Request received')

        const session = await getServerSession(authOptions)
        console.log('🔵 Session:', session ? `User: ${session.user.email}, Role: ${session.user.role}` : 'No session')

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            console.log('❌ Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        console.log('🔵 Request data:', { ...data, contact_email: data.contact_email ? '***' : undefined })

        const {
            name,
            industry,
            business_type,
            contact_person,
            contact_email,
            contact_phone,
            address,
            city,
            country,
            plan,
            add_ons
        } = data

        // Validate required fields
        if (!name || !contact_email) {
            console.log('❌ Validation failed: missing required fields')
            return NextResponse.json(
                { error: 'Organization name and contact email are required' },
                { status: 400 }
            )
        }

        console.log('🔵 Creating organization...')

        // Create organization - explicitly generate UUID
        const newOrg = await db.queryOne(
            `INSERT INTO organizations (
                id, name, industry, business_type, contact_person, contact_email, 
                contact_phone, address, city, country, status, created_at, updated_at
            ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
            RETURNING *`,
            [
                name,
                industry || null,
                business_type || null,
                contact_person || null,
                contact_email,
                contact_phone || null,
                address || null,
                city || null,
                country || 'Pakistan',
                'active'
            ]
        )

        console.log('✅ Organization created:', newOrg?.id)

        // Create subscription if plan is provided
        if (plan && newOrg) {
            const periodStart = new Date()
            const periodEnd = new Date()
            periodEnd.setMonth(periodEnd.getMonth() + 1) // 1 month subscription

            await db.query(
                `INSERT INTO subscriptions (
                    organization_id, plan, add_ons, status, 
                    current_period_start, current_period_end, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
                [
                    newOrg.id,
                    plan,
                    add_ons ? JSON.stringify(add_ons) : null,
                    'active',
                    periodStart,
                    periodEnd
                ]
            )
        }

        // Log the action
        await db.query(
            `INSERT INTO activity_logs (user_id, organization_id, action, entity_type, entity_id, details, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
                session.user.id,
                newOrg.id,
                'ORGANIZATION_CREATED',
                'organization',
                newOrg.id,
                JSON.stringify({
                    organization_name: name,
                    created_by: session.user.email
                })
            ]
        )

        return NextResponse.json(newOrg, { status: 201 })
    } catch (error: any) {
        console.error('❌ Error creating organization:', error)
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        return NextResponse.json(
            { error: error.message || 'Failed to create organization' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const { id, status } = data

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updated = await db.queryOne(
            'UPDATE organizations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        )

        if (!updated) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        return NextResponse.json(updated)
    } catch (error: any) {
        console.error('❌ Error updating organization status:', error)
        return NextResponse.json(
            { error: 'Failed to update organization' },
            { status: 500 }
        )
    }
}
