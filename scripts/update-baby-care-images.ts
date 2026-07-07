import prisma from '../lib/prisma'

async function updateBabyCareImages() {
  const babyCareCategories = ["Baby Food", "Formula Milk", "Diapers", "Baby Wipes", "Baby Skincare", "Baby Bath", "Feeding Accessories"]
  
  const categories = await prisma.storefrontCategory.findMany({
    where: { name: { in: babyCareCategories } }
  })
  
  if (!categories || categories.length === 0) {
    console.log('No baby categories found')
    return
  }
  
  const images = [
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&h=500&fit=crop', // baby products
    'https://images.unsplash.com/photo-1555252117-426eb85b1378?w=500&h=500&fit=crop', // baby toys/care
    'https://images.unsplash.com/photo-1522771930-78848d9287ec?w=500&h=500&fit=crop', // baby clothes/crib
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop' // baby items
  ]

  let totalUpdated = 0;

  for (const category of categories) {
    console.log(`Processing category: ${category.slug}`)
    const products = await prisma.storefrontProduct.findMany({
      where: { category_id: category.id }
    })

    for (let i = 0; i < products.length; i++) {
      const img = images[i % images.length]
      await prisma.storefrontProduct.update({
        where: { id: products[i].id },
        data: {
          image_url: img,
          images: [img]
        }
      })
      totalUpdated++;
    }
  }
  
  console.log(`Updated ${totalUpdated} products with baby care images.`)
}

updateBabyCareImages().catch(console.error).finally(() => prisma.$disconnect())
