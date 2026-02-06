import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Client } from 'pg';

async function createOrganizationsTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        plan VARCHAR(50) DEFAULT 'basic',
        status VARCHAR(20) DEFAULT 'active',
        industry VARCHAR(100),
        business_type VARCHAR(100),
        employee_count VARCHAR(50),
        billing_email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        country VARCHAR(100),
        timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
        currency VARCHAR(10) DEFAULT 'PKR',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMPTZ
      )
    `);
    console.log('✅ Organizations table created');

    // Add foreign key to users table if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id)
    `);
    console.log('✅ Added organization_id to users table');

    // Create a default organization
    await client.query(`
      INSERT INTO organizations (name, slug, plan) 
      VALUES ('Default Organization', 'default-org', 'basic')
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Created default organization');

    console.log('🎉 Organizations table setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createOrganizationsTable().catch(console.error);
