export const mockIndustries = {
  electronics: {
    categories: [
      { id: 'c1', name: 'Smartphones', slug: 'smartphones', parent_id: null },
      { id: 'c2', name: 'Laptops', slug: 'laptops', parent_id: null },
      { id: 'c3', name: 'Audio', slug: 'audio', parent_id: null }
    ],
    products: [
      { id: 'p1', name: 'iPhone 15 Pro', price: 999, compare_at_price: 1099, image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80', category_id: 'c1', description: 'The latest iPhone.' },
      { id: 'p2', name: 'MacBook Air M3', price: 1299, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80', category_id: 'c2', description: 'Powerful laptop.' }
    ]
  },
  pharmacy: {
    categories: [
      { id: 'c1', name: 'Vitamins', slug: 'vitamins', parent_id: null },
      { id: 'c2', name: 'Over the Counter', slug: 'otc', parent_id: null },
      { id: 'c3', name: 'Medical Devices', slug: 'devices', parent_id: null }
    ],
    products: [
      { id: 'p1', name: 'Vitamin C 1000mg', price: 15, compare_at_price: 20, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5e4a87265?w=600&q=80', category_id: 'c1', description: 'Boost your immunity.' },
      { id: 'p2', name: 'Omron BP Monitor', price: 49.99, compare_at_price: 59.99, image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80', category_id: 'c3', description: 'Monitor at home.' }
    ]
  },
  fashion: {
    categories: [
      { id: 'fc1', name: 'Women', slug: 'women', parent_id: null },
      { id: 'fc2', name: 'Accessories', slug: 'accessories', parent_id: null },
      { id: 'fc3', name: 'Fall/Winter Collection', slug: 'fw-collection', parent_id: null }
    ],
    products: [
      { id: 'p1', name: 'Wool Coat', price: 199, compare_at_price: 250, image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', category_id: 'fc3', description: 'Warm and stylish.' },
      { id: 'p2', name: 'Leather Handbag', price: 89, compare_at_price: 120, image_url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80', category_id: 'fc2', description: 'Premium leather.' }
    ]
  },
  restaurant: {
    categories: [
      { id: 'rc1', name: 'Mains', slug: 'mains', parent_id: null },
      { id: 'rc2', name: 'Desserts', slug: 'desserts', parent_id: null }
    ],
    products: [
      { id: 'p1', name: 'Margherita Pizza', price: 14, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', category_id: 'rc1', description: 'Classic italian.' },
      { id: 'p2', name: 'Tiramisu', price: 7, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80', category_id: 'rc2', description: 'Delicious dessert.' }
    ]
  }
};

export function getMockCategory(industry: string, slug: string) {
  const data = (mockIndustries as any)[industry];
  if (!data) return null;
  const parent = data.categories.find((c: any) => c.slug === slug);
  if (!parent) return null;
  return {
    ...parent,
    children: [
       // Mocking subcategories so the UI doesn't crash
       { id: parent.id + '_sub', name: 'All ' + parent.name, slug: parent.slug + '-all' }
    ]
  }
}

export function getMockProducts(industry: string, categoryId?: string) {
  const data = (mockIndustries as any)[industry];
  if (!data) return [];
  let prods = data.products;
  if (categoryId) {
    // For our mock, we assigned parent id as category_id
    prods = prods.filter((p: any) => p.category_id === categoryId);
  }
  return prods.map((p: any) => ({
    ...p,
    category: data.categories.find((c: any) => c.id === p.category_id) || null
  }));
}

export function getMockProduct(industry: string, id: string) {
  const data = (mockIndustries as any)[industry];
  if (!data) return null;
  const prod = data.products.find((p: any) => p.id === id);
  if (!prod) return null;
  return {
    ...prod,
    category: data.categories.find((c: any) => c.id === prod.category_id) || null
  }
}
