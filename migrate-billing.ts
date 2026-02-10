import { db } from './lib/db';

async function migrate() {
    console.log('🚀 Starting billing migration...');
    try {
        await db.query(`
            ALTER TABLE invoices 
            ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS shared_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS notes TEXT;
        `);
        console.log('✅ Invoices table updated successfully!');

        // Add sample data if needed or just finish
        console.log('🏁 Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
