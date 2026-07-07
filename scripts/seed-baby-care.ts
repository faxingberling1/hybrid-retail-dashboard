import prisma from '../lib/prisma'

const BABY_CARE_DATA = [
  {
    categoryName: "Baby Food",
    products: [
      {
        name: "Nestlé Cerelac Wheat & Milk (400g)",
        price: 950,
        compare_at_price: 1000,
        image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"],
        description: "Nutritious wheat-based infant cereal with milk. Rich in Iron, Zinc, Vitamins A, C, and B12. Perfect for babies from 6 months onwards.",
        stock: 120
      },
      {
        name: "Nestlé Cerelac 3 Fruits & Wheat (400g)",
        price: 1050,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"],
        description: "Infant cereal combining the goodness of wheat and 3 fruits (apple, banana, orange). Contains Bifidus BL probiotics.",
        stock: 85
      },
      {
        name: "Gerber Oatmeal Cereal (227g)",
        price: 2100,
        compare_at_price: 2300,
        image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"],
        description: "Single-grain oatmeal cereal for babies. Non-GMO project verified. Essential nutrients for healthy growth.",
        stock: 40
      },
      {
        name: "Heinz Apple & Biscotti Purée (120g)",
        price: 450,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"],
        description: "Delicious fruit purée blended with crushed biscotti. No artificial colors, flavors, or preservatives.",
        stock: 60
      },
      {
        name: "Organix Sweet Potato & Pear Purée (100g)",
        price: 600,
        compare_at_price: 650,
        image_url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop"],
        description: "100% organic sweet potato and pear purée. Suitable for babies 6+ months.",
        stock: 50
      }
    ]
  },
  {
    categoryName: "Formula Milk",
    products: [
      {
        name: "Morinaga BF-1 Infant Formula (400g)",
        price: 1850,
        compare_at_price: 1950,
        image_url: "https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop"],
        description: "Nutritious infant formula providing essential vitamins and minerals for baby's early development. (0-6 months).",
        stock: 200
      },
      {
        name: "Nido 1+ Growing Up Milk (900g)",
        price: 2250,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop"],
        description: "Specialized growing up milk for toddlers aged 1 to 3 years. Contains prebiotics, iron, and vitamin C.",
        stock: 150
      },
      {
        name: "Enfamil A+ Stage 1 (400g)",
        price: 3500,
        compare_at_price: 3800,
        image_url: "https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop"],
        description: "Premium infant formula with DHA and ARA to support brain and eye development.",
        stock: 75
      },
      {
        name: "Meiji FM-T Infant Formula (400g)",
        price: 1900,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop"],
        description: "Formulated to provide balanced nutrition for infants from birth to 6 months.",
        stock: 90
      },
      {
        name: "Aptamil 1 First Infant Milk (800g)",
        price: 6500,
        compare_at_price: 6800,
        image_url: "https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1524089304724-4ea8fc586a11?q=80&w=2070&auto=format&fit=crop"],
        description: "Advanced formulation suitable from birth, containing a unique blend of GOS/FOS and LCPs.",
        stock: 30
      }
    ]
  },
  {
    categoryName: "Diapers",
    products: [
      {
        name: "Pampers Baby-Dry Pants (Size 4, 60 pcs)",
        price: 3850,
        compare_at_price: 4200,
        image_url: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop"],
        description: "Easy to pull on and take off. Up to 12 hours of dryness with micro-pearls that lock in wetness.",
        stock: 250
      },
      {
        name: "Huggies Wonder Pants (Size M, 52 pcs)",
        price: 3200,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop"],
        description: "Soft and breathable diaper pants with bubble bed technology for ultimate comfort.",
        stock: 180
      },
      {
        name: "Molfix Extra Dry (Size 3, 64 pcs)",
        price: 2950,
        compare_at_price: 3200,
        image_url: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop"],
        description: "Anti-leakage elastic barriers and an ultra-absorbent layer to keep baby dry all day.",
        stock: 200
      },
      {
        name: "Canbebe Diapers (Size L, 48 pcs)",
        price: 2600,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop"],
        description: "Dermatologically tested, flexi-comfort diapers that prevent rashes and ensure a snug fit.",
        stock: 140
      },
      {
        name: "Bona Papa Diapers (Size S, 40 pcs)",
        price: 1450,
        compare_at_price: 1600,
        image_url: "https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522771930-78848d92871d?q=80&w=2070&auto=format&fit=crop"],
        description: "Affordable and reliable diaper option with super absorbent core for maximum protection.",
        stock: 300
      }
    ]
  },
  {
    categoryName: "Baby Wipes",
    products: [
      {
        name: "Pampers Sensitive Baby Wipes (56 pcs)",
        price: 850,
        compare_at_price: 950,
        image_url: "https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop"],
        description: "Clinically proven mildness. Perfume-free and dermatologist tested for delicate baby skin.",
        stock: 400
      },
      {
        name: "Huggies Pure Baby Wipes (56 pcs)",
        price: 750,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop"],
        description: "Made with 99% pure water. Gentle cleaning that's safe from day one.",
        stock: 350
      },
      {
        name: "Johnson's Baby Skincare Wipes (72 pcs)",
        price: 650,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop"],
        description: "Enriched with silk extract. Leaves baby's skin feeling soft, smooth, and healthy.",
        stock: 500
      },
      {
        name: "Mothercare All We Know Baby Wipes (60 pcs)",
        price: 900,
        compare_at_price: 1050,
        image_url: "https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop"],
        description: "Infused with olive oil and chamomile extracts. Hypoallergenic and dermatologically tested.",
        stock: 120
      },
      {
        name: "Cool & Cool Baby Wipes (72 pcs)",
        price: 450,
        compare_at_price: 550,
        image_url: "https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1616400619175-5da045d43ca8?q=80&w=2000&auto=format&fit=crop"],
        description: "Alcohol-free formula enriched with Aloe Vera and Vitamin E for gentle cleansing.",
        stock: 600
      }
    ]
  },
  {
    categoryName: "Baby Skincare",
    products: [
      {
        name: "Johnson's Baby Lotion (200ml)",
        price: 750,
        compare_at_price: 800,
        image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop"],
        description: "Classic pink baby lotion with a gentle formula that nourishes and protects baby's delicate skin for 24 hours.",
        stock: 180
      },
      {
        name: "Sudocrem Antiseptic Healing Cream (60g)",
        price: 1250,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop"],
        description: "Clinically proven to soothe and heal nappy rash. Also useful for eczema, cuts, and minor burns.",
        stock: 220
      },
      {
        name: "Aveeno Baby Daily Moisture Lotion (227g)",
        price: 3200,
        compare_at_price: 3500,
        image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop"],
        description: "Formulated with natural colloidal oatmeal to moisturize and protect baby's dry, sensitive skin.",
        stock: 90
      },
      {
        name: "Mustela Hydra Bébé Body Lotion (300ml)",
        price: 4500,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop"],
        description: "Premium daily moisturizer with avocado Perseose to reinforce the skin barrier and preserve cellular richness.",
        stock: 45
      },
      {
        name: "Cetaphil Baby Daily Lotion (400ml)",
        price: 3800,
        compare_at_price: 4200,
        image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop"],
        description: "Blends sweet almond and sunflower oils to hydrate and protect your baby's delicate skin from dryness.",
        stock: 110
      }
    ]
  },
  {
    categoryName: "Baby Bath",
    products: [
      {
        name: "Johnson's Baby Shampoo (200ml)",
        price: 650,
        compare_at_price: 700,
        image_url: "https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop"],
        description: "No More Tears formula. As gentle to the eyes as pure water. Leaves hair soft, shiny, and smelling baby fresh.",
        stock: 300
      },
      {
        name: "Mothercare All We Know Baby Bath (300ml)",
        price: 1100,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop"],
        description: "Dermatologically tested and hypoallergenic. Contains natural extracts for a soothing bath experience.",
        stock: 150
      },
      {
        name: "Aveeno Baby Wash & Shampoo (236ml)",
        price: 2800,
        compare_at_price: 3100,
        image_url: "https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop"],
        description: "Tear-free, lightly scented wash and shampoo with natural oat extract. Cleanses without drying out the skin.",
        stock: 100
      },
      {
        name: "Sebamed Baby Wash Extra Soft (200ml)",
        price: 2200,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop"],
        description: "100% soap and alkali-free. Promotes the development of the skin's protective acid mantle (pH 5.5).",
        stock: 80
      },
      {
        name: "Dove Baby Rich Moisture Hair to Toe Wash (200ml)",
        price: 950,
        compare_at_price: 1100,
        image_url: "https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755389378-c81fd8733929?q=80&w=2000&auto=format&fit=crop"],
        description: "Helps retain baby's natural skin moisture all day long. Tear-free and hypoallergenic.",
        stock: 160
      }
    ]
  },
  {
    categoryName: "Feeding Accessories",
    products: [
      {
        name: "Philips Avent Natural Baby Bottle (260ml)",
        price: 2800,
        compare_at_price: 3200,
        image_url: "https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop"],
        description: "Wide breast-shaped nipple promotes natural latch-on. Anti-colic valve designed to reduce colic and discomfort.",
        stock: 90
      },
      {
        name: "Tommee Tippee Closer to Nature Bottle (260ml)",
        price: 2400,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop"],
        description: "Award-winning breast-like nipple for an easy latch. Optimum venting valve to reduce air intake.",
        stock: 120
      },
      {
        name: "Dr. Brown's Anti-Colic Bottle (250ml)",
        price: 3100,
        compare_at_price: 3500,
        image_url: "https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop"],
        description: "Clinically proven to reduce colic. Features an internal vent system to preserve nutrients and aid digestion.",
        stock: 65
      },
      {
        name: "Medela Calma Breastmilk Bottle (150ml)",
        price: 4200,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop"],
        description: "Innovative feeding solution specifically designed for breastmilk. Allows baby to maintain their natural feeding behavior.",
        stock: 40
      },
      {
        name: "Pigeon Peristaltic Plus Nursing Bottle (240ml)",
        price: 1950,
        compare_at_price: 2200,
        image_url: "https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596544710260-2621c1fce9db?q=80&w=2000&auto=format&fit=crop"],
        description: "Soft, flexible nipple with an air ventilation system (AVS) to reduce swallowing of air. Made from BPA-free materials.",
        stock: 150
      }
    ]
  }
];

async function main() {
  console.log('🌱 Seeding Baby Care products...')

  for (const group of BABY_CARE_DATA) {
    // Check if category exists
    const category = await prisma.storefrontCategory.findFirst({
      where: { name: group.categoryName }
    })

    if (!category) {
      console.log(`⚠️ Category not found: ${group.categoryName}. Skipping.`)
      continue
    }

    console.log(`\n📦 Seeding products for: ${category.name}`)

    for (const prod of group.products) {
      // Check if product already exists to avoid duplicates
      const existing = await prisma.storefrontProduct.findFirst({
        where: { name: prod.name }
      })

      if (existing) {
        console.log(`🔄 Product already exists: ${prod.name}`)
        continue
      }

      await prisma.storefrontProduct.create({
        data: {
          name: prod.name,
          slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6),
          description: prod.description,
          price: prod.price,
          compare_at_price: prod.compare_at_price,
          is_active: true,
          category_id: category.id,
          image_url: prod.image_url,
          images: prod.images,
          stock: prod.stock
        }
      })
      console.log(`✅ Created: ${prod.name}`)
    }
  }

  console.log('\n✨ Baby Care seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
