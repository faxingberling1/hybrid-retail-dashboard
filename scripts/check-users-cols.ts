import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { Client } from 'pg'

async function checkColumns() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })

    try {
        await client.connect()
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `)
        console.log('Columns in users table:')
        res.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`))
    } catch (err) {
        console.error(err)
    } finally {
        await client.end()
    }
}

checkColumns()
