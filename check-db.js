const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.storefront_categories.findMany();
  console.log('Categories:', categories.map(c => c.name));
  
  const products = await prisma.storefront_products.findMany({ take: 5 });
  console.log('Products:', products.map(p => p.name));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
