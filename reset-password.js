
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function resetPassword() {
    const email = 'superadmin@hybridpos.pk';
    const password = 'demo123';
    const hash = await bcrypt.hash(password, 10);

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log(`🚀 Manually resetting password for ${email}...`);
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, password_hash',
            [hash, email]
        );

        if (result.rowCount > 0) {
            console.log('✅ Update successful!');
            console.log('New Row Data:', JSON.stringify(result.rows[0], null, 2));
            const match = await bcrypt.compare(password, result.rows[0].password_hash);
            console.log(`Verification: Does 'demo123' match new hash? ${match ? '✅ YES' : '❌ NO'}`);
        } else {
            console.log('❌ User not found, no rows updated.');
        }
    } catch (error) {
        console.error('❌ Update failed:', error.message);
    } finally {
        await pool.end();
    }
}

resetPassword();
