import { PrismaClient } from '../lib/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const products = await (prisma as any).product.findMany({
        include: { category: true }
    });

    console.log('📦 Fetched products count:', products.length);

    try {
        const json = JSON.stringify(products);
        console.log('✅ Serialization successful');
        // console.log('JSON:', json.substring(0, 500));
    } catch (e: any) {
        console.error('❌ Serialization failed:', e.message);
    }
}

main().finally(async () => {
    await prisma.$disconnect()
    await pool.end()
})
