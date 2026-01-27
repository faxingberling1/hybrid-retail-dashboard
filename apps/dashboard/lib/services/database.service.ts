// apps/dashboard/lib/services/database.service.ts
import { query, queryOne } from '@/lib/db';

export interface TableInfo {
  tableName: string;
  rowCount: number;
  size: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
}

export interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  defaultValue: string | null;
}

export interface IndexInfo {
  indexName: string;
  indexDefinition: string;
  isUnique: boolean;
}

export interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  totalSize: string;
  activeConnections: number;
  lastBackup: Date | null;
  uptime: string;
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  executionTime?: number;
  affectedRows?: number;
}

export interface InsertResult {
  success: boolean;
  insertedId?: any;
  error?: string;
}

export interface UpdateResult {
  success: boolean;
  updatedRows?: number;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  deletedRows?: number;
  error?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
}

export interface TableDataResult {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class DatabaseService {
  /**
   * Get all tables in the database
   */
  static async getTables(): Promise<TableInfo[]> {
    try {
      // Get basic table info
      const tablesQuery = await query(`
        SELECT 
          schemaname as schema_name,
          tablename as table_name,
          tableowner as table_owner
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY tablename
      `);

      const tables = await Promise.all(
        tablesQuery.rows.map(async (row) => {
          try {
            return await this.getTableDetails(row.table_name);
          } catch (error) {
            console.error(`Error getting details for table ${row.table_name}:`, error);
            return {
              tableName: row.table_name,
              rowCount: 0,
              size: '0 bytes',
              columns: [],
              indexes: []
            };
          }
        })
      );

      return tables;
    } catch (error: any) {
      console.error('Error getting tables:', error);
      throw new Error(`Failed to get tables: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific table
   */
  static async getTableDetails(tableName: string): Promise<TableInfo> {
    try {
      // Get row count
      const countResult = await query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = parseInt(countResult.rows[0]?.count) || 0;

      // Get table size
      const sizeResult = await query(`
        SELECT pg_size_pretty(pg_total_relation_size($1)) as size
      `, [tableName]);
      const size = sizeResult.rows[0]?.size || '0 bytes';

      // Get columns info with constraints
      const columnsResult = await query(`
        SELECT 
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          CASE 
            WHEN tc.constraint_type = 'PRIMARY KEY' THEN true 
            ELSE false 
          END as is_primary_key,
          CASE 
            WHEN tc.constraint_type = 'UNIQUE' THEN true 
            ELSE false 
          END as is_unique
        FROM information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_name = kcu.table_name 
          AND c.column_name = kcu.column_name
          AND c.table_schema = kcu.table_schema
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name
          AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
          AND tc.table_schema = c.table_schema
        WHERE c.table_name = $1
          AND c.table_schema = 'public'
        ORDER BY c.ordinal_position
      `, [tableName]);

      const columns: ColumnInfo[] = columnsResult.rows.map(row => ({
        columnName: row.column_name,
        dataType: row.data_type,
        isNullable: row.is_nullable === 'YES',
        isPrimaryKey: row.is_primary_key || false,
        isUnique: row.is_unique || false,
        defaultValue: row.column_default
      }));

      // Get indexes
      const indexesResult = await query(`
        SELECT
          indexname as index_name,
          indexdef as index_definition,
          indisunique as is_unique
        FROM pg_indexes
        WHERE tablename = $1
          AND schemaname = 'public'
      `, [tableName]);

      const indexes: IndexInfo[] = indexesResult.rows.map(row => ({
        indexName: row.index_name,
        indexDefinition: row.index_definition,
        isUnique: row.is_unique
      }));

      return {
        tableName,
        rowCount,
        size,
        columns,
        indexes
      };
    } catch (error: any) {
      console.error(`Error getting table details for ${tableName}:`, error);
      throw new Error(`Failed to get table details: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      // Total tables
      const tablesResult = await query(`
        SELECT COUNT(*) as total_tables
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
          AND schemaname = 'public'
      `);
      const totalTables = parseInt(tablesResult.rows[0]?.total_tables) || 0;

      // Total rows across all tables
      const rowsResult = await query(`
        SELECT COALESCE(SUM(n_live_tup), 0) as total_rows
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
      `);
      const totalRows = parseInt(rowsResult.rows[0]?.total_rows) || 0;

      // Database size
      const sizeResult = await query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as total_size
      `);
      const totalSize = sizeResult.rows[0]?.total_size || '0 bytes';

      // Active connections
      const connectionsResult = await query(`
        SELECT COUNT(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active'
          AND datname = current_database()
      `);
      const activeConnections = parseInt(connectionsResult.rows[0]?.active_connections) || 0;

      // Last backup (from pg_stat_archiver if available)
      let lastBackup = null;
      try {
        const backupResult = await queryOne(`
          SELECT last_archived_time 
          FROM pg_stat_archiver 
          WHERE last_archived_time IS NOT NULL 
          ORDER BY last_archived_time DESC 
          LIMIT 1
        `);
        if (backupResult) {
          lastBackup = backupResult.last_archived_time;
        }
      } catch (error) {
        // Table might not exist, ignore
        console.log('Could not check backup status:', error);
      }

      // Database uptime
      const uptimeResult = await query(`
        SELECT 
          EXTRACT(EPOCH FROM (current_timestamp - pg_postmaster_start_time())) as uptime_seconds
      `);
      const uptimeSeconds = parseInt(uptimeResult.rows[0]?.uptime_seconds) || 0;
      
      // Format uptime nicely
      let uptime = 'Unknown';
      if (uptimeSeconds > 0) {
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        
        if (days > 0) {
          uptime = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          uptime = `${hours}h ${minutes}m`;
        } else {
          uptime = `${minutes}m`;
        }
      }

      return {
        totalTables,
        totalRows,
        totalSize,
        activeConnections,
        lastBackup,
        uptime
      };
    } catch (error: any) {
      console.error('Error getting database stats:', error);
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }

  /**
   * Execute a custom SQL query
   */
  static async executeQuery(queryText: string): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      // Safety check - block dangerous operations
      const upperQuery = queryText.toUpperCase().trim();
      const dangerousPatterns = [
        'DROP DATABASE',
        'DROP TABLE',
        'TRUNCATE TABLE',
        'ALTER TABLE',
        'ALTER DATABASE',
        'CREATE DATABASE',
        'CREATE USER',
        'DROP USER',
        'GRANT ALL',
        'REVOKE ALL',
        'VACUUM FULL',
        'REINDEX',
        '\\c ', // Connect to another database
        'COPY FROM'
      ];
      
      if (dangerousPatterns.some(pattern => upperQuery.includes(pattern))) {
        return {
          success: false,
          error: 'Dangerous SQL operations are not allowed'
        };
      }

      const result = await query(queryText);
      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data: result.rows,
        executionTime,
        affectedRows: result.rowCount || 0
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get table data with pagination
   */
  static async getTableData(
    tableName: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<TableDataResult> {
    try {
      // Validate table name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        throw new Error('Invalid table name');
      }

      // Get total count
      const countResult = await query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const total = parseInt(countResult.rows[0]?.count) || 0;
      
      // Calculate offset
      const offset = (page - 1) * pageSize;
      
      // Get paginated data with proper ordering
      let orderClause = '';
      try {
        // Try to order by created_at or id if they exist
        const hasCreatedAt = await this.columnExists(tableName, 'created_at');
        const hasId = await this.columnExists(tableName, 'id');
        
        if (hasCreatedAt) {
          orderClause = 'ORDER BY created_at DESC';
        } else if (hasId) {
          orderClause = 'ORDER BY id DESC';
        }
      } catch {
        // If we can't determine columns, don't specify order
      }
      
      const dataResult = await query(
        `SELECT * FROM "${tableName}" ${orderClause} LIMIT $1 OFFSET $2`,
        [pageSize, offset]
      );
      
      return {
        data: dataResult.rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error: any) {
      console.error(`Error getting table data from ${tableName}:`, error);
      throw new Error(`Failed to get table data: ${error.message}`);
    }
  }

  /**
   * Check if a column exists in a table
   */
  private static async columnExists(tableName: string, columnName: string): Promise<boolean> {
    try {
      const result = await query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = $1 
            AND column_name = $2
            AND table_schema = 'public'
        ) as exists
      `, [tableName, columnName]);
      
      return result.rows[0]?.exists || false;
    } catch {
      return false;
    }
  }

  /**
   * Insert data into a table
   */
  static async insertData(tableName: string, data: Record<string, any>): Promise<InsertResult> {
    try {
      // Validate table name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return {
          success: false,
          error: 'Invalid table name'
        };
      }

      const columns = Object.keys(data);
      const values = Object.values(data);
      
      if (columns.length === 0) {
        return {
          success: false,
          error: 'No data provided'
        };
      }

      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      
      const queryText = `
        INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const result = await query(queryText, values);
      
      return {
        success: true,
        insertedId: result.rows[0]?.id || result.rows[0]
      };
    } catch (error: any) {
      console.error(`Error inserting data into ${tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update data in a table
   */
  static async updateData(
    tableName: string, 
    id: any, 
    data: Record<string, any>,
    idColumn: string = 'id'
  ): Promise<UpdateResult> {
    try {
      // Validate table name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return {
          success: false,
          error: 'Invalid table name'
        };
      }

      if (!id) {
        return {
          success: false,
          error: 'ID is required'
        };
      }

      const updates = Object.keys(data).map((key, i) => `"${key}" = $${i + 1}`).join(', ');
      const values = Object.values(data);
      values.push(id);
      
      const queryText = `
        UPDATE "${tableName}"
        SET ${updates}, updated_at = NOW()
        WHERE "${idColumn}" = $${values.length}
        RETURNING *
      `;
      
      const result = await query(queryText, values);
      
      return {
        success: true,
        updatedRows: result.rowCount || 0
      };
    } catch (error: any) {
      console.error(`Error updating data in ${tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete data from a table
   */
  static async deleteData(
    tableName: string, 
    id: any, 
    idColumn: string = 'id'
  ): Promise<DeleteResult> {
    try {
      // Validate table name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return {
          success: false,
          error: 'Invalid table name'
        };
      }

      if (!id) {
        return {
          success: false,
          error: 'ID is required'
        };
      }

      const queryText = `
        DELETE FROM "${tableName}"
        WHERE "${idColumn}" = $1
        RETURNING *
      `;
      
      const result = await query(queryText, [id]);
      
      return {
        success: true,
        deletedRows: result.rowCount || 0
      };
    } catch (error: any) {
      console.error(`Error deleting data from ${tableName}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get database health status
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    const checks = [];
    
    // Check database connection
    try {
      await query('SELECT 1');
      checks.push({
        name: 'Database Connection',
        status: 'pass',
        message: 'Connected successfully'
      });
    } catch (error) {
      checks.push({
        name: 'Database Connection',
        status: 'fail',
        message: 'Failed to connect to database'
      });
    }
    
    // Check for locks
    try {
      const locksResult = await query(`
        SELECT COUNT(*) as lock_count
        FROM pg_locks
        WHERE granted = false
      `);
      
      const lockCount = parseInt(locksResult.rows[0]?.lock_count) || 0;
      if (lockCount > 10) {
        checks.push({
          name: 'Database Locks',
          status: 'warning',
          message: `${lockCount} unfulfilled locks detected`
        });
      } else {
        checks.push({
          name: 'Database Locks',
          status: 'pass',
          message: 'No significant locks detected'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Database Locks',
        status: 'fail',
        message: 'Failed to check locks'
      });
    }
    
    // Check table accessibility
    try {
      const tablesResult = await query(`
        SELECT COUNT(*) as table_count
        FROM pg_tables
        WHERE schemaname = 'public'
      `);
      const tableCount = parseInt(tablesResult.rows[0]?.table_count) || 0;
      
      if (tableCount > 0) {
        checks.push({
          name: 'Table Access',
          status: 'pass',
          message: `Accessible tables: ${tableCount}`
        });
      } else {
        checks.push({
          name: 'Table Access',
          status: 'warning',
          message: 'No tables found in public schema'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Table Access',
        status: 'fail',
        message: 'Failed to access tables'
      });
    }
    
    // Check database size
    try {
      const sizeResult = await query(`
        SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
      `);
      const dbSize = sizeResult.rows[0]?.db_size || '0 bytes';
      
      checks.push({
        name: 'Database Size',
        status: 'pass',
        message: `Database size: ${dbSize}`
      });
    } catch (error) {
      checks.push({
        name: 'Database Size',
        status: 'fail',
        message: 'Failed to check database size'
      });
    }
    
    // Determine overall status
    const hasFail = checks.some(c => c.status === 'fail');
    const hasWarning = checks.some(c => c.status === 'warning');
    
    return {
      status: hasFail ? 'critical' : hasWarning ? 'warning' : 'healthy',
      checks
    };
  }

  /**
   * Get table structure (simplified version)
   */
  static async getTableStructure(tableName: string): Promise<{
    tableName: string;
    columns: ColumnInfo[];
    columnCount: number;
  }> {
    try {
      const result = await query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = $1
          AND table_schema = 'public'
        ORDER BY ordinal_position
      `, [tableName]);
      
      const columns: ColumnInfo[] = result.rows.map(row => ({
        columnName: row.column_name,
        dataType: row.data_type,
        isNullable: row.is_nullable === 'YES',
        isPrimaryKey: false,
        isUnique: false,
        defaultValue: row.column_default
      }));
      
      // Get primary keys
      try {
        const pkResult = await query(`
          SELECT kcu.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          WHERE tc.table_name = $1
            AND tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
        `, [tableName]);
        
        pkResult.rows.forEach(pk => {
          const column = columns.find(c => c.columnName === pk.column_name);
          if (column) {
            column.isPrimaryKey = true;
          }
        });
      } catch (error) {
        console.log(`Could not get primary keys for ${tableName}:`, error);
      }
      
      return {
        tableName,
        columns,
        columnCount: columns.length
      };
    } catch (error: any) {
      console.error(`Error getting table structure for ${tableName}:`, error);
      throw new Error(`Failed to get table structure: ${error.message}`);
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<{
    success: boolean;
    connected: boolean;
    message?: string;
    details?: {
      version: string;
      database: string;
      timestamp: string;
    };
  }> {
    try {
      const result = await queryOne(`
        SELECT 
          version() as version,
          current_database() as database,
          current_timestamp as timestamp
      `);
      
      return {
        success: true,
        connected: true,
        message: 'Database connection test successful',
        details: {
          version: result.version,
          database: result.database,
          timestamp: result.timestamp
        }
      };
    } catch (error: any) {
      return {
        success: false,
        connected: false,
        message: `Database connection test failed: ${error.message}`
      };
    }
  }

  /**
   * Get database version info
   */
  static async getVersionInfo(): Promise<{
    postgresVersion: string;
    serverInfo: string;
    timestamp: string;
  }> {
    try {
      const result = await queryOne(`
        SELECT 
          version() as full_version,
          current_setting('server_version') as server_version,
          current_timestamp as timestamp
      `);
      
      return {
        postgresVersion: result.server_version,
        serverInfo: result.full_version,
        timestamp: result.timestamp
      };
    } catch (error: any) {
      throw new Error(`Failed to get version info: ${error.message}`);
    }
  }
}