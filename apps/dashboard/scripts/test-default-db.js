const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/postgres?sslmode=disable'
});

console.log('Testing connection to default DB: postgresql://postgres:AlexMurphy@localhost:5432/postgres?sslmode=disable');

client.connect()
    .then(() => {
        console.log('✅ Connected successfully to postgres database');
        return client.query('SELECT 1 FROM pg_database WHERE datname = \'dashboard_db\'');
    })
    .then(res => {
        if (res.rows.length > 0) {
            console.log('ℹ️  dashboard_db exists');
        } else {
            console.log('ℹ️  dashboard_db DOES NOT exist');
        }
        return client.end();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
