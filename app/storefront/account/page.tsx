"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import { useLocationStore } from '@/lib/store/location-store'
import { useUIStore } from '@/lib/store/ui-store'
import { useLoyaltyStore } from '@/lib/store/loyalty-store'
import { useCartStore } from '@/lib/store/cart-store'
import { Package, User, MapPin, Heart, Trophy, LogOut, ChevronRight, CreditCard, Briefcase, Home, CheckCircle2, Camera, ChevronDown, ChevronUp, RefreshCw, Clock, Users, Share2, Copy, Wallet, Ticket, ArrowDownRight, ArrowUpRight, Activity, Plus } from 'lucide-react'
import Link from 'next/link'
import { PaymentMethodsTab } from '@/components/storefront/payment-methods-tab'
import { usePaymentStore } from '@/lib/store/payment-store'

type Tab = 'orders' | 'profile' | 'addresses' | 'payments' | 'referrals' | 'vouchers' | 'wallet'

function AccountPageContent() {
  const { user, orders, isAuthenticated, logout, updateProfile } = useAuthStore()
  const locationStore = useLocationStore()
  const uiStore = useUIStore()
  const loyaltyStore = useLoyaltyStore()
  const { addItem } = useCartStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { walletBalance, transactions, topUpWallet, methods } = usePaymentStore()
  
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [topUpAmount, setTopUpAmount] = useState('1000')
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [selectedTopUpMethodId, setSelectedTopUpMethodId] = useState<string | null>(null)

  // Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  
  // Orders State
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  // Toast State
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: 'success'|'error'} | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated) {
      router.push('/storefront')
    } else if (user) {
      setProfileForm({ name: user.name, email: user.email, phone: '0300 1234567' })
    }
    
    // React to URL changes gracefully via searchParams
    const tab = searchParams.get('tab') as Tab
    if (tab) setActiveTab(tab)
  }, [isAuthenticated, router, user, searchParams])

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  if (!mounted || !isAuthenticated || !user) return null

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name: profileForm.name, email: profileForm.email })
    setIsEditingProfile(false)
  }



  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    updateProfile({ avatarUrl: undefined })
  }

  const handleBuyAgain = (orderId: string) => {
    addItem({
      id: `reorder-${orderId}`,
      name: `Items from Order ${orderId}`,
      price: 1500,
      image_url: null,
      stock: 50
    }, 1)
    uiStore.setCartOpen(true)
  }

  const handleRedeemPoints = () => {
    if (loyaltyStore.points >= 100) {
      loyaltyStore.claimReward(100, '10% Off Your Next Order', 10)
      setToastMessage({
        title: "Reward Claimed!",
        desc: "Successfully redeemed 100 points for a 10% discount.",
        type: 'success'
      })
    } else {
      setToastMessage({
        title: "Not Enough Points",
        desc: "You need at least 100 points to claim this reward.",
        type: 'error'
      })
    }
    
    // Auto-hide toast
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Points Card */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl mb-6">
              <div className="absolute right-0 top-0 w-64 h-64 bg-[#ffc000] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2 text-[#ffc000]">
                      <Trophy className="w-6 h-6" />
                      <span className="font-bold tracking-widest uppercase text-sm">Hybrid Rewards</span>
                    </div>
                    {/* Tier Badge */}
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                      loyaltyStore.getTier() === 'Platinum' ? 'bg-slate-100 text-slate-800 border-slate-300' :
                      loyaltyStore.getTier() === 'Gold' ? 'bg-[#ffc000]/20 text-[#ffc000] border-[#ffc000]/30' :
                      loyaltyStore.getTier() === 'Silver' ? 'bg-gray-400/20 text-gray-300 border-gray-400/30' :
                      'bg-orange-900/40 text-orange-400 border-orange-900/50'
                    }`}>
                      {loyaltyStore.getTier()} Member
                    </div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-2">{loyaltyStore.points} <span className="text-xl md:text-2xl text-gray-400 font-bold">Pts</span></h3>
                  <p className="text-gray-400 font-medium max-w-sm">You are a valued <span className="font-bold text-white">{loyaltyStore.getTier()}</span> member! Keep shopping to reach the next tier.</p>
                </div>
                <button onClick={handleRedeemPoints} className="px-6 py-3 bg-[#ffc000] text-slate-900 rounded-full font-black shadow-lg shadow-[#ffc000]/20 hover:scale-105 transition-transform">
                  Redeem Points
                </button>
              </div>
            </div>

            {/* Points History Ledger */}
            {loyaltyStore.history.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Points History</h3>
                <div className="space-y-3">
                  {loyaltyStore.history.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900">{event.reason}</p>
                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className={`font-black ${event.type === 'earned' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {event.type === 'earned' ? '+' : '-'}{event.amount} Pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  {orders.map(order => {
                    const isExpanded = expandedOrderId === order.id;
                    const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                    const currentStepIndex = steps.indexOf(order.status) >= 0 ? steps.indexOf(order.status) : 0;

                    return (
                      <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                        {/* Order Header */}
                        <div 
                          className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        >
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
                            <button className="p-2 text-gray-400 hover:text-gray-900 rounded-full transition-colors">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="p-5 md:p-6 border-t border-gray-100 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
                            
                            {/* Tracking Timeline */}
                            <div className="mb-8">
                              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Tracking</h5>
                              <div className="relative flex justify-between">
                                {/* Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
                                {/* Active Line */}
                                <div 
                                  className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>
                                
                                {steps.map((step, idx) => {
                                  const isCompleted = idx <= currentStepIndex;
                                  return (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full border-4 ${
                                        isCompleted ? 'bg-indigo-500 border-indigo-100 shadow-sm' : 'bg-gray-300 border-white'
                                      }`} />
                                      <span className={`text-[10px] md:text-xs font-bold absolute top-6 w-24 text-center ${
                                        isCompleted ? 'text-indigo-700' : 'text-gray-400'
                                      }`}>
                                        {step}
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-gray-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleBuyAgain(order.id) }}
                                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                              >
                                <RefreshCw className="w-4 h-4" /> Buy Again
                              </button>
                              <Link href={`/storefront/account/orders/${order.id}`} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-center">
                                View Order Details
                              </Link>
                            </div>

                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Profile Information</h2>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:opacity-75 transition-opacity" />
                  ) : (
                    <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-4xl font-black shadow-inner group-hover:bg-rose-200 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-center sm:text-left flex flex-col items-center sm:items-start gap-1">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
                    <p className="text-gray-500 text-sm mb-1">Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Change Picture</button>
                    {user.avatarUrl && (
                      <button onClick={handleRemoveAvatar} className="text-sm font-bold text-rose-500 hover:text-rose-600 hover:underline">Remove</button>
                    )}
                  </div>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSave} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 bg-gray-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email} 
                        onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 bg-gray-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                      <input 
                        type="text" 
                        value={profileForm.phone} 
                        onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-900 bg-gray-50" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-colors">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                      <p className="font-bold text-gray-900 text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                      <p className="font-bold text-gray-900 text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                      <p className="font-bold text-gray-900 text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">{profileForm.phone}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button onClick={() => setIsEditingProfile(true)} className="text-indigo-600 font-bold hover:underline">Edit Profile Info</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'addresses':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Saved Addresses</h2>
              <button 
                onClick={() => uiStore.setAddressModalOpen(true)}
                className="text-indigo-600 font-bold hover:underline"
              >
                Add New Address
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationStore.addresses.length === 0 ? (
                <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No addresses saved</h3>
                  <p className="text-gray-500 mb-6">Add an address for faster checkout.</p>
                  <button onClick={() => uiStore.setAddressModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">
                    Add Address
                  </button>
                </div>
              ) : (
                locationStore.addresses.map(addr => {
                  const isSelected = locationStore.selectedAddressId === addr.id
                  return (
                    <div key={addr.id} className={`bg-white rounded-2xl p-6 border-2 transition-all ${isSelected ? 'border-emerald-500 shadow-sm' : 'border-gray-100 shadow-sm'}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {addr.label.toLowerCase() === 'home' ? <Home className="w-5 h-5" /> : addr.label.toLowerCase() === 'work' ? <Briefcase className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-black ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>{addr.label}</h4>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{addr.street}</p>
                          <p className="text-sm text-gray-500">{addr.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => uiStore.setAddressModalOpen(true)} className="text-sm font-bold text-indigo-600 hover:underline">Manage</button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PaymentMethodsTab />
          </div>
        )

      case 'referrals':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-30"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-100 mb-2">
                    <Share2 className="w-6 h-6" />
                    <span className="font-bold tracking-widest uppercase text-sm">Refer & Earn</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Invite Friends, <br/>Earn <span className="text-[#ffc000]">Rs. 500</span> Each!</h3>
                  <p className="text-emerald-50 font-medium max-w-sm mb-6">Give your friends 10% off their first order, and you get Rs. 500 store credit when they checkout.</p>
                  
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 pl-4 rounded-xl border border-white/20 max-w-md">
                    <span className="font-mono text-sm tracking-widest flex-1 truncate">https://hybrid-retail.com/invite/hr-{user?.name.split(' ')[0].toLowerCase() || 'user'}</span>
                    <button 
                      onClick={() => {
                        setToastMessage({ title: 'Copied!', desc: 'Referral link copied to clipboard.', type: 'success' })
                        setTimeout(() => setToastMessage(null), 3000)
                      }} 
                      className="px-4 py-2 bg-white text-emerald-700 rounded-lg font-bold shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-3xl font-black text-gray-900 mb-1">5</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Friends Joined</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <h4 className="text-3xl font-black text-gray-900 mb-1">Rs. 2,500</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Earned</p>
              </div>
            </div>
          </div>
        )

      case 'vouchers':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">My Vouchers</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">You don't have any active vouchers right now. Keep shopping to earn exciting discounts!</p>
            </div>
          </div>
        )

      case 'wallet':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 border border-gray-100 shadow-xl text-center relative overflow-hidden text-white">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Wallet className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Hybrid Wallet</h3>
                <p className="text-indigo-200 mb-2 max-w-md mx-auto text-sm font-medium">Use wallet balance for instant, 1-click checkouts.</p>
                <h4 className="text-5xl font-black text-white mb-8 mt-4">
                  <span className="text-2xl text-indigo-300 mr-2">Rs.</span>
                  {walletBalance.toLocaleString()}
                </h4>
                
                <div className="max-w-xs mx-auto flex flex-col gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-indigo-900 font-black">Rs.</span>
                    <input 
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full bg-white text-indigo-900 font-black text-lg p-3 pl-12 rounded-xl outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const amount = parseInt(topUpAmount)
                      if (!isNaN(amount) && amount > 0) {
                        if (methods.length > 0) {
                          setSelectedTopUpMethodId(methods.find(m => m.isDefault)?.id || methods[0].id)
                        } else {
                          setSelectedTopUpMethodId(null)
                        }
                        setIsTopUpModalOpen(true)
                      }
                    }}
                    className="w-full py-4 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-600 transition-colors shadow-lg"
                  >
                    Top Up Wallet
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-500" /> Wallet History
              </h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">No transactions yet</h4>
                  <p className="text-gray-500 text-sm">Your wallet history will appear here once you make a top-up or purchase.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === 'purchase' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                          {tx.type === 'purchase' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight">
                            {tx.type === 'top_up' ? 'Top Up' : tx.type === 'refund' ? 'Reimbursed / Refund' : 'Purchase'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{new Date(tx.date).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{tx.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className={`font-black ${tx.type === 'purchase' ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {tx.type === 'purchase' ? '-' : '+'} Rs. {Math.abs(tx.amount).toLocaleString()}
                        </h4>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          tx.type === 'top_up' ? 'bg-indigo-50 text-indigo-600' : 
                          tx.type === 'refund' ? 'bg-amber-50 text-amber-600' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
            ) : (
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight truncate max-w-[150px]">{user.name}</h3>
              <p className="text-sm text-gray-500 truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" /> Orders
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" /> Profile Info
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'addresses' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" /> Addresses
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'payments' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" /> Payment Methods
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'payments' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('referrals')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'referrals' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" /> Refer & Earn
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'referrals' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('vouchers')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'vouchers' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5" /> Vouchers
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'vouchers' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'wallet' ? 'bg-[#ffc000]/10 text-slate-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5" /> Your Wallet
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'wallet' ? 'text-[#ffc000]' : 'text-gray-300'}`} />
            </button>
            <Link href="/storefront/wishlist" className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-colors">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" /> Wishlist
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          </div>

          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
        
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-8 z-50 p-6 rounded-2xl shadow-2xl border flex gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            toastMessage.type === 'success' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'
          }`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg leading-tight mb-1">{toastMessage.title}</h4>
            <p className="text-sm font-medium opacity-80">{toastMessage.desc}</p>
          </div>
        </div>
      )}


      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <LogOut className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2 tracking-tight">Sign Out</h3>
            <p className="text-center text-gray-500 font-medium mb-8">
              Are you sure you want to sign out of your account? You will need to log back in to access your orders and rewards.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsLogoutModalOpen(false)
                  logout()
                }}
                className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-rose-500/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Wallet Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Select Payment Method</h3>
            <p className="text-center text-gray-500 font-medium mb-6">
              Choose a card to top up Rs. {parseInt(topUpAmount || '0').toLocaleString()}
            </p>
            
            <div className="space-y-3 mb-6">
              {methods.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100 mb-2">
                  <p className="text-gray-500 text-sm">No saved cards.</p>
                </div>
              ) : (
                methods.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedTopUpMethodId(m.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedTopUpMethodId === m.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
                  >
                    <CreditCard className={`w-5 h-5 ${selectedTopUpMethodId === m.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="text-left flex-1">
                      <p className={`font-bold leading-tight ${selectedTopUpMethodId === m.id ? 'text-indigo-900' : 'text-gray-900'}`}>{m.label}</p>
                      <p className={`text-xs font-mono tracking-widest mt-0.5 ${selectedTopUpMethodId === m.id ? 'text-indigo-600/70' : 'text-gray-500'}`}>
                        •••• {m.cardNumber}
                      </p>
                    </div>
                    {selectedTopUpMethodId === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 ml-auto" />
                    )}
                  </button>
                ))
              )}
              
              <button 
                onClick={() => {
                  setIsTopUpModalOpen(false)
                  setActiveTab('payments')
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              >
                <Plus className="w-5 h-5" /> Add New Card
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsTopUpModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (methods.length > 0 && selectedTopUpMethodId) {
                    const amount = parseInt(topUpAmount)
                    if (!isNaN(amount) && amount > 0) {
                      topUpWallet(amount, `Topped up via ${methods.find(m => m.id === selectedTopUpMethodId)?.label} ending in ${methods.find(m => m.id === selectedTopUpMethodId)?.cardNumber}`);
                      setToastMessage({ title: "Wallet Topped Up", desc: `Added Rs. ${amount.toLocaleString()} to your wallet`, type: "success" });
                      setTopUpAmount('1000');
                      setIsTopUpModalOpen(false);
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  } else if (methods.length === 0) {
                    setIsTopUpModalOpen(false)
                    setActiveTab('payments')
                  }
                }}
                className={`flex-1 py-3 font-bold rounded-xl transition-colors ${methods.length === 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'}`}
                disabled={methods.length > 0 && !selectedTopUpMethodId}
              >
                {methods.length === 0 ? 'Add Card' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountPageContent />
    </Suspense>
  )
}
