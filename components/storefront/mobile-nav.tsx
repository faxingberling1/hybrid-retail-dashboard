"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { useCartStore } from '@/lib/store/cart-store'

export function MobileNav() {
  const { setSidebarOpen, setCartOpen, setAuthModalOpen, setCategoriesOpen, isCategoriesOpen, isCartOpen, isAuthModalOpen } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const getItemCount = useCartStore((state) => state.getItemCount)
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  const params = useParams()
  const pathname = usePathname()
  const industry = params?.industry as string | undefined
  const homeHref = industry ? `/storefront/${industry}` : "/storefront"
  
  const isHomeActive = pathname === homeHref || pathname === '/storefront'
  const isAccountActive = pathname?.includes('/storefront/account')

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] rounded-full px-6 py-3 z-40">
      <div className="flex items-center justify-between">
        <Link 
          href={homeHref} 
          className={`flex flex-col items-center gap-1 p-2 transition-all relative ${isHomeActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
          {isHomeActive && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          )}
        </Link>
        
        <button 
          onClick={() => setCategoriesOpen(!isCategoriesOpen)}
          className={`flex flex-col items-center gap-1 p-2 transition-all ${isCategoriesOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <Grid className="w-6 h-6" />
          <span className="text-[10px] font-bold">Categories</span>
        </button>
        
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 p-2 transition-all text-gray-500 hover:text-primary"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Search</span>
        </button>
        
        <button 
          onClick={() => setCartOpen(!isCartOpen)}
          className={`flex flex-col items-center gap-1 p-2 transition-all relative ${isCartOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">Cart</span>
          {mounted && getItemCount() > 0 && (
            <span className="absolute -top-1 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {getItemCount()}
            </span>
          )}
        </button>
        
        {isAuthenticated ? (
          <Link 
            href="/storefront/account" 
            className={`flex flex-col items-center gap-1 p-2 transition-all ${isAccountActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Account</span>
          </Link>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(!isAuthModalOpen)}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${isAuthModalOpen ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Login</span>
          </button>
        )}
      </div>
    </div>
  )
}
