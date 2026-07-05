import { BrandPage } from "@/components/storefront/brand-page"

export default async function SabrosoPage() {
  return await BrandPage({
    brandName: "Sabroso",
    searchKeyword: "Sabroso",
    logoUrl: "/brands/sabroso.png",
    bannerBg: "bg-orange-100"
  })
}
