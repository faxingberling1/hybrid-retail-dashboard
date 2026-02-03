import { PrismaClient } from '../lib/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

function log(msg: string) {
    const formatted = `[${new Date().toISOString()}] ${msg}`
    console.log(formatted)
    fs.appendFileSync('prisma_test_log.txt', formatted + '\n')
}

async function main() {
    if (fs.existsSync('prisma_test_log.txt')) fs.unlinkSync('prisma_test_log.txt')

    log('Environment DATABASE_URL: ' + (process.env.DATABASE_URL ? 'PRESENT' : 'MISSING'))

    log('Intantiating PG Pool...')
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    })

    log('Instantiating PrismaClient with adapter...')
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
        log('Attempting to connect...')
        await prisma.$connect()
        log('Successfully connected to database.')

        // Check if models exist in the client
        log('Checking Ticket model...')
        // @ts-ignore
        log('Ticket model in prisma: ' + !!prisma.ticket)

        // @ts-ignore
        const count = await prisma.ticket.count()
        log('Tickets count: ' + count)
    } catch (error: any) {
        log('Prisma test failed: ' + error.message)
        log('Stack: ' + error.stack)
    } finally {
        await prisma.$disconnect()
    }
}

main().catch(err => {
    log('CRITICAL ERROR: ' + err.message)
})
