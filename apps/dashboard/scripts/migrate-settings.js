
const { db } = require('../lib/db.ts');

async function migrate() {
    console.log('🚀 Starting migration: Adding settings column to organizations...');
    try {
        await db.query(`
            ALTER TABLE organizations 
            ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'
        `);
        console.log('✅ Migration successful: settings column added.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit(0);
    }
}

migrate();
