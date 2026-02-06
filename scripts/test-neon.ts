import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function testNeon() {
    const connectionString = process.env.DATABASE_URL;
    console.log('Testing connection to:', connectionString ? connectionString.replace(/:([^:@]+)@/, ':****@') : 'undefined');

    if (!connectionString) {
        console.error('DATABASE_URL is not defined in .env');
        return;
    }

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Successfully connected to Neon!');
        const res = await client.query('SELECT current_database(), current_user, version()');
        console.log('Database Info:', res.rows[0]);
        client.release();
    } catch (err: any) {
        console.error('❌ Connection failed:');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        if (err.detail) console.error('Error Detail:', err.detail);
        if (err.hint) console.error('Error Hint:', err.hint);
    } finally {
        await pool.end();
    }
}

testNeon();
