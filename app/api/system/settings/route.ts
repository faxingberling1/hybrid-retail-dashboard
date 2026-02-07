import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize table if not exists, and migrate if needed
async function initSettingsTable() {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS system_settings (
                key VARCHAR(100) PRIMARY KEY,
                value JSONB,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_by TEXT
            )
        `)

        // Ensure updated_at column exists
        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_at') THEN 
                    ALTER TABLE system_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP; 
                END IF;
            END $$;
        `)

        // Ensure updated_by column exists and is TEXT
        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_by') THEN 
                    ALTER TABLE system_settings ADD COLUMN updated_by TEXT; 
                ELSE
                    -- If it exists but is UUID (old behavior), convert to TEXT
                    IF (SELECT data_type FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_by') = 'uuid' THEN
                        ALTER TABLE system_settings ALTER COLUMN updated_by TYPE TEXT USING updated_by::TEXT;
                    END IF;
                END IF;
            END $$;
        `)

        // Ensure maintenance_mode key exists
        const exists = await queryOne("SELECT 1 FROM system_settings WHERE key = 'maintenance_mode'")
        if (!exists) {
            await query("INSERT INTO system_settings (key, value) VALUES ('maintenance_mode', '{\"active\": false, \"endAt\": null}'::jsonb)")
        }
    } catch (error) {
        console.error('❌ Failed to initialize settings table:', error)
        throw error
    }
}

export async function GET() {
    try {
        await initSettingsTable()
        const setting = await queryOne("SELECT value, updated_at FROM system_settings WHERE key = 'maintenance_mode'")

        // Handle both legacy boolean/string and new object format
        let maintenance = { active: false, endAt: null }
        if (setting?.value) {
            let val = setting.value
            if (typeof val === 'string') {
                try {
                    val = JSON.parse(val)
                } catch (e) {
                    // Fallback for raw legacy string values
                    maintenance.active = val === 'true'
                    val = null
                }
            }

            if (val && typeof val === 'object') {
                maintenance = { ...maintenance, ...val }
            } else if (val !== null) {
                maintenance.active = val === true
            }
        }

        return NextResponse.json({
            maintenanceMode: maintenance.active,
            maintenanceEndAt: maintenance.endAt,
            maintenanceStartAt: setting?.updated_at || null,
            maintenanceData: maintenance
        })
    } catch (error: any) {
        console.error('❌ GET Settings Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { maintenanceMode, maintenanceEndAt } = body

        const maintenanceData = {
            active: !!maintenanceMode,
            endAt: maintenanceEndAt || null
        }

        console.log('🔄 Updating Maintenance Mode:', maintenanceData)

        await initSettingsTable()
        const userId = (session.user as any)?.id

        await query(
            `INSERT INTO system_settings (key, value, updated_at, updated_by) 
             VALUES ('maintenance_mode', $1, CURRENT_TIMESTAMP, $2) 
             ON CONFLICT (key) DO UPDATE 
             SET value = $1, updated_at = CURRENT_TIMESTAMP, updated_by = $2`,
            [JSON.stringify(maintenanceData), userId]
        )

        // Notify SuperAdmins about maintenance mode change
        try {
            const { NotificationService } = await import('@/lib/services/notification.service');
            await NotificationService.sendSuperAdminNotification(
                '⚙️ System Setting Update',
                `Maintenance Mode has been ${maintenanceData.active ? 'ENABLED' : 'DISABLED'} by ${session.user.name || session.user.email}.`,
                maintenanceData.active ? 'warning' : 'success',
                {
                    setting: 'maintenance_mode',
                    active: maintenanceData.active,
                    end_at: maintenanceData.endAt,
                    action_url: `/super-admin/settings`
                }
            );
        } catch (notifyError) {
            console.error('Failed to notify super admins about settings change:', notifyError);
        }

        return NextResponse.json({ success: true, maintenanceData })
    } catch (error: any) {
        console.error('❌ Setting update error:', error)
        return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
    }
}
