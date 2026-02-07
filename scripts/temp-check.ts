import { pool } from '../lib/db';
import dotenv from 'dotenv';
import path from 'path';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

async function check() {
    try {
        const r = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'system_settings'");
        console.log(JSON.stringify(r.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
check();
