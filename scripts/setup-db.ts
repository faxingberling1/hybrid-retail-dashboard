// scripts/setup-db.ts - UPDATED FOR YOUR SCHEMA
import pool from '../lib/db'

async function setupDatabase() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Setting up database...')
    await client.query('BEGIN')

    // Create users table if not exists (matching your schema)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        phone VARCHAR(50),
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        last_login_at TIMESTAMP WITH TIME ZONE,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      )
    `)
    console.log('✅ Users table created/verified')

    // Create organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      )
    `)
    console.log('✅ Organizations table created/verified')

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        read BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE
      )
    `)
    console.log('✅ Notifications table created/verified')

    // Insert/update demo users (with proper first_name/last_name)
    const demoUsers = [
      {
        email: 'superadmin@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'super_admin'
      },
      {
        email: 'admin@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW',
        first_name: 'Store',
        last_name: 'Admin',
        role: 'admin'
      },
      {
        email: 'user@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW',
        first_name: 'Staff',
        last_name: 'User',
        role: 'user'
      }
    ]

    for (const user of demoUsers) {
      await client.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          first_name, 
          last_name, 
          role,
          is_active,
          is_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          role = EXCLUDED.role,
          is_active = EXCLUDED.is_active,
          is_verified = EXCLUDED.is_verified,
          updated_at = CURRENT_TIMESTAMP
      `, [
        user.email, 
        user.password_hash, 
        user.first_name, 
        user.last_name, 
        user.role,
        true,  // is_active
        true   // is_verified (for demo users)
      ])
    }

    console.log('✅ Demo users inserted/updated')
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
    `)
    console.log('✅ Database indexes created')
    
    // Enable UUID extension if not exists
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    console.log('✅ UUID extension enabled')
    
    await client.query('COMMIT')
    console.log('🎉 Database setup completed successfully!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    // Don't close the pool - let application manage it
  }
}

// Handle script execution
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Migration completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

export { setupDatabase }