import dotenv from 'dotenv'
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: envPath })
// Also try generic .env if path doesn't exist or as fallback
dotenv.config()

import bcrypt from 'bcryptjs'
import { Client } from 'pg'

async function seed() {
  console.log('🌱 Starting database seeding...')

  const isLocal = process.env.DATABASE_URL?.includes('localhost') ||
    process.env.DATABASE_URL?.includes('127.0.0.1') ||
    process.env.POSTGRES_HOST?.includes('localhost') ||
    process.env.POSTGRES_HOST?.includes('127.0.0.1');

  const config = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL + (isLocal ? '' : (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require') }
    : {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    };

  const client = new Client(config)

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL')

    // Hash passwords
    const saltRounds = 10
    const demoPassword = 'demo123'
    const passwordHash = await bcrypt.hash(demoPassword, saltRounds)
    console.log('🔐 Hashed demo123 password')

    // Demo users data - Updated to match your schema
    const demoUsers = [
      {
        email: 'superadmin@hybridpos.pk',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'SUPER_ADMIN',
        password_hash: passwordHash,
        is_active: true,
        is_verified: true
      },
      {
        email: 'admin@hybridpos.pk',
        first_name: 'Store',
        last_name: 'Admin',
        role: 'ADMIN',
        password_hash: passwordHash,
        is_active: true,
        is_verified: true
      },
      {
        email: 'user@hybridpos.pk',
        first_name: 'Staff',
        last_name: 'User',
        role: 'USER',
        password_hash: passwordHash,
        is_active: true,
        is_verified: true
      }
    ]

    console.log('📝 Inserting demo users...')

    for (const user of demoUsers) {
      try {
        // Check if user exists
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [user.email]
        )

        if (existingUser.rows.length > 0) {
          // Update existing user
          await client.query(`
            UPDATE users SET
              first_name = $2,
              last_name = $3,
              role = $4,
              password_hash = $5,
              is_active = $6,
              is_verified = $7,
              updated_at = CURRENT_TIMESTAMP
            WHERE email = $1
          `, [
            user.email,
            user.first_name,
            user.last_name,
            user.role,
            user.password_hash,
            user.is_active,
            user.is_verified
          ])
          console.log(`🔄 Updated existing user: ${user.email} (${user.role})`)
        } else {
          // Insert new user
          await client.query(`
            INSERT INTO users (
              email, first_name, last_name, role, password_hash,
              is_active, is_verified
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            user.email,
            user.first_name,
            user.last_name,
            user.role,
            user.password_hash,
            user.is_active,
            user.is_verified
          ])
          console.log(`✅ Created new user: ${user.email} (${user.role})`)
        }

      } catch (error: any) {
        console.error(`❌ Failed to process user ${user.email}:`, error.message)
        console.error('SQL error details:', error)
      }
    }

    // Verify inserted users
    const result = await client.query(`
      SELECT 
        id, 
        email, 
        CONCAT(first_name, ' ', last_name) as full_name, 
        role, 
        is_active,
        created_at 
      FROM users 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `)

    console.log('\n📊 Current users in database:')
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.full_name} (${user.role}) ${user.is_active ? '✅' : '❌'}`)
    })

    console.log(`\n✅ Total users: ${result.rows.length}`)
    console.log('🎉 Seeding completed successfully!')

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message)
    console.error('Full error:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Run seed if called directly
if (require.main === module) {
  seed().catch(console.error)
}

export { seed }