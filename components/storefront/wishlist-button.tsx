"use client"

import React, { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useWishlistStore, WishlistItem } from "@/lib/store/wishlist-store"

interface WishlistButtonProps {
  product: WishlistItem
  className?: string
}

export function WishlistButton({ product, className = "" }: WishlistButtonProps) {
  const { addItem, removeItem, hasItem } = useWishlistStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors text-gray-300 ${className}`}>
        <Heart className="w-5 h-5" />
      </button>
    )
  }

  const isWishlisted = hasItem(product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating if inside a link
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <button 
      onClick={toggleWishlist}
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110 active:scale-95 ${
        isWishlisted ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart 
        className={`w-5 h-5 transition-transform ${isWishlisted ? "fill-current scale-110" : "scale-100"}`} 
      />
    </button>
  )
}
