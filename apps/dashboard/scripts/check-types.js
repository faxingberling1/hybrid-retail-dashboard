const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

async function run() {
    await client.connect();
    const res = await client.query(`
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name IN ('users', 'notifications') 
        AND column_name IN ('id', 'user_id')
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
}

run();
