import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function migrate() {
  console.log('🚀 Starting Storefront Tenancy migration...')

  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    };

  const client = new Client(config)

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL')

    // 1. Create organization_storefronts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_storefronts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id TEXT UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        subdomain VARCHAR(255) UNIQUE,
        theme_config JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created organization_storefronts table')

    // 2. Add organization_id to storefront_categories
    await client.query(`
      ALTER TABLE storefront_categories 
      ADD COLUMN IF NOT EXISTS organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE
    `)
    console.log('✅ Added organization_id to storefront_categories')

    // 3. Add organization_id to storefront_products
    await client.query(`
      ALTER TABLE storefront_products 
      ADD COLUMN IF NOT EXISTS organization_id TEXT REFERENCES organizations(id) ON DELETE CASCADE
    `)
    console.log('✅ Added organization_id to storefront_products')

    console.log('🎉 Storefront Tenancy Migration completed successfully!')

  } catch (error) {
    console.error('❌ Storefront Tenancy Migration failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate().catch(console.error)
}

export { migrate }
