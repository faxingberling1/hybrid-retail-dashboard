"use client"

import React, { useState, useEffect } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import { useLoyaltyStore } from "@/lib/store/loyalty-store"
import { ArrowLeft, CreditCard, Banknote, Truck, CheckCircle2, ChevronRight, Loader2, MapPin, Tag, Clock, Save, Edit3, ShoppingBag, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [address, setAddress] = useState({
    street: "House L-52, Block 3, Gulshan-e-Iqbal",
    city: "Karachi",
    state: "Sindh",
    postalCode: "75300",
    phone: "0300 1234567"
  })
  const [tempAddress, setTempAddress] = useState({...address})

  // Delivery Schedule State
  const [deliverySchedule, setDeliverySchedule] = useState("asap")
  const schedules = [
    { id: "asap", label: "ASAP", desc: "30-45 mins", fee: 150 },
    { id: "today_evening", label: "Today", desc: "7:00 PM - 9:00 PM", fee: 50 },
    { id: "tomorrow_morning", label: "Tomorrow", desc: "9:00 AM - 12:00 PM", fee: 50 }
  ]

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    mobileNumber: ""
  })

  // Coupon State
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number, type: 'percent' | 'fixed'} | null>(null)
  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getCartTotal()
  
  // Delivery Fee Calculation
  const selectedSchedule = schedules.find(s => s.id === deliverySchedule)
  const deliveryFee = appliedCoupon?.code === 'FREEDEL' ? 0 : (selectedSchedule?.fee || 50)
  
  // Discount Calculation
  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = subtotal * (appliedCoupon.discount / 100)
    } else {
      discountAmount = appliedCoupon.discount
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discountAmount)
  
  // 5% back in points
  const pointsEarned = Math.floor(total * 0.05)

  const handleApplyCoupon = () => {
    setCouponError("")
    const code = couponCode.trim().toUpperCase()
    if (code === "WELCOME10") {
      setAppliedCoupon({ code, discount: 10, type: 'percent' })
    } else if (code === "FREEDEL") {
      setAppliedCoupon({ code, discount: 0, type: 'fixed' })
    } else if (code === "") {
      setCouponError("Please enter a code.")
    } else {
      setCouponError("Invalid or expired coupon.")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const handleSaveAddress = () => {
    setAddress({...tempAddress})
    setIsEditingAddress(false)
  }

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.phone) {
      alert("Please provide a complete delivery address.")
      return
    }

    if (paymentMethod === "card" && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
      alert("Please fill in your card details.")
      return
    }

    if ((paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && !paymentDetails.mobileNumber) {
      alert("Please provide your mobile wallet number.")
      return
    }

    setIsProcessing(true)
    
    // Calculate scheduled date based on selection
    let scheduledDate = new Date()
    if (deliverySchedule === "today_evening") {
      scheduledDate.setHours(19, 0, 0, 0)
    } else if (deliverySchedule === "tomorrow_morning") {
      scheduledDate.setDate(scheduledDate.getDate() + 1)
      scheduledDate.setHours(9, 0, 0, 0)
    }
    
    try {
      const response = await fetch('/api/storefront/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total_amount: total,
          delivery_fee: deliveryFee,
          discount_amount: discountAmount,
          payment_method: paymentMethod,
          shipping_address: address,
          scheduled_for: scheduledDate.toISOString(),
          coupon_code: appliedCoupon?.code
        })
      })

      if (!response.ok) throw new Error('Failed to create order')

      const order = await response.json()
      
      // Award Points
      useLoyaltyStore.getState().addPoints(pointsEarned)
      
      clearCart()
      router.push(`/storefront/thank-you/${order.id}`)
      
    } catch (error) {
      console.error(error)
      alert("Something went wrong while placing your order.")
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <main className="pb-24 pt-10 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <Truck className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-black mb-2 text-center text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/storefront" className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors">
          Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="pb-24 pt-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront/products" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Details */}
          <div className="flex-1 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-500" /> Delivery Address
                </h2>
                {!isEditingAddress && (
                  <button onClick={() => setIsEditingAddress(true)} className="text-sm font-bold text-rose-500 hover:underline flex items-center gap-1">
                    <Edit3 className="w-4 h-4" /> Change
                  </button>
                )}
              </div>
              
              {isEditingAddress ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Street Address</label>
                    <input type="text" value={tempAddress.street} onChange={e => setTempAddress({...tempAddress, street: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">City</label>
                      <input type="text" value={tempAddress.city} onChange={e => setTempAddress({...tempAddress, city: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</label>
                      <input type="text" value={tempAddress.phone} onChange={e => setTempAddress({...tempAddress, phone: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setIsEditingAddress(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSaveAddress} className="px-6 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-500/30 flex items-center gap-2 hover:bg-rose-600">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Home</p>
                    <p className="text-sm text-gray-600 mb-1">{address.street}, {address.city}</p>
                    <p className="text-sm text-gray-600 font-medium">{address.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" /> Delivery Time
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {schedules.map((schedule) => (
                  <button
                    key={schedule.id}
                    onClick={() => setDeliverySchedule(schedule.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      deliverySchedule === schedule.id 
                        ? 'border-amber-500 bg-amber-50 shadow-sm' 
                        : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-gray-900">{schedule.label}</span>
                      {deliverySchedule === schedule.id && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mb-2">{schedule.desc}</p>
                    <p className="text-xs font-bold text-gray-900">Fee: Rs. {schedule.fee}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-500" /> Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                </label>

                <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'easypaisa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-black text-xs">EP</div>
                      <div>
                        <p className="font-bold text-gray-900">Easypaisa</p>
                        <p className="text-xs text-gray-500">Mobile Wallet</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                  </div>
                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-4 pt-4 border-t border-indigo-100 animate-in fade-in">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mobile Number</label>
                      <input type="text" placeholder="03xx xxxxxxx" value={paymentDetails.mobileNumber} onChange={e => setPaymentDetails({...paymentDetails, mobileNumber: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  )}
                </label>

                <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'jazzcash' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-xs">JC</div>
                      <div>
                        <p className="font-bold text-gray-900">JazzCash</p>
                        <p className="text-xs text-gray-500">Mobile Wallet</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                  </div>
                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-4 pt-4 border-t border-indigo-100 animate-in fade-in">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mobile Number</label>
                      <input type="text" placeholder="03xx xxxxxxx" value={paymentDetails.mobileNumber} onChange={e => setPaymentDetails({...paymentDetails, mobileNumber: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  )}
                </label>

                <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Credit/Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard</p>
                      </div>
                    </div>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-indigo-500" />
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-indigo-100 grid grid-cols-2 gap-3 animate-in fade-in">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
                        <input type="text" placeholder="1234 5678 9101 1121" value={paymentDetails.cardNumber} onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Expiry</label>
                        <input type="text" placeholder="MM/YY" value={paymentDetails.expiry} onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">CVV</label>
                        <input type="text" placeholder="123" value={paymentDetails.cvv} onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-gray-900">Rs. {item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                {!appliedCoupon ? (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-emerald-500" /> Apply Promo Code
                    </h3>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. WELCOME10" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm uppercase font-bold text-gray-700" 
                      />
                      <button onClick={handleApplyCoupon} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors">Apply</button>
                    </div>
                    {couponError && <p className="text-rose-500 text-xs font-bold mt-2">{couponError}</p>}
                    <p className="text-xs text-gray-500 mt-2">Try <span className="font-bold text-emerald-600">WELCOME10</span> or <span className="font-bold text-emerald-600">FREEDEL</span></p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Tag className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-black uppercase">{appliedCoupon.code} Applied!</p>
                        <p className="text-xs text-emerald-600">
                          {appliedCoupon.type === 'percent' ? `${appliedCoupon.discount}% off your order` : `Free delivery applied`}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs font-bold text-emerald-700 hover:text-rose-500 underline">Remove</button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm font-bold text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>Discount</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-500">FREE</span>
                  ) : (
                    <span>Rs. {deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-rose-500">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Points Banner */}
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-[#ffc000] text-gray-900 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Earn {pointsEarned.toLocaleString()} Points</p>
                  <p className="text-xs text-amber-700">You'll receive these Hybrid Points after checkout to use on future orders.</p>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-rose-500 hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Place Order <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
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
    </main>
  )
}
