import prisma from '../lib/prisma'

const REAL_PRODUCTS_DATA = [
  {
    categorySlug: "bread-bakery",
    products: [
      {
        name: "Dawn Milky Bread (Large)",
        price: 250,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=2070&auto=format&fit=crop",
        description: "Soft and fresh Milky Bread by Dawn. Perfect for breakfast sandwiches.",
        stock: 50
      },
      {
        name: "Dawn Bran Bread (Large)",
        price: 280,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop",
        description: "Healthy bran bread, rich in fiber for a nutritious start to your day.",
        stock: 30
      }
    ]
  },
  {
    categorySlug: "milk-dairy-eggs",
    products: [
      {
        name: "Nestle MilkPak (1 Litre)",
        price: 320,
        compare_at_price: 350,
        image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1965&auto=format&fit=crop",
        description: "Pure and healthy UHT milk from Nestle. Essential for tea and cereals.",
        stock: 200
      },
      {
        name: "Olper's Full Cream Milk (1 Litre)",
        price: 330,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1887&auto=format&fit=crop",
        description: "Rich, creamy milk perfect for making tea and everyday consumption.",
        stock: 150
      }
    ]
  },
  {
    categorySlug: "sauces-condiments-pantry-staples",
    products: [
      {
        name: "National Tomato Ketchup (800g)",
        price: 450,
        compare_at_price: 520,
        image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1920&auto=format&fit=crop",
        description: "Classic tomato ketchup made from the freshest red tomatoes.",
        stock: 120
      },
      {
        name: "National Chilli Garlic Sauce (800g)",
        price: 480,
        compare_at_price: 550,
        image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1965&auto=format&fit=crop",
        description: "Spicy and tangy chili garlic sauce, the perfect dip for snacks.",
        stock: 90
      }
    ]
  },
  {
    categorySlug: "tea-coffee",
    products: [
      {
        name: "Lipton Yellow Label Tea (900g)",
        price: 1850,
        compare_at_price: 1950,
        image_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2070&auto=format&fit=crop",
        description: "Rich taste and aroma. Lipton Yellow Label black tea.",
        stock: 60
      },
      {
        name: "Tapal Danedar Tea (900g)",
        price: 1900,
        compare_at_price: 2050,
        image_url: "https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=1964&auto=format&fit=crop",
        description: "The nation's favorite Danedar tea blend, renowned for its strong flavor.",
        stock: 80
      },
      {
        name: "Nescafe Classic Coffee (100g)",
        price: 1450,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1964&auto=format&fit=crop",
        description: "Instant coffee with a rich aroma and smooth taste.",
        stock: 45
      }
    ]
  },
  {
    categorySlug: "cooking-oil-ghee-pantry-staples",
    products: [
      {
        name: "Dalda Cooking Oil (5 Litre Tin)",
        price: 2850,
        compare_at_price: 3000,
        image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1918&auto=format&fit=crop",
        description: "Premium quality cooking oil packed with Vitamin A and D.",
        stock: 40
      }
    ]
  },
  {
    categorySlug: "chips-snacks",
    products: [
      {
        name: "Lays Salted Potato Chips (Large)",
        price: 120,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=2070&auto=format&fit=crop",
        description: "Classic salted potato chips, perfectly crispy.",
        stock: 300
      },
      {
        name: "Lays French Cheese (Large)",
        price: 120,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=1974&auto=format&fit=crop",
        description: "French cheese flavored potato chips.",
        stock: 250
      },
      {
        name: "Kurkure Chutney Chaska (Large)",
        price: 120,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop",
        description: "Spicy and tangy corn puff snacks.",
        stock: 200
      }
    ]
  },
  {
    categorySlug: "juices-beverages",
    products: [
      {
        name: "Coca-Cola (1.5 Litre)",
        price: 180,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop",
        description: "Refreshing Coca-Cola beverage in family size.",
        stock: 150
      },
      {
        name: "Sprite (1.5 Litre)",
        price: 180,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop",
        description: "Lemon-lime flavored refreshing soda.",
        stock: 140
      },
      {
        name: "Nestle Fruita Vitals Chaunsa (1 Litre)",
        price: 350,
        compare_at_price: 400,
        image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop",
        description: "Rich mango nectar made from the best Chaunsa mangoes.",
        stock: 80
      }
    ]
  },
  {
    categorySlug: "rice-flour",
    products: [
      {
        name: "Guard Basmati Rice (5 Kg)",
        price: 1950,
        compare_at_price: 2100,
        image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop",
        description: "Extra long grain basmati rice, aged to perfection.",
        stock: 50
      },
      {
        name: "Sunridge Chakki Atta (10 Kg)",
        price: 1650,
        compare_at_price: 1800,
        image_url: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?q=80&w=1974&auto=format&fit=crop",
        description: "100% whole wheat chakki atta for soft and fluffy rotis.",
        stock: 80
      }
    ]
  },
  {
    categorySlug: "fruits-fresh-produce",
    products: [
      {
        name: "Fresh Bananas (1 Dozen)",
        price: 250,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2000&auto=format&fit=crop",
        description: "Fresh, premium quality export-grade bananas.",
        stock: 100
      },
      {
        name: "Apples (Fuji) 1 Kg",
        price: 450,
        compare_at_price: 500,
        image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1974&auto=format&fit=crop",
        description: "Crisp and sweet Fuji apples.",
        stock: 60
      }
    ]
  },
  {
    categorySlug: "vegetables-fresh-produce",
    products: [
      {
        name: "Onions (1 Kg)",
        price: 150,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1974&auto=format&fit=crop",
        description: "Freshly harvested red onions.",
        stock: 200
      },
      {
        name: "Potatoes (1 Kg)",
        price: 120,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop",
        description: "Fresh potatoes, ideal for cooking and frying.",
        stock: 300
      }
    ]
  }
]

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('🌱 Starting Realistic Groceries seeding...')

  // Clean up mock products created by seed-products.ts
  const deletedMocks = await prisma.storefrontProduct.deleteMany({
    where: {
      name: {
        contains: 'Premium'
      }
    }
  })
  console.log(`🧹 Deleted ${deletedMocks.count} mock products.`)
  
  const deletedMocks2 = await prisma.storefrontProduct.deleteMany({
    where: {
      name: {
        contains: 'Item'
      }
    }
  })
  console.log(`🧹 Deleted ${deletedMocks2.count} more mock products.`)

  let totalProductsAdded = 0;

  for (const group of REAL_PRODUCTS_DATA) {
    const category = await prisma.storefrontCategory.findFirst({
      where: { slug: group.categorySlug }
    })

    if (!category) {
      console.warn(`⚠️ Category not found for slug: ${group.categorySlug}. Skipping its products.`)
      continue
    }

    console.log(`Found category: ${category.name} (${group.categorySlug})`)

    for (const prodData of group.products) {
      const slug = generateSlug(`${prodData.name}-${Math.floor(Math.random() * 1000)}`)

      try {
        await prisma.storefrontProduct.create({
          data: {
            name: prodData.name,
            slug: slug,
            description: prodData.description,
            price: prodData.price,
            compare_at_price: prodData.compare_at_price,
            image_url: prodData.image_url,
            images: [prodData.image_url],
            stock: prodData.stock,
            is_active: true,
            category_id: category.id
          }
        })
        console.log(`Inserted realistic product: ${prodData.name}`)
        totalProductsAdded++;
      } catch (error) {
        console.error(`Failed to create product ${prodData.name}:`, error)
      }
    }
  }

  console.log(`✅ Realistic Groceries Seeding completed! Added ${totalProductsAdded} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
