
const { db } = require('../lib/db.ts');
const fs = require('fs');

async function checkOrgColumns() {
    try {
        const res = await db.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'organizations'");
        fs.writeFileSync('org-cols-output.txt', JSON.stringify(res.rows, null, 2));
    } catch (e) {
        fs.writeFileSync('org-cols-output.txt', 'ERROR:' + e.message);
    } finally {
        process.exit();
    }
}

checkOrgColumns();
