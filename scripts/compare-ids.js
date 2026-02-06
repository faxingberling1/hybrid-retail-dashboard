const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

async function run() {
    await client.connect();

    console.log('--- Current Users ---');
    const users = await client.query("SELECT id, email, role FROM users");
    console.log(JSON.stringify(users.rows, null, 2));

    console.log('--- Notification User IDs ---');
    const notifs = await client.query("SELECT DISTINCT user_id FROM notifications");
    console.log(JSON.stringify(notifs.rows, null, 2));

    await client.end();
}

run();
