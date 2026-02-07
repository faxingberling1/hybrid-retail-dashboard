import { pool, query, queryOne } from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

// Re-implementing the function locally for the test
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

        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_at') THEN 
                    ALTER TABLE system_settings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP; 
                END IF;
            END $$;
        `)

        await query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_by') THEN 
                    ALTER TABLE system_settings ADD COLUMN updated_by TEXT; 
                ELSE
                    IF (SELECT data_type FROM information_schema.columns WHERE table_name='system_settings' AND column_name='updated_by') = 'uuid' THEN
                        ALTER TABLE system_settings ALTER COLUMN updated_by TYPE TEXT USING updated_by::TEXT;
                    END IF;
                END IF;
            END $$;
        `)

        const exists = await queryOne("SELECT 1 FROM system_settings WHERE key = 'maintenance_mode'")
        if (!exists) {
            await query("INSERT INTO system_settings (key, value) VALUES ('maintenance_mode', '{\"active\": false, \"endAt\": null}'::jsonb)")
        }
    } catch (error) {
        console.error('❌ Failed to initialize settings table:', error)
        throw error
    }
}

async function test() {
    console.log('--- Testing System Settings Fix ---');
    try {
        await initSettingsTable();
        console.log('✅ Initialization complete');

        const maintenanceData = { active: false, endAt: null };
        const userId = 'user-superadmin-001';

        console.log('🔄 Attempting update...');
        await query(
            `INSERT INTO system_settings (key, value, updated_at, updated_by) 
             VALUES ('maintenance_mode', $1, CURRENT_TIMESTAMP, $2) 
             ON CONFLICT (key) DO UPDATE 
             SET value = $1, updated_at = CURRENT_TIMESTAMP, updated_by = $2`,
            [JSON.stringify(maintenanceData), userId]
        );
        console.log('✅ Update successful');

        const result = await queryOne("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'system_settings' AND column_name = 'updated_by'");
        console.log('📊 Column updated_by info:', result);

    } catch (e) {
        console.error('❌ Test failed:', e);
    } finally {
        await pool.end();
    }
}

test();
