import dotenv from 'dotenv'
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: envPath })
// Also try generic .env if path doesn't exist or as fallback
dotenv.config()

import bcrypt from 'bcryptjs'
import { Client } from 'pg'
import crypto from 'crypto'

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
      }
    ]

    console.log('📝 Inserting core demo users...')

    for (const user of demoUsers) {
      try {
        const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [user.email])
        if (existingUser.rows.length > 0) {
          await client.query(`
            UPDATE users SET first_name = $2, last_name = $3, role = $4, password_hash = $5, is_active = $6, is_verified = $7, updated_at = CURRENT_TIMESTAMP
            WHERE email = $1
          `, [user.email, user.first_name, user.last_name, user.role, user.password_hash, user.is_active, user.is_verified])
          console.log(`🔄 Updated demo user: ${user.email}`)
        } else {
          await client.query(`
            INSERT INTO users (email, first_name, last_name, role, password_hash, is_active, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [user.email, user.first_name, user.last_name, user.role, user.password_hash, user.is_active, user.is_verified])
          console.log(`✅ Created demo user: ${user.email}`)
        }
      } catch (error: any) {
        console.error(`❌ Failed demo user ${user.email}:`, error.message)
      }
    }

    // List of industries to seed
    const industries = [
      'pharmacy',
      'fashion',
      'education',
      'healthcare',
      'corporate',
      'retail',
      'restaurant',
      'manufacturing'
    ]

    console.log('📝 Seeding industry-specific organizations and users...')

    for (const industry of industries) {
      const orgName = `${industry.charAt(0).toUpperCase() + industry.slice(1)} Test Org`
      const email = `${industry}@hybridpos.pk`

      try {
        // 1. Create or get Organization
        let orgId;
        const existingOrg = await client.query(
          'SELECT id FROM organizations WHERE name = $1',
          [orgName]
        )

        if (existingOrg.rows.length > 0) {
          orgId = existingOrg.rows[0].id
          await client.query(
            'UPDATE organizations SET industry = $2, business_type = $3 WHERE id = $1',
            [orgId, industry, industry]
          )
          console.log(`🏢 Updated organization: ${orgName}`)
        } else {
          const newOrg = await client.query(
            'INSERT INTO organizations (id, name, industry, business_type, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [crypto.randomUUID(), orgName, industry, industry, 'active']
          )
          orgId = newOrg.rows[0].id
          console.log(`🏢 Created organization: ${orgName}`)
        }

        // 2. Create or update User
        const existingUser = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        )

        if (existingUser.rows.length > 0) {
          await client.query(`
            UPDATE users SET
              first_name = $2,
              last_name = $3,
              role = $4,
              password_hash = $5,
              organization_id = $6,
              is_active = $7,
              is_verified = $8,
              updated_at = CURRENT_TIMESTAMP
            WHERE email = $1
          `, [
            email,
            industry.charAt(0).toUpperCase() + industry.slice(1),
            'Admin',
            'ADMIN',
            passwordHash,
            orgId,
            true,
            true
          ])
          console.log(`👤 Updated user: ${email}`)
        } else {
          await client.query(`
            INSERT INTO users (
              email, first_name, last_name, role, password_hash,
              organization_id, is_active, is_verified
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            email,
            industry.charAt(0).toUpperCase() + industry.slice(1),
            'Admin',
            'ADMIN',
            passwordHash,
            orgId,
            true,
            true
          ])
          console.log(`👤 Created user: ${email}`)
        }
      } catch (error: any) {
        console.error(`❌ Error seeding ${industry}:`, error.message)
      }
    }

    // Verify inserted users
    const result = await client.query(`
      SELECT 
        u.email, 
        o.name as organization,
        o.industry,
        u.role
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE u.email LIKE '%@hybridpos.pk'
      ORDER BY o.industry
    `)

    console.log('\n📊 Seeded Industry Users:')
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.email} -> ${row.organization} (${row.industry}) - ${row.role}`)
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