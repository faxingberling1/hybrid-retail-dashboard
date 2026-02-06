
const { db } = require('../lib/db.ts');
const fs = require('fs');

async function checkInviteSchema() {
    let output = '';
    try {
        const res = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user_invitations'");
        output += 'INVITE_COLUMNS:' + JSON.stringify(res.rows) + '\n';

        const res2 = await db.query(`
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.table_name = 'user_invitations';
        `);
        output += 'INVITE_CONSTRAINTS:' + JSON.stringify(res2.rows) + '\n';
    } catch (e) {
        output += 'ERROR:' + e.message + '\n';
    } finally {
        fs.writeFileSync('invite-schema-output.txt', output);
        process.exit();
    }
}

checkInviteSchema();
