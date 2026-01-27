// apps/dashboard/scripts/test-db-final.ts
import { testConnection, query } from '@/lib/db';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testDatabase() {
  console.log('🔍 Final Database Test\n');
  
  // Show environment variables
  console.log('1. Environment Variables:');
  console.log(`   POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
  console.log(`   POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);
  console.log(`   POSTGRES_DATABASE: ${process.env.POSTGRES_DATABASE}`);
  console.log(`   POSTGRES_USER: ${process.env.POSTGRES_USER}`);
  console.log(`   POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD ? '***set***' : 'not set'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  
  // Test connection
  console.log('\n2. Testing Connection...');
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ Database connection successful!');
  } else {
    console.log('❌ Database connection failed');
    return;
  }
  
  // Test query
  console.log('\n3. Testing Query...');
  try {
    const result = await query('SELECT version()');
    console.log(`✅ PostgreSQL Version: ${result.rows[0].version.split(',')[0]}`);
  } catch (error: any) {
    console.log(`❌ Query failed: ${error.message}`);
  }
  
  // List tables
  console.log('\n4. Listing Tables...');
  try {
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${tables.rows.length} tables:`);
    tables.rows.forEach((table, i) => {
      console.log(`   ${i + 1}. ${table.table_name}`);
    });
  } catch (error: any) {
    console.log(`❌ Could not list tables: ${error.message}`);
  }
  
  console.log('\n🎉 Database test complete!');
}

testDatabase().catch(console.error);