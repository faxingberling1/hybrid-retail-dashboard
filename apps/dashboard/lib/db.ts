import { Pool, PoolConfig } from 'pg'

// Only disable native if explicitly requested
if (process.env.PG_DISABLE_NATIVE === 'true') {
  process.env.PG_DISABLE_NATIVE = 'true';
}

function getPoolConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    console.log('📡 Using DATABASE_URL');

    // Parse URL manually or let pg handle it.
    // We'll let pg handle it mostly, but we can inspect it for logging if needed.

    // Default SSL to false unless specified in URL or env
    const isProd = process.env.NODE_ENV === 'production';

    // Simple config - trust the connection string + robust defaults
    return {
      connectionString: process.env.DATABASE_URL,
      // For many cloud providers (like Neon, DigitalOcean, etc), SSL is required.
      // If the URL has ?sslmode=... pg will handle it.
      // If not, we might need to enforce it in prod.
      ssl: isProd ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }

  // Fallback to individual components
  return {
    host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE || process.env.DB_NAME || 'postgres',
    user: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

const pool = new Pool(getPoolConfig());

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ PostgreSQL: Pool error:', err.message);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// Helper for backward compatibility
export async function connectDB() {
  return await pool.connect();
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
    throw error;
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

export { pool };