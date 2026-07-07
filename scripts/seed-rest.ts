import prisma from '../lib/prisma';

const categoryImages = {
  'fresh-produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
  'meat-seafood': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
  'dairy-eggs': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'frozen-foods': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
  'baby-care': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'snacks-confectionery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'beverages': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  'pantry-staples': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'breakfast-cereals': 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80',
  'personal-care': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
  'health-pharmacy': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
  'household-essentials': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
  'cleaning-laundry': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  'pet-supplies': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
  'flowers-gifts': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
  'electronics-accessories': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  'stationery-office-supplies': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
  'ready-to-eat-meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  'restaurants': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  'desserts-ice-cream': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  'convenience-store': 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=600&q=80',
  'organic-healthy-foods': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'tobacco-where-legally-permitted': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
};

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("🌱 Checking categories for missing products...");
  
  const parentCategories = await prisma.storefrontCategory.findMany({
    where: { parent_id: null },
    include: {
      children: true
    }
  });
  
  const allProducts = await prisma.storefrontProduct.findMany({
    select: { category_id: true }
  });
  
  const productsByCat = new Set(allProducts.map(p => p.category_id));
  
  let inserted = 0;
  
  for (const parent of parentCategories) {
    const childIds = parent.children.map(c => c.id);
    const hasProducts = productsByCat.has(parent.id) || childIds.some(id => productsByCat.has(id));
    
    if (!hasProducts) {
      console.log(`⚠️ Category "${parent.name}" is empty. Adding a realistic product...`);
      
      // Try to find an image by slug, or fallback to grocery image
      const imageUrl = categoryImages[parent.slug] || categoryImages['grocery'];
      
      const productName = `Premium ${parent.name} Selection`;
      
      // Create product in the parent category (or its first child if you want, but parent is fine since page.tsx supports it)
      const targetCatId = parent.children.length > 0 ? parent.children[0].id : parent.id;
      
      await prisma.storefrontProduct.create({
        data: {
          name: productName,
          slug: generateSlug(productName) + '-' + Math.random().toString(36).substring(2, 6),
          description: `A curated selection of high-quality items from our ${parent.name} department.`,
          price: 1500,
          compare_at_price: 1800,
          stock: 100,
          image_url: imageUrl,
          is_active: true,
          category_id: targetCatId
        }
      });
      
      inserted++;
    }
  }
  
  console.log(`✅ Seed complete! Inserted ${inserted} products to fill empty categories.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
