// lib/db.ts - COMPLETE UPDATED FOR SUPABASE WITH PG-NATIVE FIX
import { Pool, PoolConfig } from 'pg'

// ============================================
// FIX FOR PG-NATIVE WARNING
// This prevents the "Module not found: Can't resolve 'pg-native'" warning
process.env.PG_DISABLE_NATIVE = 'true';
// ============================================

// Helper to parse DATABASE_URL and extract components for logging
function parseConnectionString(connectionString: string) {
  try {
    // Handle Supabase connection string format
    const url = new URL(connectionString);
    return {
      host: url.hostname,
      port: url.port || '5432',
      database: url.pathname.replace('/', '') || 'postgres',
      user: url.username || 'postgres',
      hasPassword: !!url.password,
      sslMode: url.searchParams.get('sslmode') || 'require',
      isSupabase: url.hostname.includes('supabase') || url.hostname.includes('pooler')
    };
  } catch (error) {
    // Fallback regex parsing for Supabase format
    const hostMatch = connectionString.match(/@([^\/:]+)/);
    const dbMatch = connectionString.match(/\/([^?]+)/);
    const userMatch = connectionString.match(/\/\/([^:]+):/);
    const sslMatch = connectionString.match(/sslmode=([^&]+)/);
    
    return {
      host: hostMatch ? hostMatch[1] : 'unknown',
      port: '5432',
      database: dbMatch ? dbMatch[1] : 'postgres',
      user: userMatch ? userMatch[1] : 'postgres',
      hasPassword: connectionString.includes(':') && connectionString.includes('@'),
      sslMode: sslMatch ? sslMatch[1] : 'require',
      isSupabase: connectionString.includes('supabase') || connectionString.includes('pooler')
    };
  }
}

// Helper to get connection configuration with Supabase support
function getPoolConfig(): PoolConfig {
  // Priority 1: Use DATABASE_URL from Supabase (for production/development)
  if (process.env.DATABASE_URL) {
    console.log('📡 Using DATABASE_URL from environment');
    
    // Parse for logging
    const parsed = parseConnectionString(process.env.DATABASE_URL);
    console.log('🔌 Parsed connection:', {
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
      user: parsed.user,
      sslMode: parsed.sslMode,
      isSupabase: parsed.isSupabase,
      hasPassword: parsed.hasPassword ? 'yes' : 'no'
    });
    
    // Ensure SSL mode is set for Supabase
    let connectionString = process.env.DATABASE_URL;
    
    // Add sslmode parameter if not present
    if (!connectionString.includes('sslmode=')) {
      connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=require';
    }
    
    // Force SSL for Supabase connections
    let sslConfig;
    if (parsed.isSupabase) {
      // Supabase requires SSL with self-signed certificates
      sslConfig = { rejectUnauthorized: false };
      console.log('🔐 Using Supabase SSL configuration (rejectUnauthorized: false)');
    } else {
      // For non-Supabase, use parsed SSL mode
      const sslMode = parsed.sslMode.toLowerCase();
      
      if (sslMode === 'disable') {
        sslConfig = false;
      } else if (sslMode === 'require' || sslMode === 'prefer') {
        sslConfig = { rejectUnauthorized: false };
      } else if (sslMode === 'verify-ca' || sslMode === 'verify-full') {
        sslConfig = { rejectUnauthorized: true };
      } else {
        // Default for production
        sslConfig = process.env.NODE_ENV === 'production' 
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false };
      }
    }
    
    return {
      connectionString,
      ssl: sslConfig,
      max: parsed.isSupabase ? 10 : 20, // Lower for Supabase free tier
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Increased for cloud connections
      allowExitOnIdle: true,
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
      password: process.env.POSTGRES_PASSWORD || '',
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
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

// Database connection pool
const poolConfig = getPoolConfig();
const pool = new Pool(poolConfig);

// Log actual configuration
console.log('🔌 Database Pool Initialized:');
if (poolConfig.connectionString) {
  const parsed = parseConnectionString(poolConfig.connectionString);
  const maskedUrl = poolConfig.connectionString.replace(/:[^:@]*@/, ':********@');
  console.log('   URL:', maskedUrl.substring(0, 80) + (maskedUrl.length > 80 ? '...' : ''));
  console.log('   Host:', parsed.host);
  console.log('   Database:', parsed.database);
  console.log('   User:', parsed.user);
  console.log('   SSL:', poolConfig.ssl ? 'Enabled' : 'Disabled');
  if (poolConfig.ssl && typeof poolConfig.ssl === 'object') {
    console.log('   SSL rejectUnauthorized:', poolConfig.ssl.rejectUnauthorized);
  }
} else {
  console.log('   Host:', poolConfig.host);
  console.log('   Port:', poolConfig.port);
  console.log('   Database:', poolConfig.database);
  console.log('   User:', poolConfig.user);
  console.log('   SSL:', poolConfig.ssl ? 'Enabled' : 'Disabled');
}

// Connection events
pool.on('connect', () => {
  console.log('✅ PostgreSQL: Client connected to pool');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL: Pool error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 Stack:', err.stack);
  }
});

pool.on('acquire', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 PostgreSQL: Client acquired from pool');
  }
});

pool.on('remove', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('👋 PostgreSQL: Client removed from pool');
  }
});

// Enhanced query function with better error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const client = await pool.connect();
  
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      const queryType = text.trim().split(' ')[0].toUpperCase();
      const logMessage = `📊 PostgreSQL [${queryType}]: ${duration}ms, ${res.rowCount} row(s)`;
      
      if (duration > 1000) {
        console.warn(`⚠️  SLOW QUERY: ${logMessage}`);
        console.log('   Query:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      } else {
        console.log(logMessage);
      }
    }
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('❌ PostgreSQL: Query error', {
      query: text.substring(0, 200),
      params: params ? params.map(p => {
        if (typeof p === 'string') return p.substring(0, 50) + (p.length > 50 ? '...' : '');
        if (typeof p === 'object') return '[Object]';
        return p;
      }) : 'none',
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code
    });
    
    // Re-throw with more context
    if (error instanceof Error) {
      const enhancedError = new Error(`Database query failed: ${error.message}`);
      (enhancedError as any).originalError = error;
      (enhancedError as any).query = text;
      throw enhancedError;
    }
    throw error;
  } finally {
    client.release();
  }
}

// Helper for single row
export async function queryOne(text: string, params?: any[]): Promise<any | null> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

// Helper for multiple rows
export async function queryAll(text: string, params?: any[]): Promise<any[]> {
  const result = await query(text, params);
  return result.rows;
}

// Transaction helper
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back:', error instanceof Error ? error.message : error);
    throw error;
  } finally {
    client.release();
  }
}

// ConnectDB function for legacy code
export async function connectDB() {
  try {
    const client = await pool.connect();
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Database client acquired from pool');
    }
    return client;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw new Error(`Failed to acquire database client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get client function (alternative to connectDB)
export async function getClient() {
  return await connectDB();
}

// Test connection with detailed diagnostics
export async function testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
  const client = await connectDB();
  try {
    const result = await client.query(`
      SELECT 
        NOW() as time, 
        version() as version, 
        current_database() as db,
        current_user as user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port
    `);
    console.log('✅ Database connection test passed');
    return {
      success: true,
      details: result.rows[0]
    };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    client.release();
  }
}

// Comprehensive health check
export async function healthCheck() {
  try {
    const result = await query(`
      SELECT 
        NOW() as time,
        version() as version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_address,
        inet_server_port() as server_port,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections
    `);
    
    // Check connection pool status
    const poolStatus = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        time: result.rows[0]?.time,
        version: result.rows[0]?.version?.split(' ')[1] || 'unknown',
        name: result.rows[0]?.database,
        user: result.rows[0]?.user,
        server: `${result.rows[0]?.server_address}:${result.rows[0]?.server_port}`,
        activeConnections: result.rows[0]?.active_connections
      },
      pool: poolStatus
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      pool: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      }
    };
  }
}

// Graceful shutdown
export async function closePool() {
  console.log('🛑 Closing database pool...');
  try {
    await pool.end();
    console.log('✅ Database pool closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
}

// Check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Get table info
export async function getTableInfo(tableName: string) {
  try {
    const columns = await query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    const rowCount = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
    
    return {
      exists: true,
      columns: columns.rows,
      rowCount: parseInt(rowCount.rows[0].count)
    };
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Create a simple connection test for Supabase
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const result = await testConnection();
    if (result.success) {
      console.log('🎯 Supabase connection verified!');
      console.log('   Database:', result.details?.db);
      console.log('   User:', result.details?.user);
      console.log('   Server:', `${result.details?.server_address}:${result.details?.server_port}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Initialize connection on import
(async () => {
  try {
    console.log('🔧 Initializing database connection...');
    const test = await testConnection();
    if (test.success) {
      console.log('🚀 Database ready!');
    } else {
      console.warn('⚠️  Database connection test failed on startup:', test.error);
    }
  } catch (error) {
    console.error('❌ Failed to initialize database connection:', error);
  }
})();

// Export the pool for direct access
export { pool };
export default pool;