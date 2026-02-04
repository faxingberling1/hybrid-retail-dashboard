
const { db } = require('../lib/db.ts');

async function listTables() {
    try {
        const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('TABLES:' + JSON.stringify(res.rows.map(r => r.table_name)));
    } catch (e) {
        console.error('ERROR:' + e.message);
    } finally {
        process.exit();
    }
}

listTables();
