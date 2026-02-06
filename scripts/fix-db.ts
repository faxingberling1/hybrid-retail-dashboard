import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function fixDatabase() {
  console.log('🔧 Fixing database schema...')

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  })

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL')

    // Check if users table exists and has correct structure
    const tableCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `)

    console.log('📊 Current users table structure:')
    tableCheck.rows.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.column_name} (${col.data_type})`)
    })

    // Add missing columns if needed
    const existingColumns = tableCheck.rows.map(row => row.column_name)

    if (!existingColumns.includes('name')) {
      console.log('➕ Adding missing column: name')
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN name VARCHAR(255)
      `)
    }

    if (!existingColumns.includes('deleted_at')) {
      console.log('➕ Adding missing column: deleted_at')
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL
      `)
    }

    // Drop and recreate table if it's completely wrong
    if (tableCheck.rows.length === 0) {
      console.log('🔄 Users table not found or empty, recreating...')
      await client.query('DROP TABLE IF EXISTS users CASCADE')
      
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) NOT NULL DEFAULT 'USER',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP DEFAULT NULL
        )
      `)
      console.log('✅ Recreated users table')
    }

    console.log('🎉 Database schema fixed!')

  } catch (error) {
    console.error('❌ Failed to fix database:', error)
  } finally {
    await client.end()
  }
}

fixDatabase()