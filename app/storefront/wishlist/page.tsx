"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="pt-8 pb-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 text-gray-400">
          <Heart className="w-12 h-12" />
          <p className="font-bold">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-8 pb-24 min-h-[80vh] bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/storefront" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            My Wishlist
            <Heart className="w-8 h-8 text-rose-500 fill-current" />
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center max-w-2xl mx-auto mt-12">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-rose-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty!</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Looks like you haven't saved anything yet. Browse our storefront and tap the heart icon on any product you love.
            </p>
            <Link 
              href="/storefront/products" 
              className="px-8 py-4 bg-[#ffc000] hover:bg-[#e6ad00] text-gray-900 font-black uppercase tracking-widest text-sm rounded-xl shadow-sm transition-colors"
            >
              Start Browsing
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-bold">{items.length} items saved</p>
              <button 
                onClick={clearWishlist}
                className="text-sm font-bold text-gray-400 hover:text-rose-500 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 group relative">
                  <button 
                    onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
                    aria-label="Remove from Wishlist"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>

                  <Link href={`/storefront/products/${item.id}`} className="relative aspect-square w-full mb-3 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 block">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
                    )}
                  </Link>
                  
                  <div className="flex flex-col flex-1">
                    <Link href={`/storefront/products/${item.id}`} className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </Link>
                    
                    <div className="mt-auto border-t border-gray-50 pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-black text-gray-900">Rs. {item.price}</span>
                      </div>
                      <AddToCartButton product={{ ...item, stock: 1 }} variant="full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
