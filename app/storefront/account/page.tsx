"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { Package, User, MapPin, Heart, Trophy, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const { user, orders, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/storefront')
    }
  }, [isAuthenticated, router])

  if (!mounted || !isAuthenticated || !user) return null

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">My Account</h1>
        <p className="text-gray-500 font-medium">Manage your orders, profile, and points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-[#ffc000]/10 text-slate-900 rounded-xl font-bold transition-colors">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                Orders
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                Profile Info
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                Addresses
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            <Link href="/storefront/wishlist" className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" />
                Wishlist
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          </div>

          <button 
            onClick={() => {
              logout()
              router.push('/storefront')
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Points Card */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#ffc000] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#ffc000] mb-2">
                  <Trophy className="w-6 h-6" />
                  <span className="font-bold tracking-widest uppercase text-sm">Hybrid Rewards</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-2">{user.points} <span className="text-xl md:text-2xl text-gray-400 font-bold">Pts</span></h3>
                <p className="text-gray-400 font-medium max-w-sm">You are 50 points away from your next 10% discount reward!</p>
              </div>
              <button className="px-6 py-3 bg-[#ffc000] text-slate-900 rounded-full font-black shadow-lg shadow-[#ffc000]/20 hover:scale-105 transition-transform">
                Redeem Points
              </button>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                <Link href="/storefront" className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-gray-900">{order.id}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})} • {order.items} items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-0 border-gray-50">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total</p>
                        <p className="font-black text-gray-900">Rs. {order.total.toLocaleString()}</p>
                      </div>
                      <button className="px-5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-full font-bold text-sm transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
