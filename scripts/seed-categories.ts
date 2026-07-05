import prisma from '../lib/prisma'
import { v4 as uuidv4 } from 'uuid'

const CATEGORY_DATA = [
  {
    name: "Fresh Produce",
    emoji: "🥬",
    subcategories: ["Fruits", "Vegetables", "Herbs"]
  },
  {
    name: "Meat & Seafood",
    emoji: "🥩",
    subcategories: ["Chicken", "Beef", "Mutton", "Fish", "Seafood"]
  },
  {
    name: "Dairy & Eggs",
    emoji: "🥛",
    subcategories: ["Milk", "Cheese", "Butter", "Yogurt", "Eggs"]
  },
  {
    name: "Bakery",
    emoji: "🍞",
    subcategories: ["Bread", "Cakes", "Cookies", "Pastries"]
  },
  {
    name: "Breakfast & Cereals",
    emoji: "🥣",
    subcategories: []
  },
  {
    name: "Rice, Flour & Pulses",
    emoji: "🍚",
    subcategories: []
  },
  {
    name: "Pantry Essentials",
    emoji: "🛒",
    subcategories: ["Cooking Oil", "Spices", "Salt", "Sugar", "Sauces", "Pasta", "Noodles"]
  },
  {
    name: "Canned & Packaged Foods",
    emoji: "🥫",
    subcategories: []
  },
  {
    name: "Beverages",
    emoji: "🥤",
    subcategories: ["Soft Drinks", "Juices", "Water", "Tea", "Coffee", "Energy Drinks"]
  },
  {
    name: "Snacks",
    emoji: "🍿",
    subcategories: ["Chips", "Chocolates", "Biscuits", "Candy", "Nuts"]
  },
  {
    name: "Frozen Foods",
    emoji: "❄️",
    subcategories: ["Frozen Chicken", "Frozen Vegetables", "Ice Cream", "Ready Meals"]
  },
  {
    name: "Baby Care",
    emoji: "👶",
    subcategories: ["Baby Food", "Diapers", "Baby Wipes", "Baby Toiletries"]
  },
  {
    name: "Pharmacy & Wellness",
    emoji: "💊",
    subcategories: ["OTC Medicines", "Vitamins", "First Aid", "Personal Care"]
  },
  {
    name: "Personal Care",
    emoji: "🧴",
    subcategories: ["Shampoo", "Soap", "Skincare", "Oral Care", "Deodorants"]
  },
  {
    name: "Household Essentials",
    emoji: "🧼",
    subcategories: ["Cleaning Supplies", "Laundry", "Dishwashing", "Air Fresheners"]
  },
  {
    name: "Paper & Hygiene",
    emoji: "🧻",
    subcategories: ["Toilet Paper", "Tissue", "Paper Towels"]
  },
  {
    name: "Pet Supplies",
    emoji: "🐶",
    subcategories: ["Pet Food", "Treats", "Grooming", "Accessories"]
  },
  {
    name: "Tobacco",
    emoji: "🚬",
    subcategories: []
  },
  {
    name: "Flowers & Gifts",
    emoji: "💐",
    subcategories: []
  },
  {
    name: "Party Supplies",
    emoji: "🎉",
    subcategories: []
  },
  {
    name: "Electronics & Accessories",
    emoji: "🔌",
    subcategories: ["Chargers", "Earphones", "Batteries", "Power Banks"]
  },
  {
    name: "Ready-to-Eat Meals",
    emoji: "🍽️",
    subcategories: ["Restaurants", "Fast Food", "Pizza", "Burgers", "Desserts"]
  },
  {
    name: "Convenience Store",
    emoji: "🏪",
    subcategories: ["Daily Essentials", "Instant Foods", "Ice", "Miscellaneous"]
  }
];

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('🌱 Starting category seeding...')

  // Clear existing categories if you want a fresh start, uncomment below
  // await prisma.storefrontCategory.deleteMany();

  for (const item of CATEGORY_DATA) {
    const parentName = `${item.emoji} ${item.name}`
    const parentSlug = generateSlug(item.name)

    // Check if parent exists
    let parentCategory = await prisma.storefrontCategory.findUnique({
      where: { slug: parentSlug }
    });

    if (!parentCategory) {
      parentCategory = await prisma.storefrontCategory.create({
        data: {
          name: parentName,
          slug: parentSlug,
          is_active: true
        }
      })
      console.log(`✅ Created Parent: ${parentCategory.name}`)
    } else {
      console.log(`⏩ Skipped Parent: ${parentCategory.name} (Already exists)`)
    }

    // Insert subcategories
    for (const sub of item.subcategories) {
      const subSlug = generateSlug(`${item.name}-${sub}`);
      
      const existingSub = await prisma.storefrontCategory.findUnique({
        where: { slug: subSlug }
      });

      if (!existingSub) {
        await prisma.storefrontCategory.create({
          data: {
            name: sub,
            slug: subSlug,
            parent_id: parentCategory.id,
            is_active: true
          }
        });
        console.log(`   ↳ ✅ Created Sub: ${sub}`);
      } else {
        console.log(`   ↳ ⏩ Skipped Sub: ${sub}`);
      }
    }
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
