import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { WishlistButton } from "@/components/storefront/wishlist-button"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number | string
    compareAtPrice?: number | string | null
    imageUrl?: string | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const parsePrice = (p: any) => typeof p === 'string' ? Number(p.replace(/,/g, '')) : Number(p);
  const price = parsePrice(product.price);
  const compareAtPrice = product.compareAtPrice ? parsePrice(product.compareAtPrice) : null;

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 group relative">
      <Link href={`/storefront/products/${product.id}`} className="relative aspect-square w-full mb-3 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 block">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
        )}
        
        {compareAtPrice && compareAtPrice > price && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 shadow-sm">
            -{Math.round((1 - price / compareAtPrice) * 100)}%
          </div>
        )}
      </Link>
      
      <div className="absolute top-5 right-5 z-20">
        <WishlistButton 
          product={{ 
            id: product.id, 
            name: product.name, 
            price: price, 
            image_url: product.imageUrl ?? null 
          }} 
        />
      </div>
      
      <div className="flex flex-col flex-1 mt-2">
        <Link href={`/storefront/products/${product.id}`} className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors min-h-[32px] md:min-h-[40px]">
          {product.name}
        </Link>
        <div className="mt-auto pt-2 border-t border-gray-50 flex flex-col">
          <div className="mb-2">
            <div className={`text-[10px] font-bold ${compareAtPrice ? 'text-gray-400 line-through' : 'text-transparent select-none'}`}>
              {compareAtPrice ? `Rs. ${compareAtPrice.toFixed(0)}` : 'Rs. 0'}
            </div>
            <div className="text-sm md:text-base font-black text-gray-900">
              Rs. {price.toFixed(0)}
            </div>
          </div>
          <AddToCartButton 
            product={{
              id: product.id, 
              name: product.name, 
              price: price, 
              image_url: product.imageUrl ?? null
            }} 
            variant="card" 
          />
        </div>
      </div>
    </div>
  )
}
