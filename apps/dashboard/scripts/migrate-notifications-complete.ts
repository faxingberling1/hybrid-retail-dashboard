// scripts/migrate-notifications-complete.ts
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Enhanced SQL parser that handles dollar-quoted strings and comments
function parseSQL(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let inLineComment = false;
  let inBlockComment = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1] || '';
    
    // Handle block comments
    if (!inDollarQuote && !inLineComment && char === '/' && nextChar === '*') {
      inBlockComment = true;
      i++; // Skip next character
      continue;
    }
    
    if (inBlockComment && char === '*' && nextChar === '/') {
      inBlockComment = false;
      i++; // Skip next character
      continue;
    }
    
    if (inBlockComment) continue;
    
    // Handle line comments
    if (!inDollarQuote && !inBlockComment && char === '-' && nextChar === '-') {
      inLineComment = true;
      continue;
    }
    
    if (inLineComment && char === '\n') {
      inLineComment = false;
      continue;
    }
    
    if (inLineComment) continue;
    
    // Handle dollar-quoted strings
    if (char === '$' && !inDollarQuote) {
      // Start of dollar quote
      currentStatement += char;
      
      // Get the dollar tag
      let tag = '';
      let j = i + 1;
      while (j < sql.length && sql[j] !== '$') {
        tag += sql[j];
        currentStatement += sql[j];
        j++;
      }
      
      if (sql[j] === '$') {
        currentStatement += '$';
        i = j;
        inDollarQuote = true;
        dollarTag = tag;
      }
    } else if (char === '$' && inDollarQuote) {
      // Check if this ends the dollar quote
      currentStatement += char;
      
      let tag = '';
      let j = i + 1;
      while (j < sql.length && sql[j] !== '$') {
        tag += sql[j];
        currentStatement += sql[j];
        j++;
      }
      
      if (sql[j] === '$') {
        currentStatement += '$';
        i = j;
        if (tag === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
        }
      }
    } else if (char === ';' && !inDollarQuote) {
      // Statement terminator
      currentStatement += char;
      const trimmed = currentStatement.trim();
      if (trimmed.length > 0 && !trimmed.startsWith('--') && !trimmed.startsWith('/*')) {
        statements.push(trimmed);
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add any remaining statement
  const finalTrimmed = currentStatement.trim();
  if (finalTrimmed.length > 0 && !finalTrimmed.startsWith('--') && !finalTrimmed.startsWith('/*')) {
    statements.push(finalTrimmed);
  }
  
  return statements;
}

async function runMigration() {
  const client = await pool.connect();
  
  console.log('🚀 COMPLETE NOTIFICATION SYSTEM MIGRATION');
  console.log('==========================================\n');
  console.log(`📊 Database: ${process.env.DB_NAME}`);
  console.log(`👤 User: ${process.env.DB_USER}`);
  console.log(`🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log('───────────────────────────────────────────\n');
  
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../lib/db/migrations/002_notifications.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found at: ${migrationPath}`);
      process.exit(1);
    }
    
    console.log('📄 Loading migration file...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Parse SQL into statements
    const statements = parseSQL(migrationSQL);
    
    console.log(`📋 Found ${statements.length} SQL statements\n`);
    
    // Start transaction
    await client.query('BEGIN');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Execute statements in logical groups
    const statementGroups = [
      { name: 'Tables', start: 0, end: 2 },
      { name: 'Indexes', start: 2, end: 20 },
      { name: 'Functions & Triggers', start: 20, end: 40 },
      { name: 'Views', start: 40, end: 45 },
      { name: 'Sample Data', start: 45, end: statements.length }
    ];
    
    for (const group of statementGroups) {
      console.log(`\n📦 ${group.name.toUpperCase()}`);
      console.log('─'.repeat(40));
      
      for (let i = group.start; i < Math.min(group.end, statements.length); i++) {
        const statement = statements[i];
        
        // Skip empty statements
        if (!statement || statement.trim().length === 0) continue;
        
        // Show a preview
        const lines = statement.split('\n');
        const previewLine = lines.find(line => line.trim().length > 0 && !line.trim().startsWith('--')) || '';
        const preview = previewLine.length > 80 ? previewLine.substring(0, 80) + '...' : previewLine;
        
        console.log(`[${i + 1}/${statements.length}] ${preview}`);
        
        try {
          await client.query(statement);
          successCount++;
          console.log(`   ✅ Success\n`);
        } catch (error: any) {
          const errorMsg = error.message;
          
          // Check for errors we can safely ignore
          if (errorMsg.includes('already exists') || 
              errorMsg.includes('duplicate key') ||
              errorMsg.includes('duplicate object') ||
              errorMsg.includes('cannot drop') && errorMsg.includes('does not exist')) {
            skipCount++;
            console.log(`   ⚠️ Skipped (${errorMsg.split('\n')[0]})\n`);
          } else if (errorMsg.includes('relation "users" does not exist')) {
            // Skip sample data if users table doesn't exist yet
            skipCount++;
            console.log(`   ⚠️ Skipped (users table not found)\n`);
          } else {
            errorCount++;
            console.error(`   ❌ Error: ${errorMsg.split('\n')[0]}\n`);
            
            // For critical errors, we might want to stop
            if (statement.toUpperCase().includes('CREATE TABLE')) {
              console.error('   💡 Critical table creation failed. Stopping migration.');
              throw error;
            }
          }
        }
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n══════════════════════════════════════════');
    console.log('📊 MIGRATION SUMMARY');
    console.log('══════════════════════════════════════════');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⚠️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total: ${statements.length}`);
    console.log('───────────────────────────────────────────');
    
    if (errorCount === 0) {
      console.log('🎉 Migration completed successfully!');
    } else if (errorCount < 5) {
      console.log('⚠️  Migration completed with minor errors.');
    } else {
      console.log('❌ Migration completed with significant errors.');
    }
    
    // Verify the migration
    console.log('\n🔍 VERIFICATION');
    console.log('───────────────────────────────────────────');
    
    try {
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('notifications', 'notification_preferences')
        ORDER BY table_name
      `);
      
      console.log('📋 Created tables:');
      if (tablesResult.rows.length > 0) {
        tablesResult.rows.forEach(row => {
          console.log(`   ✅ ${row.table_name}`);
        });
      } else {
        console.log('   ❌ No tables created');
      }
      
      // Count notifications if any were inserted
      const countResult = await client.query('SELECT COUNT(*) FROM notifications');
      console.log(`   📊 Sample notifications: ${countResult.rows[0].count}`);
      
    } catch (verifyError: any) {
      console.log('   ⚠️ Verification failed:', verifyError.message);
    }
    
  } catch (error: any) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.log('\n💡 TROUBLESHOOTING:');
    console.log('1. Check if the users table exists');
    console.log('2. Verify database permissions');
    console.log('3. Try running the migration in parts');
    console.log('4. Check PostgreSQL logs for detailed errors');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Alternative: Run migration in parts
async function runMigrationInParts() {
  console.log('🔧 Running migration in safe mode...\n');
  
  const client = await pool.connect();
  
  try {
    // Part 1: Create tables only
    console.log('📦 PART 1: Creating tables...');
    const tablesSQL = `
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'info',
        priority VARCHAR(20) NOT NULL DEFAULT 'medium',
        read BOOLEAN NOT NULL DEFAULT FALSE,
        metadata JSONB,
        expires_at TIMESTAMP WITH TIME ZONE,
        action_url VARCHAR(500),
        action_label VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
      );
      
      CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id UUID PRIMARY KEY,
        email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        desktop_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        mute_until TIMESTAMP WITH TIME ZONE,
        excluded_types VARCHAR(20)[] DEFAULT '{}',
        digest_frequency VARCHAR(20) NOT NULL DEFAULT 'realtime',
        role_specific_filters JSONB DEFAULT '{}'
      );
    `;
    
    await client.query(tablesSQL);
    console.log('✅ Tables created successfully\n');
    
    // Part 2: Create indexes
    console.log('📦 PART 2: Creating indexes...');
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE NOT read",
      "CREATE INDEX IF NOT EXISTS idx_notifications_metadata_role ON notifications ((metadata->>'role'))",
      "CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)",
      "CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority)"
    ];
    
    for (const indexSQL of indexes) {
      try {
        await client.query(indexSQL);
        console.log(`   ✅ ${indexSQL.substring(0, 60)}...`);
      } catch (error: any) {
        console.log(`   ⚠️ ${error.message.split('\n')[0]}`);
      }
    }
    
    console.log('\n🎉 Basic migration completed!');
    console.log('You can add advanced functions and views later.');
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// Check environment variables
function checkEnv() {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('\n📝 Add to .env.local:');
    console.error(`
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
    `);
    return false;
  }
  
  return true;
}

// Main function
async function main() {
  if (!checkEnv()) {
    process.exit(1);
  }
  
  // Ask user which method to use
  console.log('🔧 NOTIFICATION SYSTEM MIGRATION');
  console.log('================================\n');
  console.log('Select migration method:');
  console.log('1. Complete migration (tables, indexes, functions, views, sample data)');
  console.log('2. Safe migration (tables and basic indexes only)');
  console.log('3. Skip migration\n');
  
  // For now, we'll use the complete migration
  // In a real app, you'd use readline to get user input
  
  const method = 1; // Default to complete migration
  
  if (method === 1) {
    await runMigration();
  } else if (method === 2) {
    await runMigrationInParts();
  } else {
    console.log('Migration skipped.');
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});