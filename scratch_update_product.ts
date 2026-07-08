import prisma from './lib/prisma';

async function fix() {
  const missingProductId = '02b14e07-bb1f-4c60-98c6-8198ca18be8d';
  
  await prisma.storefrontProduct.update({
    where: { id: missingProductId },
    data: {
      image_url: "/chapli_kabab.png",
    }
  });
  console.log("Updated product image url!");
}

fix().catch(console.error).finally(() => process.exit(0));
