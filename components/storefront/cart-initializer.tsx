"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"

export function CartInitializer({ industry }: { industry: string }) {
  const setActiveCartIndustry = useCartStore((state) => state.setActiveIndustry)
  const setActiveWishlistIndustry = useWishlistStore((state) => state.setActiveIndustry)

  useEffect(() => {
    if (industry) {
      setActiveCartIndustry(industry)
      setActiveWishlistIndustry(industry)
    }
  }, [industry, setActiveCartIndustry, setActiveWishlistIndustry])

  return null
}
