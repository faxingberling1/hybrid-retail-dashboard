import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { Client } from 'pg'

async function fixDatabase() {
  console.log('🔧 Fixing database schema...')

  const isLocal = process.env.DATABASE_URL?.includes('localhost') ||
    process.env.DATABASE_URL?.includes('127.0.0.1') ||
    process.env.POSTGRES_HOST?.includes('localhost') ||
    process.env.POSTGRES_HOST?.includes('127.0.0.1');

  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL + (isLocal ? '' : (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require') }
    : {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    };

  const client = new Client(config)

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL')

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `)

    if (tableCheck.rows.length === 0) {
      console.log('🔄 Users table not found, creating from scratch...')
      await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id VARCHAR(255),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          name VARCHAR(1000),
          role VARCHAR(50) NOT NULL DEFAULT 'USER',
          phone VARCHAR(255),
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          is_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMP,
          two_factor_enabled BOOLEAN DEFAULT FALSE,
          email_verified_at TIMESTAMP,
          phone_verified_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP DEFAULT NULL
        )
      `)
      console.log('✅ Created users table')
    } else {
      console.log('📊 Current users table structure found. Checking for missing columns...')
      const existingColumns = tableCheck.rows.map(row => row.column_name)

      // List of expected columns with their types
      const expectedColumns = [
        { name: 'organization_id', type: 'VARCHAR(255)' },
        { name: 'first_name', type: 'VARCHAR(255)' },
        { name: 'last_name', type: 'VARCHAR(255)' },
        { name: 'name', type: 'VARCHAR(1000)' },
        { name: 'role', type: 'VARCHAR(50) DEFAULT \'USER\'' },
        { name: 'phone', type: 'VARCHAR(255)' },
        { name: 'avatar_url', type: 'TEXT' },
        { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE' },
        { name: 'is_verified', type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'last_login_at', type: 'TIMESTAMP' },
        { name: 'two_factor_enabled', type: 'BOOLEAN DEFAULT FALSE' },
        { name: 'email_verified_at', type: 'TIMESTAMP' },
        { name: 'phone_verified_at', type: 'TIMESTAMP' },
        { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'TIMESTAMP DEFAULT NULL' }
      ]

      for (const column of expectedColumns) {
        if (!existingColumns.includes(column.name)) {
          console.log(`➕ Adding missing column: ${column.name}`)
          try {
            await client.query(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`)
          } catch (err: any) {
            console.error(`❌ Error adding ${column.name}:`, err.message)
          }
        }
      }
    }

    // Step 2: Normalize Tickets and Replies user_id columns from UUID to TEXT
    console.log('🔄 Normalizing Tickets and Replies user_id columns...')
    try {
      // First, check the type of user_id in tickets
      const ticketColCheck = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'user_id'
      `)

      if (ticketColCheck.rows.length > 0 && ticketColCheck.rows[0].data_type === 'uuid') {
        console.log('🏗️ Converting tickets.user_id from UUID to TEXT...')
        // We drop existing constraints if any, then alter, then we don't strictly need the FK for the app to work, 
        // but we'll try to keep it simple. Prisma handles relations.
        await client.query(`
          ALTER TABLE tickets ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
        `)
        console.log('✅ Converted tickets.user_id')
      }

      const replyColCheck = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ticket_replies' AND column_name = 'user_id'
      `)

      if (replyColCheck.rows.length > 0 && replyColCheck.rows[0].data_type === 'uuid') {
        console.log('🏗️ Converting ticket_replies.user_id from UUID to TEXT...')
        await client.query(`
          ALTER TABLE ticket_replies ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
        `)
        console.log('✅ Converted ticket_replies.user_id')
      }

      // Also normalize ticket_id in replies just in case it was created as UUID (schema shows UUID)
      const ticketIdCheck = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ticket_replies' AND column_name = 'ticket_id'
      `)
      if (ticketIdCheck.rows.length > 0 && ticketIdCheck.rows[0].data_type === 'uuid') {
        console.log('🏗️ Converting ticket_replies.ticket_id from UUID to TEXT...')
        await client.query(`
          ALTER TABLE ticket_replies ALTER COLUMN ticket_id TYPE TEXT USING ticket_id::TEXT;
        `)
        console.log('✅ Converted ticket_replies.ticket_id')
      }

      // Finally check the tickets table ID itself
      const ticketIdTableCheck = await client.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'id'
      `)
      if (ticketIdTableCheck.rows.length > 0 && ticketIdTableCheck.rows[0].data_type === 'uuid') {
        console.log('🏗️ Converting tickets.id from UUID to TEXT...')
        await client.query(`
          ALTER TABLE tickets ALTER COLUMN id TYPE TEXT USING id::TEXT;
        `)
        console.log('✅ Converted tickets.id')
      }

    } catch (err: any) {
      console.error('❌ Error during normalization:', err.message)
    }

    console.log('🎉 Database schema fix complete!')

  } catch (error: any) {
    console.error('❌ Failed to fix database:', error.message)
    console.error(error)
  } finally {
    await client.end()
  }
}

fixDatabase()