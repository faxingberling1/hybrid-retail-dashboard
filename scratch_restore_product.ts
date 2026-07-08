import prisma from './lib/prisma';

async function fix() {
  const missingProductId = '02b14e07-bb1f-4c60-98c6-8198ca18be8d';
  const name = "K&N's Chapli Kabab 10pcs";
  
  // Find a category id
  const category = await prisma.storefrontCategory.findFirst();
  
  await prisma.storefrontProduct.create({
    data: {
      id: missingProductId,
      name: name,
      slug: "kns-chapli-kabab-10pcs",
      description: "Delicious chapli kababs",
      price: 1050,
      image_url: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80", // Meat / Food placeholder
      category_id: category!.id,
      stock: 100,
    }
  });
  console.log("Restored missing product!");
}

fix().catch(console.error).finally(() => process.exit(0));
