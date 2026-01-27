// /app/api/database/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

// Helper to check if user has admin privileges
async function hasAdminAccess(request: NextRequest): Promise<{ 
  allowed: boolean; 
  userId?: string; 
  email?: string; 
  role?: string; 
  isAdmin?: boolean 
}> {
  try {
    // Get user info from headers (set by middleware)
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    const isAdminHeader = request.headers.get('x-is-admin');
    
    console.log('🔍 Database API - Headers received:', {
      userEmail,
      userRole,
      userId,
      isAdminHeader
    });
    
    // If we have user info from headers, use that
    if (userEmail && userRole) {
      const effectiveRole = String(userRole || '').toUpperCase().trim();
      const effectiveEmail = userEmail;
      
      // Allow SUPER_ADMIN, ADMIN, and MANAGER roles
      const allowedRoles = ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER'];
      const isAdmin = allowedRoles.some(role => effectiveRole.includes(role)) || 
                     isAdminHeader === 'true';
      
      console.log('🔍 Database API - Using header data:', {
        email: effectiveEmail,
        role: effectiveRole,
        isAdmin,
        allowedRoles,
        userId
      });
      
      return { 
        allowed: isAdmin, 
        userId: userId || undefined,
        email: effectiveEmail,
        role: effectiveRole,
        isAdmin
      };
    }
    
    // FALLBACK: Try to get session (if headers not available)
    console.log('⚠️ Database API - No headers, falling back to session');
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('❌ No session found');
      return { allowed: false };
    }
    
    const user = session.user;
    const userRoleFromSession = String(user.role || '').toUpperCase().trim();
    
    // Allow SUPER_ADMIN, ADMIN, and MANAGER roles
    const allowedRoles = ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER'];
    const isAdmin = allowedRoles.some(role => userRoleFromSession.includes(role));
    
    console.log('🔍 Database API - Session check:', {
      email: user.email,
      role: userRoleFromSession,
      isAdmin,
      allowedRoles,
      userId: user.id
    });
    
    return { 
      allowed: isAdmin, 
      userId: user.id, 
      email: user.email, 
      role: userRoleFromSession,
      isAdmin
    };
    
  } catch (error) {
    console.error('❌ Error checking admin access:', error);
    return { allowed: false };
  }
}

export async function GET(request: NextRequest) {
  console.log('\n🔍 Database API - GET request');
  console.log('📨 Request URL:', request.url);
  
  try {
    // Check admin access - pass the request object
    const access = await hasAdminAccess(request);
    
    if (!access.allowed) {
      console.log('❌ Access denied:', access);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied. Admin privileges required.',
          debug: {
            user: access.email ? { 
              email: access.email, 
              role: access.role,
              isAdmin: access.isAdmin 
            } : 'No user info',
            timestamp: new Date().toISOString(),
            requiredRoles: ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER']
          }
        },
        { status: 403 }
      );
    }
    
    console.log('✅ Access granted to:', {
      email: access.email,
      role: access.role,
      userId: access.userId
    });
    
    // Parse URL parameters
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    console.log(`📨 Action requested: ${action}`);
    
    switch (action) {
      case 'tables':
        // Get all tables with details
        const tablesQuery = await query(`
          SELECT 
            schemaname as schema_name,
            tablename as table_name,
            tableowner as table_owner
          FROM pg_tables
          WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
          ORDER BY tablename
        `);
        
        console.log(`📊 Found ${tablesQuery.rows.length} tables`);
        
        // Get enhanced table info
        const tablesWithDetails = await Promise.all(
          tablesQuery.rows.map(async (table: any) => {
            try {
              // Get row count
              const countResult = await query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
              const rowCount = parseInt(countResult.rows[0].count) || 0;
              
              // Get table size
              const sizeResult = await query(`
                SELECT pg_size_pretty(pg_total_relation_size('${table.table_name}')) as size
              `);
              const size = sizeResult.rows[0]?.size || '0 bytes';
              
              // Get columns
              const columnsResult = await query(`
                SELECT 
                  column_name,
                  data_type,
                  is_nullable,
                  column_default
                FROM information_schema.columns
                WHERE table_name = '${table.table_name}'
                ORDER BY ordinal_position
              `);
              
              const columns = columnsResult.rows.map(row => ({
                columnName: row.column_name,
                dataType: row.data_type,
                isNullable: row.is_nullable === 'YES',
                isPrimaryKey: false,
                isUnique: false,
                defaultValue: row.column_default
              }));
              
              // Get constraints
              try {
                const constraintsResult = await query(`
                  SELECT
                    kcu.column_name,
                    tc.constraint_type
                  FROM information_schema.table_constraints tc
                  JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                  WHERE tc.table_name = '${table.table_name}'
                    AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
                `);
                
                constraintsResult.rows.forEach(constraint => {
                  const column = columns.find(c => c.columnName === constraint.column_name);
                  if (column) {
                    if (constraint.constraint_type === 'PRIMARY KEY') {
                      column.isPrimaryKey = true;
                    } else if (constraint.constraint_type === 'UNIQUE') {
                      column.isUnique = true;
                    }
                  }
                });
              } catch (error) {
                console.log(`⚠️ Could not get constraints for ${table.table_name}:`, error);
              }
              
              // Get indexes
              const indexesResult = await query(`
                SELECT
                  indexname as index_name,
                  indexdef as index_definition,
                  indisunique as is_unique
                FROM pg_indexes
                WHERE tablename = '${table.table_name}'
              `);
              
              const indexes = indexesResult.rows.map(row => ({
                indexName: row.index_name,
                indexDefinition: row.index_definition,
                isUnique: row.is_unique
              }));
              
              return {
                tableName: table.table_name,
                rowCount,
                size,
                columns,
                indexes
              };
            } catch (error) {
              console.error(`❌ Error getting details for ${table.table_name}:`, error);
              return {
                tableName: table.table_name,
                rowCount: 0,
                size: '0 bytes',
                columns: [],
                indexes: []
              };
            }
          })
        );
        
        return NextResponse.json({
          success: true,
          tables: tablesWithDetails,
          user: {
            email: access.email,
            role: access.role,
            userId: access.userId
          },
          timestamp: new Date().toISOString(),
          message: `Found ${tablesQuery.rows.length} tables`
        });
        
      case 'stats':
        // Get database statistics
        const statsResult = await query(`
          SELECT 
            COUNT(*) as total_tables,
            COALESCE(SUM(n_live_tup), 0) as total_rows,
            pg_size_pretty(pg_database_size(current_database())) as total_size
          FROM pg_stat_user_tables
        `);
        
        // Get active connections
        const connectionsResult = await query(`
          SELECT COUNT(*) as active_connections 
          FROM pg_stat_activity 
          WHERE state = 'active'
        `);
        
        // Get uptime
        const uptimeResult = await query(`
          SELECT 
            EXTRACT(EPOCH FROM (current_timestamp - pg_postmaster_start_time())) as uptime_seconds
        `);
        
        const uptimeSeconds = parseInt(uptimeResult.rows[0]?.uptime_seconds) || 0;
        let formattedUptime = 'Unknown';
        
        if (uptimeSeconds > 0) {
          const days = Math.floor(uptimeSeconds / 86400);
          const hours = Math.floor((uptimeSeconds % 86400) / 3600);
          const minutes = Math.floor((uptimeSeconds % 3600) / 60);
          
          if (days > 0) {
            formattedUptime = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            formattedUptime = `${hours}h ${minutes}m`;
          } else {
            formattedUptime = `${minutes}m`;
          }
        }
        
        return NextResponse.json({
          success: true,
          stats: {
            totalTables: parseInt(statsResult.rows[0]?.total_tables) || 0,
            totalRows: parseInt(statsResult.rows[0]?.total_rows) || 0,
            totalSize: statsResult.rows[0]?.total_size || '0 bytes',
            activeConnections: parseInt(connectionsResult.rows[0]?.active_connections) || 1,
            lastBackup: null,
            uptime: formattedUptime
          },
          user: {
            email: access.email,
            role: access.role,
            userId: access.userId
          },
          timestamp: new Date().toISOString()
        });
        
      case 'health':
        // Health checks
        const checks = [];
        
        try {
          // Connection check
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
            message: 'Connection failed'
          });
        }
        
        // Table count check
        try {
          const tableCountResult = await query(`
            SELECT COUNT(*) FROM pg_tables 
            WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
          `);
          const tableCount = parseInt(tableCountResult.rows[0].count) || 0;
          checks.push({
            name: 'Table Access',
            status: 'pass',
            message: `${tableCount} tables accessible`
          });
        } catch (error) {
          checks.push({
            name: 'Table Access',
            status: 'fail',
            message: 'Cannot access tables'
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
        
        // Determine overall status
        const hasFail = checks.some(c => c.status === 'fail');
        const hasWarning = checks.some(c => c.status === 'warning');
        const overallStatus = hasFail ? 'critical' : hasWarning ? 'warning' : 'healthy';
        
        return NextResponse.json({
          success: true,
          health: {
            status: overallStatus,
            checks
          },
          user: {
            email: access.email,
            role: access.role,
            userId: access.userId
          },
          timestamp: new Date().toISOString()
        });
        
      case null:
      case undefined:
        // Default action - list available actions
        return NextResponse.json({
          success: true,
          message: 'Database API is working',
          availableActions: [
            'tables - Get all tables with details',
            'stats - Get database statistics',
            'health - Check database health'
          ],
          user: {
            email: access.email,
            role: access.role,
            userId: access.userId
          },
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action. Valid actions: tables, stats, health',
            validActions: ['tables', 'stats', 'health'],
            requestedAction: action
          },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('❌ Database API - GET error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        debug: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        } : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('\n🔍 Database API - POST request');
  
  try {
    // Check admin access - pass the request object
    const access = await hasAdminAccess(request);
    
    if (!access.allowed) {
      console.log('❌ Access denied:', access);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied. Admin privileges required.',
          debug: {
            user: access.email ? { 
              email: access.email, 
              role: access.role,
              isAdmin: access.isAdmin 
            } : 'No user info',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }
    
    console.log('✅ Access granted to:', {
      email: access.email,
      role: access.role,
      userId: access.userId
    });
    
    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body'
        },
        { status: 400 }
      );
    }
    
    const { action, ...data } = body;
    
    if (!action) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Action is required'
        },
        { status: 400 }
      );
    }
    
    console.log(`📨 POST action: ${action}`, { 
      tableName: data.tableName,
      userId: access.userId 
    });
    
    switch (action) {
      case 'table_data':
        if (!data.tableName || typeof data.tableName !== 'string') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Table name is required and must be a string'
            },
            { status: 400 }
          );
        }
        
        const tableName = data.tableName.trim();
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Invalid table name'
            },
            { status: 400 }
          );
        }
        
        const page = parseInt(data.page) || 1;
        const pageSize = parseInt(data.pageSize) || 20;
        const offset = (page - 1) * pageSize;
        
        try {
          // Get data with pagination
          const dataResult = await query(
            `SELECT * FROM "${tableName}" ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2`,
            [pageSize, offset]
          );
          
          // Get total count
          const countResult = await query(
            `SELECT COUNT(*) FROM "${tableName}"`
          );
          
          const total = parseInt(countResult.rows[0].count) || 0;
          
          return NextResponse.json({
            success: true,
            data: dataResult.rows,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            tableName,
            columns: dataResult.fields?.map(field => field.name) || [],
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          });
          
        } catch (error: any) {
          console.error(`Error getting data from ${tableName}:`, error);
          
          // Check if table exists
          try {
            const tableExists = await query(`
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = $1
              )
            `, [tableName]);
            
            if (!tableExists.rows[0].exists) {
              return NextResponse.json(
                { 
                  success: false, 
                  error: `Table "${tableName}" does not exist`
                },
                { status: 404 }
              );
            }
          } catch {
            // Ignore error in checking table existence
          }
          
          return NextResponse.json(
            { 
              success: false, 
              error: `Failed to get data from table "${tableName}": ${error.message}`
            },
            { status: 500 }
          );
        }
        
      case 'execute_query':
        if (!data.query || typeof data.query !== 'string') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Query is required and must be a string'
            },
            { status: 400 }
          );
        }
        
        const queryText = data.query.trim();
        if (!queryText) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Query cannot be empty'
            },
            { status: 400 }
          );
        }
        
        // Safety check - block dangerous operations
        const upperQuery = queryText.toUpperCase();
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
          return NextResponse.json(
            { 
              success: false, 
              error: 'Dangerous SQL operations are not allowed'
            },
            { status: 403 }
          );
        }
        
        // Execute the query
        const startTime = Date.now();
        try {
          const result = await query(queryText);
          const executionTime = Date.now() - startTime;
          
          return NextResponse.json({
            success: true,
            data: result.rows,
            rowCount: result.rowCount || 0,
            executionTime: `${executionTime}ms`,
            columns: result.fields?.map(field => field.name) || [],
            isSelect: upperQuery.startsWith('SELECT'),
            message: `Query executed successfully in ${executionTime}ms`,
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          });
        } catch (error: any) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Query execution failed: ${error.message}`
            },
            { status: 500 }
          );
        }
        
      case 'table_structure':
        if (!data.tableName) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Table name is required'
            },
            { status: 400 }
          );
        }
        
        try {
          const structureResult = await query(`
            SELECT 
              c.column_name,
              c.data_type,
              c.is_nullable,
              c.column_default,
              CASE WHEN kcu.column_name IS NOT NULL THEN true ELSE false END as is_primary_key
            FROM information_schema.columns c
            LEFT JOIN information_schema.key_column_usage kcu
              ON c.table_name = kcu.table_name 
              AND c.column_name = kcu.column_name
              AND kcu.constraint_name IN (
                SELECT constraint_name 
                FROM information_schema.table_constraints 
                WHERE constraint_type = 'PRIMARY KEY'
              )
            WHERE c.table_name = $1
            ORDER BY c.ordinal_position
          `, [data.tableName]);
          
          return NextResponse.json({
            success: true,
            tableName: data.tableName,
            columns: structureResult.rows.map(row => ({
              columnName: row.column_name,
              dataType: row.data_type,
              isNullable: row.is_nullable === 'YES',
              isPrimaryKey: row.is_primary_key,
              defaultValue: row.column_default
            })),
            columnCount: structureResult.rows.length,
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          });
        } catch (error: any) {
          return NextResponse.json(
            { 
              success: false, 
              error: `Failed to get table structure: ${error.message}`
            },
            { status: 500 }
          );
        }
        
      case 'test_connection':
        try {
          const testResult = await query('SELECT 1 as test_value, version() as version, current_database() as database');
          return NextResponse.json({
            success: true,
            connected: true,
            message: 'Database connection test successful',
            details: {
              testValue: testResult.rows[0].test_value,
              version: testResult.rows[0].version,
              database: testResult.rows[0].database,
              timestamp: new Date().toISOString()
            },
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            connected: false,
            error: 'Database connection test failed',
            message: error.message,
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          });
        }
        
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: `Invalid action: ${action}. Valid actions: table_data, execute_query, table_structure, test_connection`,
            user: {
              email: access.email,
              role: access.role,
              userId: access.userId
            }
          },
          { status: 400 }
        );
    }
    
  } catch (error: any) {
    console.error('❌ Database API - POST error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        debug: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        } : undefined,
        user: {
          email: 'error@system.local',
          role: 'SYSTEM',
          userId: 'system-error'
        }
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email, x-user-role, x-user-id, x-is-admin',
    },
  });
}