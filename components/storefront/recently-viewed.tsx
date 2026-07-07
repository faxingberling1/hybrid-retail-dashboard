"use client"

import React, { useEffect, useState } from "react"
import { ProductCard } from "@/components/storefront/product-card"
import { Clock } from "lucide-react"

export function RecentlyViewed() {
  const [viewedProducts, setViewedProducts] = useState<any[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("storefront_recently_viewed")
      if (stored) {
        setViewedProducts(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load recently viewed products", e)
    }
  }, [])

  if (viewedProducts.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" /> Recently Viewed
        </h2>
      </div>
      
      <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {viewedProducts.map((product) => (
          <div key={`recent-${product.id}`} className="w-[180px] md:w-[220px] flex-shrink-0 h-full">
            <ProductCard 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                imageUrl: product.imageUrl
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
