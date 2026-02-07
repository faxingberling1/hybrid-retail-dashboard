
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixSchema() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🚀 Adding missing column...');
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP(6);');
        console.log('✅ Column added successfully!');
    } catch (error) {
        console.error('❌ Failed to add column:', error.message);
    } finally {
        await pool.end();
    }
}

fixSchema();
