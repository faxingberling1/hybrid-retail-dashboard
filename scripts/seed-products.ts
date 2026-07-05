import prisma from '../lib/prisma'

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('🌱 Starting product seeding...')

  const categories = await prisma.storefrontCategory.findMany()

  if (categories.length === 0) {
    console.error('❌ No categories found. Run seed-categories.ts first.')
    process.exit(1)
  }

  let totalProductsAdded = 0;

  for (const category of categories) {
    // Determine a base price range depending on category type roughly
    let minPrice = 100;
    let maxPrice = 1500;

    for (let i = 1; i <= 4; i++) {
      const productName = `Premium ${category.name.replace(/[^a-zA-Z ]/g, '').trim()} Item ${i}`
      const slug = generateSlug(`${category.name}-item-${i}-${Math.floor(Math.random() * 10000)}`)
      
      const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
      const comparePrice = Math.random() > 0.5 ? price + Math.floor(Math.random() * 500) : null;
      
      // We use a generic Unsplash placeholder
      const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(category.name.replace(/[^a-zA-Z ]/g, '').trim())},food`

      try {
        await prisma.storefrontProduct.create({
          data: {
            name: productName,
            slug: slug,
            description: `This is a high quality ${category.name} product for all your daily needs.`,
            price: price,
            compare_at_price: comparePrice,
            image_url: imageUrl,
            images: [imageUrl],
            stock: Math.floor(Math.random() * 100) + 10,
            is_active: true,
            category_id: category.id
          }
        })
        totalProductsAdded++;
      } catch (error) {
        console.error(`Failed to create product ${productName}:`, error);
      }
    }
  }

  console.log(`✅ Seeding completed! Added ${totalProductsAdded} mock products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
