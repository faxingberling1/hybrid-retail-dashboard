import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function cleanup() {
  console.log('🧹 Cleaning up existing users...')

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

    // Delete the old demo user
    await client.query(`
      DELETE FROM users WHERE email = 'superadmin@platform.com'
    `)
    console.log('🗑️  Deleted old superadmin@platform.com user')

    // Also remove the name column we added (optional)
    try {
      await client.query(`
        ALTER TABLE users DROP COLUMN IF EXISTS name
      `)
      console.log('🗑️  Removed extra name column')
    } catch (error) {
      console.log('⚠️  Could not remove name column (might not exist)')
    }

    console.log('🎉 Cleanup completed!')

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await client.end()
  }
}

cleanup()