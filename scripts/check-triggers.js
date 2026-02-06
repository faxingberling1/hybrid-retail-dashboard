
const { db } = require('../lib/db.ts');
const fs = require('fs');

async function checkTriggers() {
    try {
        const sql = `
            SELECT 
                tgname AS trigger_name,
                relname AS table_name
            FROM 
                pg_trigger
                JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE 
                tgisinternal = false;
        `;
        const res = await db.query(sql);
        fs.writeFileSync('triggers.txt', JSON.stringify(res.rows, null, 2));
    } catch (e) {
        fs.writeFileSync('triggers.txt', 'ERROR:' + e.message);
    } finally {
        process.exit();
    }
}

checkTriggers();
