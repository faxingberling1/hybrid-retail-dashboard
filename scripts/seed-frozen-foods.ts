import prisma from '../lib/prisma'

const FROZEN_FOODS_DATA = [
  {
    categorySlug: "frozen-chicken",
    products: [
      {
        name: "K&N's Chicken Burger Patties - Standard",
        price: 1150,
        compare_at_price: 1250,
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1974&auto=format&fit=crop"
        ],
        description: `
### Product Details
Enjoy the authentic taste of K&N's Chicken Burger Patties. Made with premium boneless chicken and a special blend of spices. Perfect for quick meals, kids' lunchboxes, and family gatherings.

**Weight:** 540g (Standard Pack)
**Pieces:** 9 Patties

### Cooking Instructions
- **Frying:** Deep fry frozen patties in hot oil for 3-4 minutes until golden brown.
- **Baking:** Bake in a preheated oven at 200°C for 10-12 minutes, flipping halfway.

### Nutritional Information (per 100g)
- Calories: 210 kcal
- Protein: 14g
- Fat: 12g
- Carbohydrates: 11g
        `.trim(),
        stock: 50
      },
      {
        name: "K&N's Chicken Burger Patties - Family Size",
        price: 1950,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop"
        ],
        description: `
### Product Details
The same great taste of K&N's Chicken Burger Patties, now in a larger family-sized pack. Ideal for larger gatherings and stocking up your freezer.

**Weight:** 1080g (Family Pack)
**Pieces:** 18 Patties

### Cooking Instructions
- **Frying:** Deep fry frozen patties in hot oil for 3-4 minutes until golden brown.
        `.trim(),
        stock: 30
      },
      {
        name: "Sabroso Chicken Nuggets (Tempura)",
        price: 1350,
        compare_at_price: 1500,
        image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2073&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2073&auto=format&fit=crop"
        ],
        description: `
### Product Details
Sabroso Tempura Chicken Nuggets are crispy on the outside, juicy on the inside. A favorite for both kids and adults. 

**Weight:** 800g
**Allergens:** Contains gluten and soy.

### Why Choose Sabroso?
- 100% Halal Chicken
- No artificial preservatives
- High in protein
        `.trim(),
        stock: 45
      }
    ]
  },
  {
    categorySlug: "ready-meals",
    products: [
      {
        name: "Dawn Frozen Aloo Paratha (Family Pack)",
        price: 450,
        compare_at_price: 500,
        image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop"
        ],
        description: `
### Product Details
Dawn Aloo Parathas bring the authentic taste of home-cooked parathas right to your freezer. Stuffed with mildly spiced mashed potatoes and herbs.

**Pieces:** 5 Parathas per pack

### Cooking Instructions
1. Preheat a tawa or frying pan over medium heat.
2. Remove paratha from plastic wrapping (do not thaw).
3. Cook for 2-3 minutes on each side until golden brown. Add a little oil or butter for extra crispiness.
        `.trim(),
        stock: 100
      },
      {
        name: "Dawn Frozen Chicken Samosas (30 Pcs)",
        price: 850,
        compare_at_price: 900,
        image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop"
        ],
        description: `
### Product Details
Crispy, golden-brown samosas filled with perfectly seasoned minced chicken and traditional spices. A staple for tea-time and Iftar.

**Pieces:** 30 Samosas per pack

### Cooking Instructions
1. Deep fry in hot oil over medium heat until golden brown.
2. Do not thaw before frying.
        `.trim(),
        stock: 80
      },
      {
        name: "Dawn Frozen Chicken Spring Rolls",
        price: 750,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1544025162-811114bd4b66?q=80&w=2069&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1544025162-811114bd4b66?q=80&w=2069&auto=format&fit=crop"
        ],
        description: `
### Product Details
Delicious and crunchy spring rolls filled with tender chicken shreds and fresh vegetables. Perfect for a quick snack or appetizer.

**Pieces:** 20 Rolls per pack

### Cooking Instructions
1. Deep fry in hot oil over medium heat until crisp and golden.
        `.trim(),
        stock: 60
      }
    ]
  }
]

async function main() {
  console.log("🌱 Starting Frozen Foods seeding...")

  for (const group of FROZEN_FOODS_DATA) {
    const category = await prisma.storefrontCategory.findFirst({
      where: { name: { contains: group.categorySlug.replace('-', ' '), mode: 'insensitive' } }
    })

    if (!category) {
      console.warn(`Category ${group.categorySlug} not found. Skipping.`)
      continue
    }

    // Delete existing products for this category to replace them with real ones
    await prisma.storefrontProduct.deleteMany({
      where: { category_id: category.id }
    })

    console.log(`Deleted old mock products for ${category.name}. Adding realistic ones...`)

    for (const prod of group.products) {
      // Create slug from name
      const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

      await prisma.storefrontProduct.create({
        data: {
          name: prod.name,
          slug: slug,
          description: prod.description,
          price: prod.price,
          compare_at_price: prod.compare_at_price,
          image_url: prod.image_url,
          images: prod.images,
          stock: prod.stock,
          is_active: true,
          category_id: category.id
        }
      })
    }
  }

  console.log("✅ Realistic Frozen Foods Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
