import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Client } from 'pg'

async function fixCms() {
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
    await client.query("DELETE FROM system_settings WHERE key = 'landing_page_content'")
    console.log('✅ Cleared landing_page_content from system_settings')
  } catch (error) {
    console.error('❌ Failed:', error)
  } finally {
    await client.end()
  }
}

fixCms()
