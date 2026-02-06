// scripts/test-pool-shared.ts
async function main() {
    process.env.DATABASE_URL = 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable';
    console.log('🌍 Env set in script:', process.env.DATABASE_URL ? 'YES' : 'NO');

    const { pool } = await import('../lib/db');

    console.log('🔍 Testing shared PG pool...');
    try {
        const res = await pool.query('SELECT current_database(), current_user');
        console.log('✅ Success:', res.rows[0]);
    } catch (err: any) {
        console.error('❌ PG Pool Error:', err.message);
    } finally {
        await pool.end();
    }
}

main();
