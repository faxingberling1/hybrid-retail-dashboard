import { BrandPage } from "@/components/storefront/brand-page"

export default async function DawnFoodsPage() {
  return await BrandPage({
    brandName: "Dawn Foods",
    searchKeyword: "Dawn",
    logoUrl: "/brands/dawn.png",
    bannerBg: "bg-amber-100"
  })
}
