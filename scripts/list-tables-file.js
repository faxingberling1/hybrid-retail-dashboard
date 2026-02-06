
const { db } = require('../lib/db.ts');
const fs = require('fs');

async function listTables() {
    try {
        const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        fs.writeFileSync('tables-output.txt', 'TABLES:' + JSON.stringify(res.rows.map(r => r.table_name)));
    } catch (e) {
        fs.writeFileSync('tables-output.txt', 'ERROR:' + e.message);
    } finally {
        process.exit();
    }
}

listTables();
