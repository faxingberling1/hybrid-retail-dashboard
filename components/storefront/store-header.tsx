"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, MapPin, Menu, User, Store, Globe, X, ChevronRight, Heart, Trophy, Gift, Carrot, Fish, Milk, Croissant, Snowflake, Baby, Coffee, Pill, Package, Droplet, Smartphone, Home, Flower2, List, Wallet, Ticket, CreditCard, HelpCircle, LifeBuoy, FileText, Shield, LogOut } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { useWishlistStore } from "@/lib/store/wishlist-store"
import { useLoyaltyStore } from "@/lib/store/loyalty-store"
import { useUIStore } from "@/lib/store/ui-store"
import { useAuthStore } from "@/lib/store/auth-store"
import { useLocationStore } from "@/lib/store/location-store"
import { toast } from "sonner"
export function StoreHeader({ categories = [] }: { categories?: any[] }) {
  const getCartTotal = useCartStore((state) => state.getCartTotal)
  const getItemCount = useCartStore((state) => state.getItemCount)
  const { items, updateQuantity, removeItem } = useCartStore()
  
  const getWishlistCount = useWishlistStore((state) => state.getItemCount)
  const getPoints = useLoyaltyStore((state) => state.getPoints)
  
  const [mounted, setMounted] = React.useState(false)
  const { isSidebarOpen, setSidebarOpen, isCartOpen, setCartOpen, setAuthModalOpen, setAddressModalOpen } = useUIStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { address, isLoading, fetchLocation } = useLocationStore()
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()
  
  React.useEffect(() => {
    setMounted(true)
    fetchLocation()
  }, [])

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = React.useRef<HTMLDivElement>(null)
  const mobileSearchRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const fetchSearch = async () => {
      if (searchValue.trim().length < 2) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      try {
        const res = await fetch(`/api/storefront/search?q=${encodeURIComponent(searchValue.trim())}`)
        const data = await res.json()
        setSearchResults(data.products || [])
      } catch (err) {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }
    const timer = setTimeout(fetchSearch, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        searchRef.current && !searchRef.current.contains(target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(target)
      ) {
        setSearchResults([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/storefront/products?q=${encodeURIComponent(searchValue.trim())}`)
      setSidebarOpen(false)
      setSearchResults([])
    }
  }



  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#ffc000] shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-900 hover:bg-black/5 rounded-full transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/storefront" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter text-gray-900">
                Storefront
              </span>
            </Link>
          </div>

          <button 
            onClick={() => setAddressModalOpen(true)}
            className="hidden lg:flex flex-col items-start px-3 py-1 hover:bg-black/5 rounded-xl transition-colors shrink-0"
          >
            <span className="text-[10px] text-gray-700 font-bold leading-tight">Delivering to</span>
            <span className="text-sm font-black text-gray-900 flex items-center gap-1 leading-tight">
              <MapPin className="w-3 h-3 text-gray-900" />
              <span className="max-w-[120px] truncate">{isLoading ? "Locating..." : address}</span>
            </span>
          </button>

          <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
            <div className="relative w-full">
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for 'Ice cream'" 
                className="w-full h-11 pl-12 pr-4 rounded-full bg-white text-gray-900 border-0 focus:ring-2 focus:ring-black/20 outline-none transition-shadow shadow-sm font-medium"
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Desktop Search Dropdown */}
            {searchValue.trim().length >= 2 && searchResults !== null && (
              <div className="absolute top-12 left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {isSearching ? (
                   <div className="p-4 text-center text-sm font-bold text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                   <div className="max-h-80 overflow-y-auto">
                     {searchResults.map(product => (
                        <Link 
                          key={product.id} 
                          href={`/storefront/products/${product.id}`}
                          onClick={() => { setSearchValue(''); setSearchResults([]); }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 m-2.5 text-gray-400" />}
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                            <span className="text-xs font-black text-rose-500">Rs. {Number(typeof product.price === 'string' ? product.price.replace(/,/g, '') : product.price).toFixed(0)}</span>
                          </div>
                        </Link>
                     ))}
                   </div>
                ) : (
                   <div className="p-4 text-center text-sm font-bold text-gray-500">No products found for "{searchValue}"</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-black">
              <Globe className="h-4 w-4" />
              Main Site
            </Link>

            <Link href="/storefront/referral" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 font-bold text-sm hover:bg-indigo-100 transition-colors">
              <Gift className="h-4 w-4" />
              Refer & Earn
            </Link>

            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-white/20 text-gray-900 rounded-full border border-gray-900/10 font-bold text-xs md:text-sm">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">{mounted ? getPoints().toLocaleString() : '0'} Pts</span>
              <span className="sm:hidden">{mounted ? getPoints() : '0'}</span>
            </div>
            
            {mounted && isAuthenticated ? (
              <div className="relative group">
                <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-black">
                  <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <Link href="/storefront/account" className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                    My Account
                  </Link>
                  <button onClick={() => logout()} className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-50">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-black">
                <User className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}

            <Link href="/storefront/wishlist" className="relative p-2 text-gray-800 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center">
              <Heart className="h-5 w-5" />
              {mounted && getWishlistCount() > 0 && (
                <span className="absolute 0 top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 rounded-full font-bold shadow-sm shadow-rose-500/30 transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:block">Rs. {mounted ? getCartTotal().toLocaleString() : '0'}</span>
              {mounted && getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (shows below header on mobile) */}
        <div className="md:hidden container mx-auto px-4 pb-3 relative" ref={mobileSearchRef}>
          <div className="relative w-full">
            <input 
              type="text" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for 'Ice cream'" 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white text-gray-900 border-0 outline-none shadow-sm font-medium text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Mobile Search Dropdown */}
          {searchValue.trim().length >= 2 && searchResults !== null && (
            <div className="absolute top-12 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {isSearching ? (
                 <div className="p-4 text-center text-sm font-bold text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                 <div className="max-h-80 overflow-y-auto">
                   {searchResults.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/storefront/products/${product.id}`}
                        onClick={() => { setSearchValue(''); setSearchResults([]); }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 m-2.5 text-gray-400" />}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                          <span className="text-xs font-black text-rose-500">Rs. {Number(typeof product.price === 'string' ? product.price.replace(/,/g, '') : product.price).toFixed(0)}</span>
                        </div>
                      </Link>
                   ))}
                 </div>
              ) : (
                 <div className="p-4 text-center text-sm font-bold text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <span className="text-sm text-gray-400 italic font-serif">Version 1.2 (084)</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 -mr-2 text-gray-900 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-6">
          {isAuthenticated && (
            <>
              <div className="flex flex-col">
                <Link href="/storefront/account?tab=profile" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <User className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Profile</span>
                </Link>
                <Link href="/storefront/account?tab=orders" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <List className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Orders & Reordering</span>
                </Link>
                <Link href="/storefront/account?tab=addresses" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <MapPin className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Address</span>
                </Link>
                <Link href="/storefront/account?tab=wallet" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <Wallet className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Your Wallet</span>
                </Link>
                <Link href="/storefront/account?tab=vouchers" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <Ticket className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Vouchers</span>
                </Link>
                <Link href="/storefront/account?tab=payments" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <CreditCard className="w-6 h-6 text-gray-900 stroke-[2]" />
                  <span className="font-bold text-gray-900 text-[15px]">Payments</span>
                </Link>
              </div>
              <div className="my-2 border-t border-gray-200/60"></div>
            </>
          )}

          <div className="flex flex-col">
            <Link href="/storefront/help" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-6 h-6 text-gray-900 stroke-[2]" />
              <span className="font-bold text-gray-900 text-[15px]">Help Center</span>
            </Link>
            <Link href="/storefront/support" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
              <LifeBuoy className="w-6 h-6 text-gray-900 stroke-[2]" />
              <span className="font-bold text-gray-900 text-[15px]">My Support Requests</span>
            </Link>
            <Link href="/storefront/terms" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
              <FileText className="w-6 h-6 text-gray-900 stroke-[2]" />
              <span className="font-bold text-gray-900 text-[15px]">Terms & Conditions</span>
            </Link>
            <Link href="/storefront/privacy" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors">
              <Shield className="w-6 h-6 text-gray-900 stroke-[2]" />
              <span className="font-bold text-gray-900 text-[15px]">Privacy Policy</span>
            </Link>
            
            {isAuthenticated ? (
              <button onClick={() => { setSidebarOpen(false); logout(); toast.success("Logged out successfully"); }} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                <LogOut className="w-6 h-6 text-gray-900 stroke-[2]" />
                <span className="font-bold text-gray-900 text-[15px]">Logout</span>
              </button>
            ) : (
              <button onClick={() => { setSidebarOpen(false); setAuthModalOpen(true); }} className="w-full flex items-center gap-5 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                <User className="w-6 h-6 text-gray-900 stroke-[2]" />
                <span className="font-bold text-gray-900 text-[15px]">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[320px] sm:w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-gray-900" />
            <span className="text-xl font-black text-gray-900">Your Cart</span>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 -mr-2 text-gray-900 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {!mounted ? null : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">Cart is empty</h3>
              <p className="text-sm text-gray-500">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100 flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-gray-900">Rs. {item.price}</span>
                      <div className="flex items-center bg-gray-100 rounded-full">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-600">Subtotal</span>
            <span className="text-xl font-black text-gray-900">Rs. {mounted ? getCartTotal().toLocaleString() : '0'}</span>
          </div>
          {mounted && items.length > 0 ? (
            <Link 
              href="/storefront/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full bg-rose-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              Checkout <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <button 
              disabled
              className="w-full bg-gray-200 text-gray-400 py-4 rounded-xl font-black text-sm uppercase tracking-widest cursor-not-allowed"
            >
              Checkout
            </button>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}} />
    </>
  )
}
