import bcrypt from 'bcryptjs'

async function testPassword() {
    const password = 'demo123'
    // Hash from the previous debug run
    const hash = '$2a$10$WkUeFvDcwlV0pFlivfJuB.J/sX3Sj.0T3E/GzK7Z7H.F2E0eE0' // Truncated in output, need full one or re-run

    // Actually, let's just query it and compare in one script
    const dotenv = require('dotenv')
    const { Client } = require('pg')
    dotenv.config({ path: '.env.local' })
    dotenv.config()

    const client = new Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()
    const res = await client.query('SELECT password_hash FROM users WHERE email = $1', ['superadmin@hybridpos.pk'])
    const dbHash = res.rows[0].password_hash
    await client.end()

    console.log('Password:', password)
    console.log('Hash in DB:', dbHash)

    const isValid = await bcrypt.compare(password, dbHash)
    console.log('Is valid:', isValid)
}

testPassword()
