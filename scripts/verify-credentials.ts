import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function verify() {
    const conn = process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require';
    const pool = new Pool({ connectionString: conn });

    try {
        const r = await pool.query("SELECT password_hash FROM users WHERE email = 'superadmin@hybridpos.pk'");
        if (r.rows.length === 0) {
            console.log('❌ User not found');
            return;
        }

        const hash = r.rows[0].password_hash;
        const match = await bcrypt.compare('Admin@123', hash);
        console.log('✅ Admin@123 match:', match);

        if (!match) {
            console.log('❌ Hash does not match Admin@123');
            console.log('Current Hash:', hash);
        }
    } catch (err) {
        console.error('❌ Error during verification:', err);
    } finally {
        await pool.end();
    }
}

verify();
