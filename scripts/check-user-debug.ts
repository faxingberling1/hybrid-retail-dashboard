import dotenv from 'dotenv'
import { Client } from 'pg'

dotenv.config({ path: '.env.local' })
dotenv.config()

async function checkUser() {
    const connectionString = process.env.DATABASE_URL
    const client = new Client({ connectionString })

    try {
        await client.connect()
        const res = await client.query('SELECT email, password_hash, is_active FROM users WHERE email = $1', ['superadmin@hybridpos.pk'])
        console.log('User Data:', JSON.stringify(res.rows[0], null, 2))
    } catch (err) {
        console.error('Error:', err)
    } finally {
        await client.end()
    }
}

checkUser()
