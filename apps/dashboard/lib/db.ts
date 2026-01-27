// lib/db.ts - UPDATED FOR SUPABASE SUPPORT
import { Pool, PoolConfig } from 'pg'

// Helper to get connection configuration
function getPoolConfig(): PoolConfig {
  // Priority 1: Use DATABASE_URL from Supabase (for production)
  if (process.env.DATABASE_URL) {
    console.log('📡 Using DATABASE_URL from environment');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Supabase SSL
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  // Priority 2: Use POSTGRES_* variables (for local/legacy)
  if (process.env.POSTGRES_HOST) {
    console.log('📡 Using POSTGRES_* environment variables');
    return {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DATABASE || 'dashboard_db',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'AlexMurphy',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      // SSL only for non-localhost connections
      ssl: process.env.POSTGRES_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
    };
  }

  // Priority 3: Use DB_* variables (for backward compatibility)
  console.log('📡 Using DB_* environment variables (legacy)');
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'dashboard_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'AlexMurphy',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

// Database connection pool
const poolConfig = getPoolConfig();
const pool = new Pool(poolConfig);

// Log connection details (without exposing passwords)
console.log('🔌 Database Configuration:', {
  host: poolConfig.host || 'connection-string',
  port: poolConfig.port,
  database: poolConfig.database,
  user: poolConfig.user,
  ssl: poolConfig.ssl ? 'enabled' : 'disabled'
});

// Connection events
pool.on('connect', () => {
  console.log('✅ PostgreSQL: New client connected')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL: Unexpected error on idle client', err)
  // Don't exit process in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 Exiting due to database error...');
    process.exit(1);
  }
})

pool.on('remove', () => {
  console.log('👋 PostgreSQL: Client removed from pool')
})

// Query function
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const client = await pool.connect()
  
  try {
    const res = await client.query(text, params)
    const duration = Date.now() - start
    
    // Only log slow queries in development
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      console.log(`📊 PostgreSQL: Query executed in ${duration}ms`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        rows: res.rowCount,
        duration: `${duration}ms`
      })
    }
    return res
  } catch (error) {
    const duration = Date.now() - start
    console.error('❌ PostgreSQL: Query error', {
      query: text.substring(0, 200),
      params: params ? JSON.stringify(params) : 'none',
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  } finally {
    client.release()
  }
}

// Helper for single row
export async function queryOne(text: string, params?: any[]) {
  const result = await query(text, params)
  return result.rows[0] || null
}

// Helper for multiple rows
export async function queryAll(text: string, params?: any[]) {
  const result = await query(text, params)
  return result.rows
}

// Transaction helper
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// ADDED: connectDB function that your NotificationModel expects
export async function connectDB() {
  try {
    const client = await pool.connect()
    console.log('🔗 Database client acquired from pool')
    return client
  } catch (error) {
    console.error('❌ Database connection error:', error)
    throw error
  }
}

// ADDED: testConnection function
export async function testConnection(): Promise<boolean> {
  const client = await connectDB()
  try {
    await client.query('SELECT 1')
    console.log('✅ Database connection test passed')
    return true
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return false
  } finally {
    client.release()
  }
}

// ADDED: getClient function (alternative to connectDB)
export async function getClient() {
  return await connectDB()
}

// Health check
export async function healthCheck() {
  try {
    const result = await query('SELECT NOW() as time, version() as version')
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        time: result.rows[0]?.time,
        version: result.rows[0]?.version?.split(' ')[1] // Extract PostgreSQL version
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Graceful shutdown
export async function closePool() {
  console.log('🛑 Closing database pool...')
  await pool.end()
  console.log('✅ Database pool closed')
}

// Export the pool for direct access
export default pool