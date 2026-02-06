// scripts/check-db.ts
import { query } from '@/lib/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkDatabase() {
  console.log('🔍 Checking database structure...\n');
  
  try {
    // Check notifications table
    console.log('📋 Notifications table:');
    const notifications = await query('SELECT * FROM notifications LIMIT 3');
    
    if (notifications.rows.length > 0) {
      notifications.rows.forEach((row, i) => {
        console.log(`\nNotification ${i + 1}:`);
        console.log(`  ID: ${row.id}`);
        console.log(`  User ID: ${row.user_id}`);
        console.log(`  Title: ${row.title}`);
        console.log(`  Type: ${row.type}`);
        console.log(`  Read: ${row.read}`);
        console.log(`  Metadata type: ${typeof row.metadata}`);
        console.log(`  Metadata: ${row.metadata}`);
        console.log(`  Metadata parsed:`, row.metadata);
      });
    } else {
      console.log('  No notifications found');
    }
    
    // Check table structure
    console.log('\n📊 Table columns:');
    const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'notifications'
      ORDER BY ordinal_position
    `);
    
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? 'Nullable' : 'Required'}`);
    });
    
    // Check if there are any users
    console.log('\n👥 Users in database:');
    try {
      const users = await query('SELECT id, email, role FROM users LIMIT 5');
      if (users.rows.length > 0) {
        users.rows.forEach(user => {
          console.log(`  ${user.email} (${user.role}): ${user.id}`);
        });
      } else {
        console.log('  No users found');
      }
    } catch (error) {
      console.log('  Users table might not exist');
    }
    
  } catch (error: any) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabase().catch(console.error);