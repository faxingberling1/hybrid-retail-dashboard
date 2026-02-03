// Set up environment before importing prisma
process.env.DATABASE_URL = 'postgresql://postgres:AlexMurphy@localhost:5432/dashboard_db?sslmode=disable';

import prisma from '../lib/prisma'

async function main() {
    console.log('🔍 Testing shared Prisma instance...');

    try {
        // We use 'as any' because the test environment might have type issues with the generated client
        const products = await (prisma as any).product.findMany({
            include: { category: true }
        });

        console.log('📦 Products count:', products.length);
        if (products.length > 0) {
            console.log('✅ Success: Products retrieved');
            products.forEach((p: any) => {
                console.log(`   - ${p.name} (Stock: ${p.stock}, Price: ${p.price})`);
            });
        } else {
            console.log('⚠️ Warning: No products found');
        }

        const categories = await (prisma as any).category.findMany();
        console.log('📂 Categories count:', categories.length);

    } catch (error: any) {
        console.error('❌ Prisma Error:', error.message);
        if (error.code) console.error('   Code:', error.code);
        if (error.meta) console.error('   Meta:', error.meta);
    }
}

main().finally(async () => {
    await (prisma as any).$disconnect();
});
