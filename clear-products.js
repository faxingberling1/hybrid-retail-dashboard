const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.storefrontProduct.deleteMany({});
  console.log('Deleted all storefront products');
}
main().catch(console.error).finally(() => prisma.$disconnect());
