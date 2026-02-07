import { pool } from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

async function checkSchema() {
    console.log('--- Checking Table Schemas ---');
    try {
        const tables = ['users', 'tickets', 'ticket_replies'];
        for (const table of tables) {
            console.log(`\nSchema for table: ${table}`);
            const result = await pool.query(`
                SELECT column_name, data_type, udt_name, is_nullable
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position;
            `, [table]);

            if (result.rows.length === 0) {
                console.log('Table not found or no columns.');
                continue;
            }

            result.rows.forEach(row => {
                console.log(`- ${row.column_name}: ${row.data_type} (${row.udt_name}), Nullable: ${row.is_nullable}`);
            });
        }
    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await pool.end();
    }
}

checkSchema().catch(console.error);
