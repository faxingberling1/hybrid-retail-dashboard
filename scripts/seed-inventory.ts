import { PrismaClient } from '../lib/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seeding database...')

    // Create Categories
    const electronics = await prisma.category.create({
        data: { name: 'Electronics' }
    })
    const groceries = await prisma.category.create({
        data: { name: 'Groceries' }
    })

    console.log('✅ Created categories:', [electronics.name, groceries.name])

    // Create Products
    const p1 = await prisma.product.create({
        data: {
            name: 'Smartphone Pro Max',
            sku: 'ELEC-001',
            price: 999.99,
            cost: 800.00,
            stock: 50,
            category_id: electronics.id,
            description: 'Latest flagship smartphone'
        }
    })

    const p2 = await prisma.product.create({
        data: {
            name: 'Organic Milk 1L',
            sku: 'GROC-001',
            price: 2.50,
            cost: 1.80,
            stock: 200,
            category_id: groceries.id,
            description: 'Fresh organic milk'
        }
    })

    const p3 = await prisma.product.create({
        data: {
            name: 'Wireless Headphones',
            sku: 'ELEC-002',
            price: 150.00,
            cost: 100.00,
            stock: 10, // Low stock
            category_id: electronics.id,
            description: 'Noise cancelling headphones'
        }
    })

    console.log('✅ Created 3 products')
    console.log('🚀 Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
