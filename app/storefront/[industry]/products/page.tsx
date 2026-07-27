import prisma from "@/lib/prisma"
import { ProductListingClient } from "@/components/storefront/product-listing-client"
import { getStorefrontOrg } from "@/lib/storefront-utils"

export const dynamic = 'force-dynamic';

export default async function StorefrontProductsPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
  params: Promise<{ industry: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const industry = resolvedParams.industry;
  const categoryParam = resolvedSearchParams.category as string | undefined;
  const searchParam = resolvedSearchParams.q as string | undefined;
  
  const orgStorefront = await getStorefrontOrg();
  const orgId = orgStorefront?.organization_id;

  // Fetch all active products
  let products: any[] = [];
  let categories: any[] = [];

  if (industry !== 'grocery') {
    const { getMockProducts, mockIndustries } = await import("@/lib/storefront-mock-data");
    const data = (mockIndustries as any)[industry];
    if (data) {
      categories = data.categories;
      products = getMockProducts(industry);
    }
  } else {
    products = await prisma.storefrontProduct.findMany({
      where: { 
        is_active: true,
        ...(orgId ? { organization_id: orgId } : { organization_id: null })
      },
      include: {
        category: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    categories = await prisma.storefrontCategory.findMany({
      where: { 
        is_active: true,
        ...(orgId ? { organization_id: orgId } : { organization_id: null })
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  // Convert Decimal to Number for Client Component Serialization
  const parsePrice = (p: any) => typeof p === 'string' ? Number(p.replace(/,/g, '')) : Number(p);
  const serializedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: parsePrice(p.price),
    compare_at_price: p.compare_at_price ? parsePrice(p.compare_at_price) : null,
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
