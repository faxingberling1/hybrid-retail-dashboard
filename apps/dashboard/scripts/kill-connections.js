const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/postgres?sslmode=disable'
});

async function clearConnections() {
    try {
        await client.connect();
        console.log('Connected to default DB.');

        console.log('Terminating connections to dashboard_db...');
        const res = await client.query(`
            SELECT pg_terminate_backend(pid) 
            FROM pg_stat_activity 
            WHERE datname = 'dashboard_db' 
            AND pid <> pg_backend_pid()
        `);

        console.log(`Terminated ${res.rows.length} connections.`);
        await client.end();
    } catch (e) {
        console.error('Error:', e);
    }
}

clearConnections();
