// scripts/supabase-quick-setup.ts
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function supabaseQuickSetup() {
  console.log('⚡ Supabase Quick Setup')
  console.log('='.repeat(50))
  
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in .env.local')
    console.log('💡 Create .env.local with your Supabase connection string')
    return
  }
  
  // Ensure SSL is configured
  let connectionString = dbUrl
  if (!connectionString.includes('sslmode=')) {
    connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=require'
  }
  
  console.log('🔗 Connecting to Supabase...')
  const maskedUrl = connectionString.replace(/:[^:@]*@/, ':********@')
  console.log('   URL:', maskedUrl)
  
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    // Test connection
    console.log('\n🔍 Testing connection...')
    const client = await pool.connect()
    const test = await client.query('SELECT NOW() as time, version() as version')
    console.log('✅ Connected to PostgreSQL:', test.rows[0].version.split(' ')[1])
    console.log('   Server time:', test.rows[0].time)
    
    // Create users table
    console.log('\n📋 Creating users table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP,
        
        CONSTRAINT valid_role CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST'))
      )
    `)
    
    console.log('✅ Users table created/verified')
    
    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)')
    console.log('✅ Indexes created')
    
    // Create demo users
    console.log('\n👥 Creating demo users...')
    const demoUsers = [
      { email: 'superadmin@hybridpos.pk', firstName: 'Super', lastName: 'Admin', role: 'SUPER_ADMIN', password: 'demo123' },
      { email: 'admin@hybridpos.pk', firstName: 'Store', lastName: 'Admin', role: 'ADMIN', password: 'demo123' },
      { email: 'user@hybridpos.pk', firstName: 'Staff', lastName: 'User', role: 'USER', password: 'demo123' }
    ]
    
    for (const user of demoUsers) {
      const passwordHash = bcrypt.hashSync(user.password, 12)
      
      const result = await client.query(`
        INSERT INTO users (email, first_name, last_name, role, password_hash, is_active, is_verified)
        VALUES ($1, $2, $3, $4, $5, true, true)
        ON CONFLICT (email) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          role = EXCLUDED.role,
          password_hash = EXCLUDED.password_hash,
          updated_at = NOW()
        RETURNING id, email, role
      `, [user.email, user.firstName, user.lastName, user.role, passwordHash])
      
      console.log(`✅ ${user.email} (${user.role}) - ID: ${result.rows[0]?.id?.substring(0, 8)}...`)
    }
    
    // Verify setup
    console.log('\n🔍 Verifying setup...')
    const users = await client.query(`
      SELECT email, role, is_active, is_verified, created_at::date as created 
      FROM users 
      ORDER BY role
    `)
    
    console.log('\n📊 Users in database:')
    console.log('─'.repeat(70))
    users.rows.forEach((row: any) => {
      const status = row.is_active ? '🟢' : '🔴'
      const verified = row.is_verified ? '✓' : '✗'
      console.log(`${status} ${row.email.padEnd(30)} ${row.role.padEnd(15)} ${verified} ${row.created}`)
    })
    
    client.release()
    
    console.log('\n🎉 Setup complete!')
    console.log('\n🔑 Login credentials:')
    demoUsers.forEach(user => {
      console.log(`   ${user.role.padEnd(15)}: ${user.email} / ${user.password}`)
    })
    
    const port = process.env.NEXTAUTH_URL?.split(':').pop() || '3001'
    console.log(`\n🌐 Login at: http://localhost:${port}/login`)
    console.log('\n🚀 Start the app: npm run dev')
    
  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message)
    
    if (error.code === '28P01') {
      console.log('\n🔧 Authentication failed. Check:')
      console.log('   1. Correct password in DATABASE_URL')
      console.log('   2. Project reference in username (postgres.[PROJECT-REF])')
      console.log('   3. Supabase project is active')
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Connection refused. Check:')
      console.log('   1. Correct hostname in DATABASE_URL')
      console.log('   2. Port 5432 is not blocked')
      console.log('   3. Internet connection')
    }
    
  } finally {
    await pool.end()
  }
}

supabaseQuickSetup().catch(console.error)