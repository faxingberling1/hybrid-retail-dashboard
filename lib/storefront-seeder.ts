import { db } from '@/lib/db'
import { mockIndustries } from '@/lib/storefront-mock-data'
import { randomUUID } from 'crypto'

export async function seedOrganizationStorefront(orgId: string, industry: string) {
  const data = (mockIndustries as any)[industry] || (mockIndustries as any)['retail']; // fallback
  if (!data) return;

  const categories = data.categories;
  const products = data.products;

  // Insert categories
  for (const cat of categories) {
    // Generate UUIDs for the actual DB, we map the mock string IDs to UUIDs
    const catId = randomUUID();
    
    // Store mapping from mock ID to real UUID
    cat._realId = catId;

    await db.query(
      `INSERT INTO storefront_categories (id, organization_id, name, slug, parent_id, is_active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [catId, orgId, cat.name, cat.slug, null]
    );

    // Also insert the mock subcategory
    const subCatId = randomUUID();
    cat._realSubId = subCatId;
    
    await db.query(
      `INSERT INTO storefront_categories (id, organization_id, name, slug, parent_id, is_active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [subCatId, orgId, 'All ' + cat.name, cat.slug + '-all', catId]
    );
  }

  // Insert products
  for (const prod of products) {
    const prodId = randomUUID();
    
    // Find the real subcategory ID
    const parentCat = categories.find((c: any) => c.id === prod.category_id || c.id + '_sub' === prod.category_id);
    const realCategoryId = parentCat ? parentCat._realSubId : null;

    if (realCategoryId) {
      await db.query(
        `INSERT INTO storefront_products (
          id, organization_id, category_id, name, slug, price, compare_at_price, 
          image_url, is_active, stock_status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, true, 'IN_STOCK', NOW(), NOW()
        )`,
        [
          prodId, 
          orgId, 
          realCategoryId, 
          prod.name, 
          prod.name.toLowerCase().replace(/\s+/g, '-'), 
          prod.price, 
          prod.compare_at_price || null, 
          prod.image_url
        ]
      );
    }
  }
}
