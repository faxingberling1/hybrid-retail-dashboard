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
                updated_by UUID
            )
        `)

        // Ensure updated_at column exists (migration for existing tables)
        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_at') THEN 
                    ALTER TABLE system_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP; 
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
            if (typeof setting.value === 'object' && setting.value !== null) {
                maintenance = { ...maintenance, ...setting.value }
            } else {
                maintenance.active = setting.value === true || setting.value === 'true'
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

        return NextResponse.json({ success: true, maintenanceData })
    } catch (error: any) {
        console.error('❌ Setting update error:', error)
        return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
    }
}
