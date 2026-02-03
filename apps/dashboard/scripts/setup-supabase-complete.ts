// scripts/setup-supabase-complete.ts
import { query, queryOne } from '../lib/db'
import bcrypt from 'bcryptjs'
import { hashPassword } from '../lib/auth-utils'

async function setupSupabaseComplete() {
  console.log('🚀 COMPLETE Supabase Setup for HybridPOS')
  console.log('='.repeat(60))
  
  try {
    // 1. Test connection
    console.log('🔍 Testing database connection...')
    const test = await query('SELECT NOW() as time, version() as version, current_database() as db')
    console.log('✅ Connected to:', {
      database: test.rows[0].db,
      version: test.rows[0].version.split(' ')[1],
      time: test.rows[0].time
    })
    
    // 2. Create users table
    console.log('\n📋 Creating users table...')
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE,
        
        -- Constraints
        CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
        CONSTRAINT valid_role CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST'))
      )
    `)
    
    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)')
    await query('CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true')
    
    console.log('✅ Users table created with indexes')
    
    // 3. Create demo users
    console.log('\n👥 Creating demo users...')
    
    const demoUsers = [
      {
        email: 'superadmin@hybridpos.pk',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        password: 'demo123'
      },
      {
        email: 'admin@hybridpos.pk',
        firstName: 'Store',
        lastName: 'Admin',
        role: 'ADMIN',
        password: 'demo123'
      },
      {
        email: 'user@hybridpos.pk',
        firstName: 'Staff',
        lastName: 'User',
        role: 'USER',
        password: 'demo123'
      }
    ]
    
    for (const userData of demoUsers) {
      // Check if user exists
      const existing = await queryOne(
        'SELECT id, email, role FROM users WHERE email = $1',
        [userData.email]
      )
      
      if (existing) {
        console.log(`⚠️  ${userData.email} already exists. Updating...`)
        
        // Update password
        const passwordHash = await hashPassword(userData.password)
        
        await query(`
          UPDATE users SET 
            first_name = $2,
            last_name = $3,
            role = $4,
            password_hash = $5,
            is_active = true,
            is_verified = true,
            updated_at = NOW()
          WHERE email = $1
        `, [
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.role,
          passwordHash
        ])
        
        console.log(`✅ Updated: ${userData.email} (${userData.role})`)
      } else {
        // Create new user
        const passwordHash = await hashPassword(userData.password)
        
        const result = await query(`
          INSERT INTO users (
            email, 
            first_name, 
            last_name, 
            role, 
            password_hash,
            is_active,
            is_verified
          ) VALUES ($1, $2, $3, $4, $5, true, true)
          RETURNING id, email, role
        `, [
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.role,
          passwordHash
        ])
        
        console.log(`✅ Created: ${userData.email} (${userData.role}) - ID: ${result.rows[0].id}`)
      }
    }
    
    // 4. Verify setup
    console.log('\n🔍 Verifying setup...')
    
    const allUsers = await query(`
      SELECT 
        email,
        role,
        is_active,
        is_verified,
        LENGTH(password_hash) as hash_length,
        created_at::date as created
      FROM users
      ORDER BY role, created_at
    `)
    
    console.log('\n📊 Current users in database:')
    console.log('─'.repeat(70))
    console.log('Email'.padEnd(30), 'Role'.padEnd(15), 'Status'.padEnd(10), 'Hash'.padEnd(8), 'Created')
    console.log('─'.repeat(70))
    
    allUsers.rows.forEach((user: any) => {
      const status = user.is_active ? '🟢 Active' : '🔴 Inactive'
      const verified = user.is_verified ? '✓' : '✗'
      console.log(
        user.email.padEnd(30),
        user.role.padEnd(15),
        `${status} ${verified}`.padEnd(10),
        `${user.hash_length}`.padEnd(8),
        user.created
      )
    })
    
    // 5. Test authentication
    console.log('\n🔐 Testing authentication...')
    
    for (const userData of demoUsers) {
      const dbUser = await queryOne(
        'SELECT email, password_hash FROM users WHERE email = $1',
        [userData.email]
      )
      
      if (dbUser) {
        const isValid = bcrypt.compareSync(userData.password, dbUser.password_hash)
        console.log(`   ${userData.email}: ${isValid ? '✅ PASS' : '❌ FAIL'}`)
      } else {
        console.log(`   ${userData.email}: ❌ NOT FOUND`)
      }
    }
    
    // 6. Display connection info
    console.log('\n🔗 Connection Information:')
    console.log('─'.repeat(40))
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'http://localhost:3001')
    console.log('Login URL:', `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/login`)
    console.log('Port:', process.env.NEXTAUTH_URL?.split(':').pop() || '3001')
    
    // 7. Display test credentials
    console.log('\n🔑 Test Credentials:')
    console.log('─'.repeat(40))
    demoUsers.forEach(user => {
      console.log(`   ${user.role.padEnd(15)}: ${user.email} / ${user.password}`)
    })
    
    console.log('\n🎉 Setup complete! You can now:')
    console.log('1. Start the app: npm run dev')
    console.log('2. Go to: http://localhost:3001/login')
    console.log('3. Login with any demo user above')
    console.log('='.repeat(60))
    
  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message)
    
    if (error.code === '28P01') {
      console.log('\n🔧 Authentication failed. Check:')
      console.log('   - DATABASE_URL password in .env.local')
      console.log('   - Supabase project credentials')
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Connection refused. Check:')
      console.log('   - Supabase project is active')
      console.log('   - Correct hostname in DATABASE_URL')
      console.log('   - Port 5432 is accessible')
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🔧 Host not found. Check:')
      console.log('   - Correct Supabase hostname')
      console.log('   - Internet connection')
    }
    
    console.log('\n📋 Current DATABASE_URL (masked):')
    const dbUrl = process.env.DATABASE_URL || ''
    const masked = dbUrl.replace(/:[^:@]*@/, ':********@')
    console.log('   ', masked)
  }
}

setupSupabaseComplete().catch(console.error)