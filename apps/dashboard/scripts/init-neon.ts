import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function initNeon() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in environment');
        process.exit(1);
    }

    console.log('📡 Connecting to Neon database...');
    const client = new Client({
        connectionString,
        ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected');

        console.log('📦 Enabling extensions...');
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
        console.log('✅ Extensions enabled');

        console.log('🏢 Seeding default organization...');
        const orgId = '00000000-0000-0000-0000-000000000000';
        await client.query(`
            INSERT INTO organizations (id, name, slug, plan, status)
            VALUES ($1, 'Default Organization', 'default', 'enterprise', 'active')
            ON CONFLICT (id) DO NOTHING
        `, [orgId]);
        console.log('✅ Default organization ensured');

        console.log('⚙️ Initializing system settings...');
        await client.query(`
            INSERT INTO system_settings (key, value)
            VALUES ('maintenance_mode', 'false'::jsonb)
            ON CONFLICT (key) DO NOTHING
        `);
        console.log('✅ System settings initialized');

        // Check if admin user exists and link them
        const adminEmail = 'admin@hybrid.com';
        const userRes = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (userRes.rows.length > 0) {
            await client.query('UPDATE users SET organization_id = $1 WHERE email = $2', [orgId, adminEmail]);
            console.log(`✅ Admin user (${adminEmail}) linked to default organization`);
        } else {
            console.log(`⚠️ Admin user (${adminEmail}) not found. Skipping link.`);
        }

        console.log('\n✨ Database initialization complete');

    } catch (err) {
        console.error('❌ Error during initialization:', err);
    } finally {
        await client.end();
    }
}

initNeon();
