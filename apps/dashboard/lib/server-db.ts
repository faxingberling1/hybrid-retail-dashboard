// lib/server-db.ts
// Server-side only database module

import { Pool } from 'pg'

// Check if we're on the server
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Log connection events
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err)
})

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  queryOne: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params)
    return result.rows[0]
  },
  queryAll: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params)
    return result.rows
  },
  getClient: () => pool.connect(),
  pool,
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await db.query('SELECT NOW()')
    console.log('✅ Database connection test successful:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}