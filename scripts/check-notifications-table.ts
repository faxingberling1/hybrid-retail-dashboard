import { db } from '../lib/db';

async function main() {
    try {
        const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'notifications'
    `);

        if (result.rows.length === 0) {
            console.error('❌ Table "notifications" DOES NOT exist!');
            process.exit(1);
        }

        console.log('✅ Table "notifications" exists.');

        const columns = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
    `);

        console.log('📋 Columns:');
        columns.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type}`);
        });

    } catch (error) {
        console.error('❌ Error checking database:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
