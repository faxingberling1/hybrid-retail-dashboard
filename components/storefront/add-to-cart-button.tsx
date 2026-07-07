"use client"

import { Plus, Check, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { useState, useEffect } from "react"

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number | string;
    image_url: string | null;
    stock?: number;
  };
  variant?: "icon" | "full" | "card";
}

export function AddToCartButton({ product, variant = "full" }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stockLimit = product.stock ?? 99
  const cartItem = items.find(i => i.id === product.id)
  const isOutOfStock = stockLimit <= 0 || (cartItem && cartItem.quantity >= stockLimit)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOutOfStock) return

    addItem({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? Number(product.price.replace(/,/g, '')) : product.price,
      image_url: product.image_url,
      stock: stockLimit
    }, quantity)

    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
    setQuantity(1) // Reset quantity after adding
  }

  if (!mounted) return null

  if (variant === "card") {
    return (
      <div className="flex flex-col gap-2 w-full mt-2" onClick={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
          <button 
            onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
            className="w-8 h-8 flex items-center justify-center font-black text-gray-600 hover:bg-gray-200 transition-colors"
          >
            -
          </button>
          <span className="font-bold text-sm text-gray-900">{quantity}</span>
          <button 
            onClick={(e) => { e.preventDefault(); setQuantity(Math.min(stockLimit, quantity + 1)); }}
            className="w-8 h-8 flex items-center justify-center font-black text-gray-600 hover:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={!!isOutOfStock}
          className={`w-full py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
            justAdded
              ? "bg-emerald-500 text-white"
              : isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-rose-500"
          }`}
        >
          {justAdded ? "Added" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    )
  }

  if (variant === "icon") {
    return (
      <button 
        onClick={handleAddToCart}
        disabled={!!isOutOfStock}
        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
          justAdded 
            ? "bg-emerald-500 text-white" 
            : isOutOfStock 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-900 hover:bg-rose-500 hover:text-white"
        }`}
      >
        {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-5 w-5" />}
      </button>
    )
  }

  return (
    <div className="flex gap-4 w-full" onClick={(e) => e.preventDefault()}>
      {variant === "full" && (
        <div className="hidden w-32 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 sm:flex items-center justify-between p-2 shadow-sm">
          <button 
            onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
            className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            -
          </button>
          <span className="font-black text-lg">{quantity}</span>
          <button 
            onClick={(e) => { e.preventDefault(); setQuantity(Math.min(stockLimit, quantity + 1)); }}
            className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            +
          </button>
        </div>
      )}
      
      <button 
        onClick={handleAddToCart}
        disabled={!!isOutOfStock}
        className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 ${
          justAdded
            ? "bg-emerald-500 text-white"
            : isOutOfStock
              ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white"
        }`}
      >
        {justAdded ? (
          <>
            <Check className="w-5 h-5" /> Added to Cart
          </>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" /> Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
