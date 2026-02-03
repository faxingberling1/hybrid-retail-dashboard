// scripts/test-supabase-correct.ts
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase Connection (Correct Format)')
  console.log('='.repeat(60))
  
  // Get your Supabase project reference from DATABASE_URL
  const dbUrl = process.env.DATABASE_URL || ''
  console.log('📋 DATABASE_URL:', dbUrl.substring(0, 80) + '...')
  
  // Extract project reference
  const projectMatch = dbUrl.match(/postgres\.([^:]+):/)
  if (projectMatch) {
    console.log('✅ Found Supabase project reference:', projectMatch[1])
  } else {
    console.log('⚠️  No project reference found in DATABASE_URL')
    console.log('   Expected format: postgresql://postgres.[PROJECT-REF]:password@host/postgres')
  }
  
  // Test different SSL configurations
  const testConfigs = [
    {
      name: 'SSL: verify-full (most secure)',
      connectionString: dbUrl.includes('?') 
        ? dbUrl.replace(/sslmode=[^&]+/, 'sslmode=verify-full')
        : dbUrl + '?sslmode=verify-full'
    },
    {
      name: 'SSL: require (current default)',
      connectionString: dbUrl.includes('?') 
        ? dbUrl.replace(/sslmode=[^&]+/, 'sslmode=require')
        : dbUrl + '?sslmode=require'
    },
    {
      name: 'No SSL (not recommended)',
      connectionString: dbUrl.includes('?')
        ? dbUrl.split('?')[0] + '?sslmode=disable'
        : dbUrl + '?sslmode=disable'
    }
  ]
  
  for (const config of testConfigs) {
    console.log(`\n🔍 Testing: ${config.name}`)
    console.log('   Connection:', config.connectionString.substring(0, 70) + '...')
    
    try {
      const pool = new Pool({
        connectionString: config.connectionString,
        ssl: config.name.includes('No SSL') ? false : { rejectUnauthorized: false }
      })
      
      const client = await pool.connect()
      const result = await client.query('SELECT NOW() as time, version() as version, current_database() as db')
      
      console.log('✅ SUCCESS!')
      console.log('   Database:', result.rows[0].db)
      console.log('   PostgreSQL:', result.rows[0].version.split(' ')[1])
      console.log('   Server time:', result.rows[0].time)
      
      // Try to list tables
      try {
        const tables = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `)
        console.log(`   Tables found: ${tables.rows.length}`)
        if (tables.rows.length > 0) {
          tables.rows.slice(0, 5).forEach((table: any) => {
            console.log(`     - ${table.table_name}`)
          })
          if (tables.rows.length > 5) {
            console.log(`     ... and ${tables.rows.length - 5} more`)
          }
        }
      } catch (tableError) {
        console.log('   Note: Could not list tables (permissions ok)')
      }
      
      client.release()
      await pool.end()
      return true // Success!
      
    } catch (error: any) {
      console.log(`❌ Failed: ${error.message}`)
      if (error.code) console.log('   Error code:', error.code)
    }
  }
  
  console.log('\n🔧 All SSL configurations failed.')
  console.log('\n📝 Supabase Connection Checklist:')
  console.log('1. ✅ Project reference in username: postgres.[PROJECT-REF]')
  console.log('2. ✅ Correct password')
  console.log('3. ✅ Host: aws-[REGION].pooler.supabase.com')
  console.log('4. ✅ Database: postgres')
  console.log('5. ✅ Port: 5432')
  console.log('6. 🔄 Try direct connection (non-pooler)')
  
  // Test direct connection
  console.log('\n🔍 Testing direct connection (non-pooler)...')
  const directUrl = dbUrl.replace('.pooler.', '.')
  console.log('   Direct URL:', directUrl.substring(0, 70) + '...')
  
  try {
    const pool = new Pool({
      connectionString: directUrl + (directUrl.includes('?') ? '' : '?sslmode=require'),
      ssl: { rejectUnauthorized: false }
    })
    
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as time')
    console.log('✅ Direct connection SUCCESS! Time:', result.rows[0].time)
    
    client.release()
    await pool.end()
    return true
    
  } catch (error: any) {
    console.log(`❌ Direct connection failed: ${error.message}`)
  }
  
  return false
}

testSupabaseConnection().catch(console.error)