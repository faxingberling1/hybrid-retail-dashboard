import { Pool } from 'pg'

// Database connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE || 'dashboard_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'AlexMurphy',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Connection events
pool.on('connect', () => {
  console.log('✅ PostgreSQL: New client connected')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL: Unexpected error on idle client', err)
})

// Query function
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`📊 PostgreSQL: Executed query in ${duration}ms`, {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      rows: res.rowCount,
      duration: `${duration}ms`
    })
    return res
  } catch (error) {
    console.error('❌ PostgreSQL: Query error', {
      query: text,
      params: params,
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
}

// Helper for single row
export async function queryOne(text: string, params?: any[]) {
  const result = await query(text, params)
  return result.rows[0] || null
}

export default pool