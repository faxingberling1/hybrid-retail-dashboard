const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
});

console.log('Testing connection to: postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable');

client.connect()
    .then(() => {
        console.log('✅ Connected successfully');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Query result:', res.rows[0]);
        return client.end();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });
