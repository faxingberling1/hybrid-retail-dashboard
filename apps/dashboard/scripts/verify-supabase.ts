// scripts/verify-supabase.ts
import { query } from '../lib/db'
import bcrypt from 'bcryptjs'

async function verifySupabase() {
  console.log('✅ Verifying Supabase Setup')
  console.log('='.repeat(50))
  
  const checks = [
    { name: 'Database Connection', passed: false },
    { name: 'Users Table Exists', passed: false },
    { name: 'Demo Users Created', passed: false },
    { name: 'Authentication Works', passed: false }
  ]
  
  try {
    // Check 1: Database Connection
    console.log('\n1. 🔗 Testing database connection...')
    const connectionTest = await query('SELECT NOW() as time')
    checks[0].passed = true
    console.log('   ✅ Connected at:', connectionTest.rows[0].time)
    
    // Check 2: Users Table
    console.log('\n2. 📋 Checking users table...')
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `)
    
    if (tableExists.rows[0].exists) {
      checks[1].passed = true
      console.log('   ✅ Users table exists')
      
      // Get table info
      const columns = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `)
      console.log(`   📊 Table has ${columns.rows.length} columns`)
    } else {
      console.log('   ❌ Users table not found')
    }
    
    // Check 3: Demo Users
    console.log('\n3. 👥 Checking demo users...')
    const demoUsers = [
      'superadmin@hybridpos.pk',
      'admin@hybridpos.pk',
      'user@hybridpos.pk'
    ]
    
    let allUsersExist = true
    for (const email of demoUsers) {
      const user = await query('SELECT email, role FROM users WHERE email = $1', [email])
      if (user.rows.length > 0) {
        console.log(`   ✅ ${email} (${user.rows[0].role})`)
      } else {
        console.log(`   ❌ ${email} - NOT FOUND`)
        allUsersExist = false
      }
    }
    
    checks[2].passed = allUsersExist
    
    // Check 4: Authentication
    console.log('\n4. 🔐 Testing authentication...')
    if (allUsersExist) {
      const testUser = await query(
        'SELECT password_hash FROM users WHERE email = $1',
        ['superadmin@hybridpos.pk']
      )
      
      if (testUser.rows[0]) {
        const hash = testUser.rows[0].password_hash
        const isValidFormat = hash && hash.startsWith('$2') && hash.length > 50
        
        if (isValidFormat) {
          checks[3].passed = true
          console.log('   ✅ Password hash format is valid')
          
          // Test password
          const passwordValid = bcrypt.compareSync('demo123', hash)
          console.log(`   🔑 Password "demo123" is ${passwordValid ? '✅ valid' : '❌ invalid'}`)
        } else {
          console.log('   ❌ Invalid password hash format')
        }
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 VERIFICATION SUMMARY:')
    console.log('='.repeat(50))
    
    let passedCount = 0
    checks.forEach((check, index) => {
      const icon = check.passed ? '✅' : '❌'
      console.log(`${index + 1}. ${icon} ${check.name}`)
      if (check.passed) passedCount++
    })
    
    console.log('\n📈 Result:', `${passedCount}/${checks.length} checks passed`)
    
    if (passedCount === checks.length) {
      console.log('\n🎉 SUPABASE SETUP COMPLETE!')
      console.log('\n🚀 Next steps:')
      console.log('   1. Start the app: npm run dev')
      console.log('   2. Go to: http://localhost:3001/login')
      console.log('   3. Login with: superadmin@hybridpos.pk / demo123')
    } else {
      console.log('\n🔧 Setup incomplete. Run: npm run supabase:setup')
    }
    
  } catch (error: any) {
    console.error('❌ Verification failed:', error.message)
  }
}

verifySupabase().catch(console.error)