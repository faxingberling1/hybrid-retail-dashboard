import prisma from '../lib/prisma'

async function main() {
  const result = await prisma.storefrontProduct.deleteMany({
    where: {
      image_url: {
        contains: 'source.unsplash.com'
      }
    }
  });
  console.log(`🧹 Deleted ${result.count} products with broken source.unsplash.com links.`);
  
  const result2 = await prisma.storefrontProduct.deleteMany({
    where: {
      name: {
        contains: 'Premium'
      }
    }
  });
  console.log(`🧹 Deleted ${result2.count} more mock products containing 'Premium'.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
