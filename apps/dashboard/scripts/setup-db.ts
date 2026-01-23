import pool from '../lib/db'

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...')

    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Users table created/verified')

    // Insert demo users (with hashed passwords)
    const demoUsers = [
      {
        email: 'superadmin@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', // demo123
        name: 'Super Admin',
        role: 'SUPER_ADMIN'
      },
      {
        email: 'admin@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', // demo123
        name: 'Store Admin',
        role: 'ADMIN'
      },
      {
        email: 'user@hybridpos.pk',
        password_hash: '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', // demo123
        name: 'Staff User',
        role: 'USER'
      }
    ]

    for (const user of demoUsers) {
      await pool.query(`
        INSERT INTO users (email, password_hash, name, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          updated_at = CURRENT_TIMESTAMP
      `, [user.email, user.password_hash, user.name, user.role])
    }

    console.log('✅ Demo users inserted/updated')
    console.log('🎉 Database setup completed successfully!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
  } finally {
    await pool.end()
  }
}

setupDatabase()