import pool from '../lib/db'

async function testDatabase() {
  console.log('🧪 Testing database connection...')
  
  const client = await pool.connect()
  
  try {
    // Test 1: Basic connection
    const result = await client.query('SELECT NOW() as time, version() as version')
    console.log('✅ Database connected successfully')
    console.log('📊 Server time:', result.rows[0].time)
    console.log('📊 PostgreSQL version:', result.rows[0].version.split(' ')[1])
    
    // Test 2: Check users table
    const users = await client.query('SELECT COUNT(*) as count FROM users')
    console.log('👥 Total users:', users.rows[0].count)
    
    // Test 3: List demo users
    const demoUsers = await client.query(`
      SELECT email, first_name, last_name, role, is_active, is_verified 
      FROM users 
      WHERE email LIKE '%@hybridpos.pk'
      ORDER BY created_at
    `)
    
    console.log('📋 Demo users found:')
    demoUsers.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`)
    })
    
    console.log('\n🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    client.release()
  }
}

testDatabase()