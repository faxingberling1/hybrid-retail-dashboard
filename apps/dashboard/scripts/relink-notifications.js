const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

async function run() {
    await client.connect();

    // Get new superadmin ID
    const userRes = await client.query("SELECT id FROM users WHERE email = 'superadmin@hybridpos.pk'");
    if (userRes.rows.length === 0) {
        console.error('Superadmin user not found!');
        await client.end();
        return;
    }
    const superAdminId = userRes.rows[0].id;
    console.log('New SuperAdmin ID:', superAdminId);

    // Update notifications
    const res = await client.query("UPDATE notifications SET user_id = $1", [superAdminId]);
    console.log(`Updated ${res.rowCount} notifications to point to new SuperAdmin.`);

    await client.end();
}

run();
