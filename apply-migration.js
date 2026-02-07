
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function applyMigration() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('❌ DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    console.log('📡 Connecting to Neon...');
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const sqlPath = path.join(__dirname, 'neon-setup.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Applying migration script...');
        // Split by semicolons for safer execution, though pg can handle blocks
        // However, some blocks (like DO $$) shouldn't be split blindly.
        // We'll try executing the whole block first.
        await pool.query(sql);
        console.log('✅ Migration applied successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

applyMigration();
