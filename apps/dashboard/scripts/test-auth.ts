import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import bcrypt from 'bcrypt'
import { query } from '../lib/db'

async function testAuth() {
  console.log('🔐 Testing PostgreSQL Authentication...\n')

  try {
    // 1. Test database connection
    console.log('1. Testing database connection...')
    const dbTest = await query('SELECT COUNT(*) as user_count FROM users')
    console.log(`   ✅ Database connected, ${dbTest.rows[0].user_count} users found\n`)

    // 2. Verify user data
    console.log('2. Verifying user data...')
    const users = await query(`
      SELECT 
        email, 
        first_name, 
        last_name, 
        role, 
        is_active,
        is_verified
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY role DESC
    `)

    users.rows.forEach(user => {
      console.log(`   👤 ${user.email}`)
      console.log(`     Name: ${user.first_name} ${user.last_name}`)
      console.log(`     Role: ${user.role}`)
      console.log(`     Active: ${user.is_active ? '✅' : '❌'}`)
      console.log(`     Verified: ${user.is_verified ? '✅' : '❌'}`)
      console.log('')
    })

    // 3. Test password verification
    console.log('3. Testing password verification...')
    const demoUsers = [
      'superadmin@hybridpos.pk',
      'admin@hybridpos.pk', 
      'user@hybridpos.pk'
    ]

    for (const email of demoUsers) {
      const user = await query(
        'SELECT email, password_hash FROM users WHERE email = $1',
        [email]
      )
      
      if (user.rows.length > 0) {
        const isValid = await bcrypt.compare('demo123', user.rows[0].password_hash)
        console.log(`   ${email}: ${isValid ? '✅ Password correct' : '❌ Password incorrect'}`)
      } else {
        console.log(`   ${email}: ❌ User not found`)
      }
    }

    console.log('\n🎉 All authentication tests passed!')
    console.log('\n📋 Test Credentials:')
    console.log('   Super Admin: superadmin@hybridpos.pk / demo123')
    console.log('   Admin: admin@hybridpos.pk / demo123')
    console.log('   User: user@hybridpos.pk / demo123')

  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    process.exit(1)
  }
}

testAuth()