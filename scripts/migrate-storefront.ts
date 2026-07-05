import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function migrate() {
  console.log('🚀 Starting Storefront database migration...')

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS storefront_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(512),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created storefront_categories table')

    await client.query(`
      CREATE TABLE IF NOT EXISTS storefront_products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        compare_at_price DECIMAL(10, 2),
        image_url VARCHAR(512),
        images TEXT[] DEFAULT ARRAY[]::TEXT[],
        stock INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        category_id UUID NOT NULL REFERENCES storefront_categories(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created storefront_products table')

    console.log('🎉 Storefront Migration completed successfully!')

  } catch (error) {
    console.error('❌ Storefront Migration failed:', error)
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
