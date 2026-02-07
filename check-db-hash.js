
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkHash() {
    const password = 'demo123';
    const salt = 10;
    const newHash = await bcrypt.hash(password, salt);
    console.log(`Expected hash prefix for 'demo123': ${newHash.substring(0, 10)}`);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const result = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = $1', ['superadmin@hybridpos.pk']);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('Full User Data from DB:', JSON.stringify(user, null, 2));
            const match = await bcrypt.compare(password, user.password_hash);
            console.log(`Does 'demo123' match DB hash? ${match ? '✅ YES' : '❌ NO'}`);
        } else {
            console.log('❌ User not found in DB');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

checkHash();
