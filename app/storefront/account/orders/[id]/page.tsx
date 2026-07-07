"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Download, Clock, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { orders, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  const orderId = params.id as string
  const order = orders.find(o => o.id === orderId)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/storefront')
    }
  }, [isAuthenticated, router])

  if (!mounted || !isAuthenticated) return null

  if (!order) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-24 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find the order you're looking for. It may have been deleted or doesn't belong to your account.</p>
        <Link href="/storefront/account" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to My Account
        </Link>
      </div>
    )
  }

  // Mock Products for this specific order
  const mockProducts = [
    {
      id: 'prod_1',
      name: "K&N's Chicken Tikka Chunks",
      brand: "K&N's",
      price: 1250,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 'prod_2',
      name: "Dawn Bread Large",
      brand: "Dawn",
      price: 200,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 'prod_3',
      name: "Nestle Milkpak 1 Liter",
      brand: "Nestle",
      price: 280,
      quantity: 4,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=200&auto=format&fit=crop"
    }
  ]

  const subtotal = mockProducts.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  const deliveryFee = 150
  const finalTotal = subtotal + deliveryFee

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 max-w-5xl h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/storefront/account" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Order #{order.id}</h1>
              <p className="text-sm text-gray-500 font-medium">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8">
        
        {/* Status Banner */}
        <div className={`mb-8 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border ${
          order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 
          order.status === 'Processing' ? 'bg-amber-50 border-amber-100 text-amber-900' : 
          'bg-blue-50 border-blue-100 text-blue-900'
        }`}>
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
              order.status === 'Delivered' ? 'bg-emerald-200 text-emerald-700' : 
              order.status === 'Processing' ? 'bg-amber-200 text-amber-700' : 
              'bg-blue-200 text-blue-700'
            }`}>
              {order.status === 'Delivered' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">
                {order.status === 'Delivered' ? 'Order Delivered Successfully' : `Order is ${order.status}`}
              </h2>
              <p className="text-sm opacity-80 font-medium">
                {order.status === 'Delivered' ? 'Your package was delivered on ' + new Date(order.date).toLocaleDateString() : 'We are getting your items ready.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" /> Items Ordered
              </h3>
              
              <div className="space-y-6">
                {mockProducts.map(product => (
                  <div key={product.id} className="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                      <h4 className="font-bold text-gray-900 leading-tight mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">Qty: {product.quantity}</p>
                        <p className="font-black text-gray-900">Rs. {(product.price * product.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Content: Summary & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Total Amount</span>
                <span className="text-2xl font-black text-rose-500">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" /> Delivery Details
              </h3>
              <div className="space-y-1 mb-6">
                <p className="font-bold text-gray-900">Home Address</p>
                <p className="text-sm text-gray-500">123 Tech Park Road, Sector B</p>
                <p className="text-sm text-gray-500">Islamabad, Pakistan</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">Phone: 0300 1234567</p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Payment Method
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Credit Card</p>
                    <p className="text-xs text-gray-500 font-mono">•••• 4242</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  )
}
