import { PrismaClient } from './lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
        console.log('Tables in public schema:', JSON.stringify(tables, null, 2));
    } catch (error) {
        console.error('Error querying tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
