const { Client } = require('pg');

async function fixDb() {
    const client = new Client({
        connectionString: "postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db"
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
        console.log('Extensions created');

        // Create organizations table if missing
        await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        plan VARCHAR(50) DEFAULT 'basic',
        status VARCHAR(20) DEFAULT 'active',
        billing_email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        country VARCHAR(100),
        timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
        currency VARCHAR(10) DEFAULT 'PKR',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      )
    `);
        console.log('Organizations table ensured');

        // Add organization_id to users if missing
        await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id)
    `);
        console.log('users table updated');

        // Seed a default organization
        const orgId = '00000000-0000-0000-0000-000000000000';
        await client.query(`
      INSERT INTO organizations (id, name, slug)
      VALUES ($1, 'Default Organization', 'default')
      ON CONFLICT (id) DO NOTHING
    `, [orgId]);
        console.log('Default organization seeded');

        // Link admin user to default organization
        await client.query(`
      UPDATE users SET organization_id = $1 WHERE email = 'admin@hybrid.com'
    `, [orgId]);
        console.log('Admin user linked to organization');

        // Create system_settings table if missing
        await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID
      )
    `);
        console.log('system_settings table ensured');

        // Ensure maintenance_mode key exists
        const settingsExists = await client.query("SELECT 1 FROM system_settings WHERE key = 'maintenance_mode'");
        if (settingsExists.rows.length === 0) {
            await client.query("INSERT INTO system_settings (key, value) VALUES ('maintenance_mode', '{\"active\": false, \"endAt\": null}'::jsonb)");
            console.log('maintenance_mode initialized');
        }

    } catch (err) {
        console.error('Error fixing DB:', err);
    } finally {
        await client.end();
    }
}

fixDb();
