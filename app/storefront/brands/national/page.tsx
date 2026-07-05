import { BrandPage } from "@/components/storefront/brand-page"

export default async function NationalPage() {
  return await BrandPage({
    brandName: "National",
    searchKeyword: "National",
    logoUrl: "/brands/national.png",
    bannerBg: "bg-red-100"
  })
}
