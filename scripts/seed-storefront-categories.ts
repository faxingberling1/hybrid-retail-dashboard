import prisma from '../lib/prisma'

const CATEGORY_STRUCTURE = {
  "Grocery": ["Everyday Essentials", "Value Packs", "Imported Groceries", "Organic Products", "Local Products"],
  "Fresh Produce": ["Fruits", "Vegetables", "Herbs", "Salads", "Fresh Cut Produce"],
  "Meat & Seafood": ["Chicken", "Beef", "Mutton", "Fish", "Seafood", "Processed Meat", "Marinated Meat"],
  "Dairy & Eggs": ["Milk", "Cheese", "Butter & Margarine", "Yogurt", "Cream", "Eggs", "Dairy Alternatives"],
  "Bakery": ["Bread", "Buns & Rolls", "Cakes", "Pastries", "Cookies", "Muffins", "Donuts"],
  "Frozen Foods": ["Frozen Chicken", "Frozen Meat", "Frozen Seafood", "Frozen Vegetables", "Frozen Snacks", "Frozen Desserts", "Ice Cream", "Ready Meals"],
  "Snacks & Confectionery": ["Chips", "Biscuits", "Chocolates", "Candy", "Gum & Mints", "Popcorn", "Nuts & Seeds", "Trail Mix"],
  "Beverages": ["Water", "Soft Drinks", "Juices", "Tea", "Coffee", "Energy Drinks", "Sports Drinks", "Milk Drinks", "Syrups"],
  "Pantry & Staples": ["Rice", "Flour", "Lentils & Pulses", "Cooking Oil & Ghee", "Sugar", "Salt", "Spices & Seasonings", "Sauces & Condiments", "Pasta", "Noodles", "Canned Foods", "Baking Ingredients"],
  "Breakfast & Cereals": ["Breakfast Cereals", "Oats", "Granola", "Pancake Mix", "Honey", "Jam", "Peanut Butter", "Spreads"],
  "Baby Care": ["Baby Food", "Formula Milk", "Diapers", "Baby Wipes", "Baby Skincare", "Baby Bath", "Feeding Accessories"],
  "Personal Care": ["Hair Care", "Skin Care", "Face Care", "Body Care", "Oral Care", "Men's Grooming", "Women's Hygiene", "Deodorants", "Perfumes"],
  "Health & Pharmacy": ["OTC Medicines", "Vitamins & Supplements", "First Aid", "Medical Devices", "Pain Relief", "Cold & Flu", "Digestive Health", "Allergy Care"],
  "Household Essentials": ["Kitchen Supplies", "Food Storage", "Trash Bags", "Aluminum Foil & Wrap", "Light Bulbs", "Batteries", "Air Fresheners"],
  "Cleaning & Laundry": ["Laundry Detergent", "Fabric Softener", "Dishwashing", "Floor Cleaners", "Bathroom Cleaners", "Glass Cleaners", "Disinfectants", "Cleaning Tools"],
  "Pet Supplies": ["Dog Food", "Cat Food", "Pet Treats", "Pet Toys", "Grooming", "Pet Hygiene", "Accessories"],
  "Flowers & Gifts": ["Fresh Flowers", "Bouquets", "Indoor Plants", "Gift Baskets", "Chocolates", "Greeting Cards", "Balloons"],
  "Electronics & Accessories": ["Chargers", "Power Banks", "Earphones", "Headphones", "Mobile Accessories", "Batteries", "Cables", "Smart Gadgets"],
  "Stationery & Office Supplies": ["Notebooks", "Pens & Pencils", "Markers", "Printer Paper", "Printer Ink", "Files & Folders", "School Supplies"],
  "Home & Kitchen": ["Cookware", "Bakeware", "Kitchen Tools", "Tableware", "Storage Containers", "Cleaning Accessories", "Home Décor"],
  "Ready-to-Eat Meals": ["Sandwiches", "Salads", "Wraps", "Rice Meals", "Pasta", "Soups", "Meal Boxes"],
  "Restaurants": ["Fast Food", "Pizza", "Burgers", "Pakistani", "Chinese", "Italian", "BBQ", "Indian", "Arabic", "Japanese", "Healthy Food", "Vegetarian", "Seafood"],
  "Desserts & Ice Cream": ["Ice Cream", "Cakes", "Brownies", "Cookies", "Donuts", "Pastries", "Waffles", "Milkshakes", "Frozen Yogurt"],
  "Convenience Store": ["Instant Noodles", "Ready Snacks", "Soft Drinks", "Ice", "Tobacco", "Phone Top-ups"],
  "Organic & Healthy Foods": ["Organic Produce", "Gluten-Free", "Vegan", "Keto", "Sugar-Free", "Protein Foods", "Superfoods"],
  "Tobacco (Where Legally Permitted)": ["Cigarettes", "Cigars", "Rolling Tobacco", "Lighters", "Matches", "Smoking Accessories"]
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function main() {
  console.log("🧹 Clearing old storefront data...")
  
  // Clear order items that reference products
  await prisma.storefrontOrderItem.deleteMany({})
  // Clear cart items if they reference products (Zustand is local, so this might just be DB carts if any exist)
  
  // Clear products
  await prisma.storefrontProduct.deleteMany({})
  
  // Clear categories
  await prisma.storefrontCategory.deleteMany({})

  console.log("🌱 Seeding 26 Main Categories & Sub Categories...")

  for (const [mainCatName, subCats] of Object.entries(CATEGORY_STRUCTURE)) {
    // 1. Create Main Category
    const mainCategory = await prisma.storefrontCategory.create({
      data: {
        name: mainCatName,
        slug: generateSlug(mainCatName),
        is_active: true
      }
    })

    console.log(`Created Main: ${mainCatName}`)

    // 2. Create Sub Categories
    for (const subCatName of subCats) {
      // Because slug must be unique, prepend main category slug if collision happens, or just use sub cat slug
      let subSlug = generateSlug(subCatName)
      
      // Some subcategories might have same name (e.g. Ice Cream in Desserts and Frozen Foods)
      // So let's make slug unique by appending main category slug
      subSlug = `${subSlug}-${mainCategory.slug}`

      const subCategory = await prisma.storefrontCategory.create({
        data: {
          name: subCatName,
          slug: subSlug,
          is_active: true,
          parent_id: mainCategory.id
        }
      })

      // 3. Create 2 dummy products for each Sub Category
      await prisma.storefrontProduct.createMany({
        data: [
          {
            name: `${subCatName} Item 1`,
            slug: generateSlug(`${subCatName} Item 1`) + '-' + Math.random().toString(36).substring(2, 6),
            description: `Premium ${subCatName} product carefully selected for you.`,
            price: Math.floor(Math.random() * 1000) + 100,
            image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${subSlug}-1`,
            is_active: true,
            stock: 50,
            category_id: subCategory.id
          },
          {
            name: `${subCatName} Item 2`,
            slug: generateSlug(`${subCatName} Item 2`) + '-' + Math.random().toString(36).substring(2, 6),
            description: `Another amazing ${subCatName} product ready for delivery.`,
            price: Math.floor(Math.random() * 1000) + 100,
            image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${subSlug}-2`,
            is_active: true,
            stock: 50,
            category_id: subCategory.id
          }
        ]
      })
    }
  }

  console.log("✅ Seed complete! 26 Main Categories, Sub Categories, and Dummy Products inserted.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
