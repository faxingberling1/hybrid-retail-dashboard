"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Package } from 'lucide-react'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) {
      router.push(`/storefront/track/${encodeURIComponent(orderId.trim())}`)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-12 md:pt-20">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Track Your Order</h1>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Enter Tracking ID</h2>
          <p className="text-gray-500 text-sm mb-6">You can find your order ID in your confirmation email or SMS.</p>
          
          <form onSubmit={handleTrack}>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-123456" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              Track Order
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
