import { BrandPage } from "@/components/storefront/brand-page"
import { notFound } from "next/navigation"

export default async function DynamicBrandPage({ params }: { params: Promise<{ industry: string, slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const industry = resolvedParams.industry;

  if (!slug) return notFound();

  // Capitalize the slug to make a simple brand name for the mock
  const brandName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return await BrandPage({
    brandName: brandName,
    searchKeyword: brandName, // We can just use the name for search
    logoUrl: "", // No specific logo unless defined
    bannerBg: "bg-indigo-50"
  })
}
