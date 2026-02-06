const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

async function run() {
    await client.connect();
    const res = await client.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('users', 'notifications') ORDER BY table_name, column_name");
    res.rows.forEach(r => console.log(`${r.table_name}.${r.column_name}: ${r.data_type}`));
    await client.end();
}

run();
