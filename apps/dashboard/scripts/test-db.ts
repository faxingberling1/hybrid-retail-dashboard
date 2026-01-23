import { query } from '../lib/db'

async function testDatabase() {
  try {
    console.log('🧪 Testing database connection...')
    
    // Test query
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ Database connection successful:', result.rows[0].current_time)
    
    // Check users table
    const users = await query('SELECT COUNT(*) as count FROM users')
    console.log(`📊 Users in database: ${users.rows[0].count}`)
    
    // List all users
    const allUsers = await query('SELECT id, email, name, role FROM users')
    console.log('👥 All users:')
    allUsers.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.name}) - ${user.role}`)
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  }
}

testDatabase()