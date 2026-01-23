import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from 'pg'

async function runMigrationsDirect() {
  console.log('🚀 Direct Database Migration')
  console.log('============================')
  
  // Direct configuration - no env variables from lib/db.ts
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'dashboard_db',
    user: 'postgres',
    password: 'AlexMurphy', // Your actual password
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }
  
  console.log('📋 Using direct configuration:')
  console.log('- Host:', config.host)
  console.log('- Port:', config.port)
  console.log('- Database:', config.database)
  console.log('- User:', config.user)
  console.log('- Password: *** (AlexMurphy)')
  
  const pool = new Pool(config)
  
  try {
    console.log('\n🔗 Connecting to database...')
    const client = await pool.connect()
    console.log('✅ Connected to dashboard_db!')
    
    // Read the migration file
    const migrationPath = join(process.cwd(), 'lib', 'db', 'migrations', '001_initial_schema.sql')
    console.log('📄 Reading:', migrationPath)
    
    if (!require('fs').existsSync(migrationPath)) {
      throw new Error(`Migration file not found at: ${migrationPath}`)
    }
    
    const sql = readFileSync(migrationPath, 'utf-8')
    console.log('📝 SQL loaded (size:', sql.length, 'chars)')
    
    // Execute the SQL
    console.log('\n⚡ Executing migration...')
    
    // For simplicity, execute the whole SQL at once
    // PostgreSQL can handle multiple statements in one query
    await client.query(sql)
    
    console.log('✅ Migration executed successfully!')
    
    // Verify tables
    console.log('\n📊 Verifying created tables...')
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log(`📁 Found ${tables.rows.length} tables:`)
    tables.rows.forEach((row: any, i: number) => {
      console.log(`   ${i + 1}. ${row.table_name}`)
    })
    
    // Check super admin
    console.log('\n👑 Checking super admin user...')
    const users = await client.query("SELECT email, role FROM users WHERE role = 'super_admin'")
    console.log(`   Super admins: ${users.rows.length}`)
    users.rows.forEach((user: any) => {
      console.log(`   - ${user.email} (${user.role})`)
    })
    
    client.release()
    await pool.end()
    
    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!')
    console.log('✨ Your database is ready for the dashboard application.')
    console.log('\n📋 Next steps:')
    console.log('1. Start the application: npm run dev')
    console.log('2. Login with: superadmin@platform.com / Admin@123')
    
  } catch (error: any) {
    console.error('\n❌ Migration failed!')
    console.error('Error:', error.message)
    
    if (error.code === '28P01') {
      console.error('\n💡 Password authentication failed!')
      console.error('Current password: "AlexMurphy"')
      console.error('Try:')
      console.error('1. Open pgAdmin to check actual password')
      console.error('2. Update the script with correct password')
    }
    
    if (error.code === '3D000') {
      console.error('\n💡 Database "dashboard_db" does not exist!')
      console.error('But we just created it... strange.')
      console.error('Try: npx tsx scripts/create-db.ts')
    }
    
    process.exit(1)
  }
}

// Run the migration
runMigrationsDirect()