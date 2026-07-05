import prisma from "@/lib/prisma"
import { ProductListingClient } from "@/components/storefront/product-listing-client"

export const dynamic = 'force-dynamic';

export default async function StorefrontProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = searchParams.category as string | undefined;
  const searchParam = searchParams.q as string | undefined;
  
  // Fetch all active products
  const products = await prisma.storefrontProduct.findMany({
    where: { is_active: true },
    include: {
      category: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  // Fetch all active categories
  const categories = await prisma.storefrontCategory.findMany({
    where: { is_active: true },
    orderBy: {
      name: 'asc'
    }
  });

  // Convert Decimal to Number for Client Component Serialization
  const serializedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
    image_url: p.image_url,
    category: { 
      name: p.category.name,
      slug: p.category.slug,
      parent_id: p.category.parent_id
    },
    created_at: p.created_at
  }));

  return (
    <ProductListingClient 
      initialProducts={serializedProducts} 
      categories={categories}
      initialCategory={categoryParam}
      initialSearch={searchParam}
    />
  )
}
