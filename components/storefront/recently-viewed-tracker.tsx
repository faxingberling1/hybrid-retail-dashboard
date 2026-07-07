"use client"

import { useEffect } from "react"

interface ProductInfo {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  imageUrl: string | null
}

export function RecentlyViewedTracker({ product }: { product: ProductInfo }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("storefront_recently_viewed")
      let viewed: ProductInfo[] = stored ? JSON.parse(stored) : []
      
      // Remove if already exists
      viewed = viewed.filter(p => p.id !== product.id)
      
      // Add to front
      viewed.unshift(product)
      
      // Keep only last 10
      if (viewed.length > 10) {
        viewed = viewed.slice(0, 10)
      }
      
      localStorage.setItem("storefront_recently_viewed", JSON.stringify(viewed))
    } catch (e) {
      console.error("Error storing recently viewed", e)
    }
  }, [product.id])

  return null
}
