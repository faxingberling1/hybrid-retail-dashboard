import { Pool } from 'pg'

async function createDatabase() {
  console.log('🔧 Creating dashboard database...')
  
  // First connect to default 'postgres' database
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: 'postgres', // Connect to default database
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'AlexMurphy',
  })
  
  try {
    const client = await pool.connect()
    console.log('✅ Connected to PostgreSQL')
    
    // Check if database already exists
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'dashboard_db'"
    )
    
    if (checkResult.rows.length > 0) {
      console.log('📊 Database "dashboard_db" already exists')
    } else {
      // Create the database
      await client.query('CREATE DATABASE dashboard_db')
      console.log('✅ Database "dashboard_db" created successfully')
    }
    
    client.release()
    await pool.end()
    
    return true
  } catch (error: any) {
    console.error('❌ Failed to create database:', error.message)
    await pool.end()
    return false
  }
}

// Run database creation
createDatabase().then(success => {
  if (success) {
    console.log('\n🎉 Database setup complete!')
    console.log('You can now run: npm run migrate')
    process.exit(0)
  } else {
    process.exit(1)
  }
})