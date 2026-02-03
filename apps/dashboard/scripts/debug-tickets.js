
const { PrismaClient } = require('../lib/generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🔍 Starting Debug Script (JS)...');

    try {
        // 1. Fetch a user to simulate session
        const user = await prisma.user.findFirst({
            include: { organization: true }
        });

        if (!user) {
            console.error('❌ No users found in database.');
            return;
        }

        console.log(`✅ Using User: ${user.email} (${user.role})`);

        // 2. Simulate the API Query
        console.log('🔄 Attempting to fetch tickets with relation...');

        const where = {};
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'SUPERADMIN') {
            where.user_id = user.id;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        organization: {
                            select: {
                                name: true,
                                plan: true
                            }
                        }
                    }
                },
                _count: {
                    select: { replies: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        console.log(`✅ Query Successful! Found ${tickets.length} tickets.`);
        if (tickets.length > 0) {
            console.log('Sample ticket:', JSON.stringify(tickets[0], null, 2));
        }

    } catch (error) {
        console.error('❌ Query Failed!');
        console.error('Error Message:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
