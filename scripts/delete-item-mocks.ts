import prisma from '../lib/prisma'

async function main() {
  const result1 = await prisma.storefrontProduct.deleteMany({
    where: {
      name: {
        contains: 'Item 1'
      }
    }
  });
  console.log(`🧹 Deleted ${result1.count} products containing 'Item 1'.`);
  
  const result2 = await prisma.storefrontProduct.deleteMany({
    where: {
      name: {
        contains: 'Item 2'
      }
    }
  });
  console.log(`🧹 Deleted ${result2.count} products containing 'Item 2'.`);
  
  // also delete unsplash if they exist
  const result3 = await prisma.storefrontProduct.deleteMany({
    where: {
      image_url: {
        contains: 'source.unsplash.com'
      }
    }
  });
  console.log(`🧹 Deleted ${result3.count} products containing 'source.unsplash.com'.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
