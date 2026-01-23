// Load environment variables FIRST
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { Pool } from 'pg'

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...')
  console.log('===================================')
  
  // Show what we're using
  console.log('Environment variables loaded:')
  console.log('POSTGRES_PASSWORD exists:', !!process.env.POSTGRES_PASSWORD)
  console.log('POSTGRES_PASSWORD length:', process.env.POSTGRES_PASSWORD?.length)
  console.log('POSTGRES_PASSWORD first 2 chars:', process.env.POSTGRES_PASSWORD?.substring(0, 2) + '...')
  
  const config = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
  }
  
  console.log('\n📋 Connection Configuration:')
  console.log('- Host:', config.host)
  console.log('- Port:', config.port)
  console.log('- Database:', config.database)
  console.log('- User:', config.user)
  console.log('- Password provided:', !!config.password)
  
  const pool = new Pool(config)
  
  try {
    console.log('\n🔄 Attempting to connect...')
    const client = await pool.connect()
    console.log('✅ PostgreSQL connected successfully!')
    
    // Test a simple query
    const result = await client.query('SELECT version()')
    console.log('📋 PostgreSQL Version:', result.rows[0].version)
    
    // Show current database
    const dbResult = await client.query('SELECT current_database()')
    console.log('📊 Current database:', dbResult.rows[0].current_database)
    
    // List tables (if any)
    try {
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)
      console.log('📁 Tables in database:', tablesResult.rows.length)
    } catch (e) {
      console.log('📁 No tables yet (empty database)')
    }
    
    client.release()
    await pool.end()
    
    return true
  } catch (error: any) {
    console.error('\n❌ Connection failed!')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    if (error.code === '28P01') {
      console.error('\n💡 Password authentication failed!')
      console.error('The password "AlexMurphy" might be incorrect.')
      console.error('Try:')
      console.error('1. Open pgAdmin and check the actual password')
      console.error('2. Reset password: ALTER USER postgres WITH PASSWORD \'new_password\';')
    }
    
    if (error.code === '3D000') {
      console.error('\n💡 Database "dashboard_db" does not exist!')
      console.error('Run: npx tsx scripts/create-db.ts')
    }
    
    await pool.end()
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Connection test passed! You can now run migrations.')
    process.exit(0)
  } else {
    console.log('\n⚠️  Connection test failed. Please fix the issue first.')
    process.exit(1)
  }
})