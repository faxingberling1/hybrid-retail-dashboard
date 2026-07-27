"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { useCartStore } from '@/lib/store/cart-store'

export function MobileNav() {
  const { setSidebarOpen, setCartOpen, setAuthModalOpen, setCategoriesOpen } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const getItemCount = useCartStore((state) => state.getItemCount)
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/85 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] rounded-full px-6 py-3 z-40">
      <div className="flex items-center justify-between">
        <Link href="/storefront" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#ffc000] transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        
        <button 
          onClick={() => setCategoriesOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#ffc000] transition-colors"
        >
          <Grid className="w-6 h-6" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>
        
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Search</span>
        </button>
        
        <button 
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-rose-500 transition-colors relative"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">Cart</span>
          {mounted && getItemCount() > 0 && (
            <span className="absolute -top-1 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {getItemCount()}
            </span>
          )}
        </button>
        
        {isAuthenticated ? (
          <Link href="/storefront/account" className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Account</span>
          </Link>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Login</span>
          </button>
        )}
      </div>
    </div>
  )
}
