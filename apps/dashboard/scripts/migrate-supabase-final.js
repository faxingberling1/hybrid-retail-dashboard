// scripts/migrate-supabase-final.js
const { Pool } = require('pg');
const fs = require('fs');

console.log('🚀 Starting Supabase Migration\n');

// Configurations
const LOCAL_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'AlexMurphy',
  database: 'dashboard_db',
  ssl: false
};

// IPv6 connection string (must be in brackets)
const SUPABASE_CONNECTION_STRING = 'postgresql://postgres:8QjIEf4zslXy4aZR@[2406:da1a:6b0:f618:9828:d88c:9f7a:8ce4]:5432/postgres?sslmode=require';

async function testIPv6Connection() {
  console.log('🔍 Testing IPv6 connection to Supabase...');
  
  try {
    const pool = new Pool({
      connectionString: SUPABASE_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000
    });
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time, version() as version');
    
    console.log('✅ Connected successfully!');
    console.log('   Time:', result.rows[0].time);
    console.log('   PostgreSQL:', result.rows[0].version.split(' ')[1]);
    
    client.release();
    await pool.end();
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    
    // Provide detailed error info
    if (error.code === 'ENOTFOUND') {
      console.log('\n⚠️ DNS resolution failed. Trying alternative approach...');
      return false;
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n⚠️ Connection timeout. Your network might block IPv6.');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('\n⚠️ Your system cannot resolve IPv6 addresses.');
    }
    
    return false;
  }
}

async function exportLocalData() {
  console.log('\n📤 Exporting local database structure and data...');
  
  const localPool = new Pool(LOCAL_CONFIG);
  const client = await localPool.connect();
  
  try {
    // Get all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        database: 'dashboard_db',
        tableCount: tables.rows.length
      },
      tables: {}
    };
    
    // Export each table
    for (const table of tables.rows) {
      console.log(`   Processing: ${table.table_name}`);
      
      // Get table structure
      const structure = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position
      `, [table.table_name]);
      
      // Get data
      const data = await client.query(`SELECT * FROM ${table.table_name}`);
      
      exportData.tables[table.table_name] = {
        structure: structure.rows,
        data: data.rows,
        rowCount: data.rowCount
      };
      
      console.log(`     ✓ ${data.rowCount} rows`);
    }
    
    // Save JSON file
    fs.writeFileSync('supabase-export.json', JSON.stringify(exportData, null, 2));
    
    // Generate SQL file for manual import
    await generateSQLFile(client, tables.rows);
    
    console.log('\n✅ Export completed!');
    console.log('📁 Files created:');
    console.log('   1. supabase-export.json - Complete data export');
    console.log('   2. supabase-import.sql - SQL for manual import');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/zqpwfddzbtarvijqywvk/sql');
    console.log('   2. Open supabase-import.sql');
    console.log('   3. Copy and paste the SQL content');
    console.log('   4. Click RUN');
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    client.release();
    await localPool.end();
  }
}

async function generateSQLFile(client, tables) {
  console.log('\n📝 Generating SQL import file...');
  
  let sql = `-- Supabase Import SQL\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Source: Local PostgreSQL database\n`;
  sql += `-- Instructions: Paste this in Supabase SQL Editor and click RUN\n\n`;
  
  // Process each table
  for (const table of tables) {
    sql += `-- ========================================\n`;
    sql += `-- Table: ${table.table_name}\n`;
    sql += `-- ========================================\n\n`;
    
    // Get CREATE TABLE statement
    const createSQL = await client.query(`
      SELECT 
        'CREATE TABLE IF NOT EXISTS ' || quote_ident(table_name) || ' (\n' ||
        string_agg('  ' || quote_ident(column_name) || ' ' || data_type || 
          CASE 
            WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
            ELSE ''
          END ||
          CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
          CASE 
            WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default
            ELSE ''
          END, ',\n') || 
        '\n);' as create_statement
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = $1
      GROUP BY table_name
    `, [table.table_name]);
    
    if (createSQL.rows[0]?.create_statement) {
      sql += createSQL.rows[0].create_statement + '\n\n';
      
      // Insert data if table is not empty
      const data = await client.query(`SELECT * FROM ${table.table_name}`);
      
      if (data.rows.length > 0) {
        const columns = Object.keys(data.rows[0]);
        
        sql += `-- Insert ${data.rowCount} rows into ${table.table_name}\n`;
        sql += `INSERT INTO ${table.table_name} (${columns.map(c => `"${c}"`).join(', ')}) VALUES\n`;
        
        const values = data.rows.map((row, index) => {
          const rowValues = columns.map(col => {
            const value = row[col];
            if (value === null) return 'NULL';
            if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
            if (typeof value === 'number') return value.toString();
            if (value instanceof Date) {
              return `'${value.toISOString()}'`;
            }
            // Escape single quotes in strings
            return `'${String(value).replace(/'/g, "''")}'`;
          });
          
          return `  (${rowValues.join(', ')})${index < data.rows.length - 1 ? ',' : ''}`;
        });
        
        sql += values.join('\n') + ';\n\n';
      } else {
        sql += `-- Table ${table.table_name} is empty\n\n`;
      }
    }
  }
  
  // Add footer
  sql += `-- ========================================\n`;
  sql += `-- Migration completed\n`;
  sql += `-- ========================================\n`;
  
  fs.writeFileSync('supabase-import.sql', sql);
  console.log('✅ SQL file generated: supabase-import.sql');
}

// Main execution
async function main() {
  console.log('========================================');
  console.log('Supabase Migration Tool');
  console.log('========================================\n');
  
  console.log('Options:');
  console.log('1. Test IPv6 connection to Supabase');
  console.log('2. Export local data for manual import');
  console.log('3. Generate SQL file only');
  console.log('\nNote: If IPv6 fails, use option 2 for manual import.\n');
  
  // Test connection first
  const connected = await testIPv6Connection();
  
  if (!connected) {
    console.log('\n⚠️ Automatic migration not possible due to network issues.');
    console.log('📤 Proceeding with manual export method...\n');
    await exportLocalData();
  } else {
    console.log('\n✅ Ready for automatic migration!');
    // You could add automatic migration logic here
  }
}

main().catch(console.error);