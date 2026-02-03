const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

async function checkSchema() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE (table_name = 'notifications' AND column_name = 'user_id')
               OR (table_name = 'users' AND column_name = 'id')
        `);
        console.log(JSON.stringify(res.rows, null, 2));

        await client.end();
    } catch (e) {
        console.error(e);
    }
}

checkSchema();
