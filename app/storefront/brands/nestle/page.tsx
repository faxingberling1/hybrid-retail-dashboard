import { BrandPage } from "@/components/storefront/brand-page"

export default async function NestlePage() {
  return await BrandPage({
    brandName: "Nestle",
    searchKeyword: "Nestle",
    logoUrl: "/brands/nestle.png",
    bannerBg: "bg-blue-100"
  })
}
