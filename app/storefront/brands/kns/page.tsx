import { BrandPage } from "@/components/storefront/brand-page"

export default async function KNsPage() {
  return await BrandPage({
    brandName: "K&N's",
    searchKeyword: "K&N",
    logoUrl: "/brands/kns.png",
    bannerBg: "bg-rose-100"
  })
}
