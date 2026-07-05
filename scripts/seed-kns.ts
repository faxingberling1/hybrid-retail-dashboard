import { query } from '../lib/db';

async function seedKNS() {
  try {
    console.log("Seeding K&N's products...");

    // 1. Check if Meat & Seafood or Frozen Foods parent category exists to attach our subcategory to it
    // Wait, the user just says "Create 1 Sub Category". Let's create a category "Frozen Chicken" under parent "Frozen Foods".
    const parentRes = await query(`SELECT id FROM storefront_categories WHERE slug = 'frozen-foods' LIMIT 1`);
    let parentId = null;
    if (parentRes.rows.length > 0) {
      parentId = parentRes.rows[0].id;
    }

    // 2. Create the Sub Category
    const catRes = await query(`
      INSERT INTO storefront_categories (name, slug, parent_id, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, ['Frozen Chicken', 'frozen-chicken', parentId]);
    
    const categoryId = catRes.rows[0].id;
    console.log('Created/Found Category:', categoryId);

    // 3. Insert 5 K&N's Products
    const products = [
      {
        name: "K&N's Chicken Nuggets 1kg",
        slug: "kns-chicken-nuggets-1kg",
        description: "Premium breaded chicken nuggets from K&N's. Perfect for snacks and kids.",
        price: 1150,
        compare_at_price: 1250,
        image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80",
        stock: 50
      },
      {
        name: "K&N's Seekh Kabab 800g",
        slug: "kns-seekh-kabab-800g",
        description: "Delicious traditional chicken seekh kababs, fully cooked.",
        price: 1350,
        compare_at_price: 1450,
        image_url: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80",
        stock: 40
      },
      {
        name: "K&N's Burger Patties 12pcs",
        slug: "kns-burger-patties-12pcs",
        description: "Juicy chicken burger patties ready to fry or grill.",
        price: 1200,
        compare_at_price: 1300,
        image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        stock: 60
      },
      {
        name: "K&N's Shami Kabab 18pcs",
        slug: "kns-shami-kabab-18pcs",
        description: "Authentic taste of Shami Kababs made with premium chicken and lentils.",
        price: 950,
        compare_at_price: null,
        image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80",
        stock: 30
      },
      {
        name: "K&N's Chapli Kabab 10pcs",
        slug: "kns-chapli-kabab-10pcs",
        description: "Spicy and flavorful peshawari style chicken chapli kababs.",
        price: 1050,
        compare_at_price: 1100,
        image_url: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80",
        stock: 25
      }
    ];

    for (const p of products) {
      await query(`
        INSERT INTO storefront_products (name, slug, description, price, compare_at_price, image_url, stock, category_id, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
        ON CONFLICT (slug) DO UPDATE SET 
          price = EXCLUDED.price,
          compare_at_price = EXCLUDED.compare_at_price,
          image_url = EXCLUDED.image_url,
          category_id = EXCLUDED.category_id
      `, [p.name, p.slug, p.description, p.price, p.compare_at_price, p.image_url, p.stock, categoryId]);
      console.log('Inserted product:', p.name);
    }

    console.log("Successfully seeded K&N's products!");
    process.exit(0);
  } catch (error) {
    console.error('Error seeding KNS:', error);
    process.exit(1);
  }
}

seedKNS();
