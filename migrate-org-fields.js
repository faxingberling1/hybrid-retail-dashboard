// Simple migration script to add organization fields
// Run with: node migrate-org-fields.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function runMigration() {
    // Get DATABASE_URL from environment
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error('❌ DATABASE_URL environment variable not set');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: databaseUrl,
    });

    try {
        console.log('🚀 Starting migration...\n');

        // Add new columns to organizations table
        console.log('📝 Adding columns to organizations table...');
        await pool.query(`
      ALTER TABLE organizations 
      ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan'
    `);
        console.log('✅ Added columns to organizations table\n');

        // Update industry column type
        console.log('📝 Updating industry column type...');
        await pool.query(`
      ALTER TABLE organizations 
      ALTER COLUMN industry TYPE VARCHAR(100)
    `);
        console.log('✅ Updated industry column type\n');

        // Add add_ons column to subscriptions table
        console.log('📝 Adding add_ons column to subscriptions table...');
        await pool.query(`
      ALTER TABLE subscriptions 
      ADD COLUMN IF NOT EXISTS add_ons JSONB
    `);
        console.log('✅ Added add_ons column to subscriptions table\n');

        // Create indexes
        console.log('📝 Creating indexes...');
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry)
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_organizations_city ON organizations(city)
    `);
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status)
    `);
        console.log('✅ Created indexes\n');

        console.log('🎉 Migration completed successfully!');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        await pool.end();
        process.exit(1);
    }
}

runMigration();
