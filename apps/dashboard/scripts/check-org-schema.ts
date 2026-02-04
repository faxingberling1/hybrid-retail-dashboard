import { db } from '../lib/db';

async function checkSchema() {
    try {
        const res: any = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'organizations'");
        console.log('Columns in organizations table:');
        console.log(res.rows.map((r: any) => r.column_name).join(', '));

        const sample = await db.query("SELECT * FROM organizations LIMIT 1");
        if (sample.rows.length > 0) {
            console.log('Sample row:');
            console.log(JSON.stringify(sample.rows[0], null, 2));
        } else {
            console.log('No rows in organizations table.');
        }
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
