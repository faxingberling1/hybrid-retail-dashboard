// scripts/supabase-info.ts
import { query, healthCheck } from '../lib/db'

async function getSupabaseInfo() {
  console.log('📊 Supabase Project Information')
  console.log('='.repeat(60))
  
  try {
    // Get health check
    const health = await healthCheck()
    console.log('🔧 Health Status:', health.status.toUpperCase())
    
    if (health.status === 'healthy') {
      console.log('\n📡 Database Info:')
      console.log('   Name:', health.database?.name)
      console.log('   Version:', health.database?.version)
      console.log('   User:', health.database?.user)
      console.log('   Server:', health.database?.server)
      console.log('   Active Connections:', health.database?.activeConnections)
      console.log('   Time:', health.database?.time)
      
      console.log('\n🔗 Connection Pool:')
      console.log('   Total:', health.pool?.totalCount)
      console.log('   Idle:', health.pool?.idleCount)
      console.log('   Waiting:', health.pool?.waitingCount)
    }
    
    // Get all tables
    console.log('\n📋 Database Tables:')
    const tables = await query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    if (tables.rows.length === 0) {
      console.log('   No tables found')
    } else {
      tables.rows.forEach((table: any) => {
        console.log(`   ${table.table_name} (${table.column_count} columns)`)
      })
    }
    
    // Get user info
    console.log('\n👥 User Accounts:')
    try {
      const users = await query(`
        SELECT 
          email,
          role,
          is_active,
          is_verified,
          created_at::date as created
        FROM users
        ORDER BY created_at DESC
      `)
      
      if (users.rows.length === 0) {
        console.log('   No users found. Run: npm run supabase:setup')
      } else {
        users.rows.forEach((user: any) => {
          const status = user.is_active ? '🟢' : '🔴'
          const verified = user.is_verified ? '✓' : '✗'
          console.log(`   ${status} ${user.email.padEnd(30)} ${user.role.padEnd(15)} ${verified} ${user.created}`)
        })
      }
    } catch (error) {
      console.log('   Users table not found or error:', error.message)
    }
    
    // Environment info
    console.log('\n🌐 Environment:')
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'development')
    console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set')
    
    if (process.env.NEXTAUTH_URL) {
      const port = process.env.NEXTAUTH_URL.split(':').pop() || '3000'
      console.log('   Login URL:', `http://localhost:${port}/login`)
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

getSupabaseInfo().catch(console.error)