import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function migrate() {
  console.log('🚀 Starting database migration...')

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

    // Enable pgcrypto for gen_random_uuid()
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    console.log('✅ Enabled pgcrypto extension')

    // Drop and recreate users table to ensure correct schema
    await client.query('DROP TABLE IF EXISTS users CASCADE')
    console.log('🗑️  Dropped existing users table (if any)')

    // Create users table with correct schema
    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL
      )
    `)
    console.log('✅ Created users table')

    // Create indexes
    await client.query(`
      CREATE INDEX idx_users_email ON users(email)
    `)
    console.log('✅ Created email index')

    await client.query(`
      CREATE INDEX idx_users_role ON users(role)
    `)
    console.log('✅ Created role index')

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
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