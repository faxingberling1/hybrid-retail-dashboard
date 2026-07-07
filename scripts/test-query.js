const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.storefront_products.count();
  console.log('Total products:', count);
  const products = await prisma.storefront_products.findMany({
    take: 5
  });
  console.log(products);
}

main().catch(console.error).finally(() => prisma.$disconnect());
