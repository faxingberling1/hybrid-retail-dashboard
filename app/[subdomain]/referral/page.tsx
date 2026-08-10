"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gift, Copy, Check, Share2, Users, Coins } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "HYBRID-ZAH-2026"

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Refer & Earn</h1>
        </div>

        {/* Hero Section */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden mb-8 shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Give Rs. 500,<br />Get Rs. 500
            </h2>
            <p className="text-slate-300 text-lg max-w-md mx-auto mb-10">
              Invite your friends to shop at Hybrid Retail. They get Rs. 500 off their first order, and you get Rs. 500 in Hybrid Points!
            </p>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full max-w-md">
              <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">Your Unique Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white p-4 rounded-xl text-center border-2 border-dashed border-slate-300">
                  <span className="text-2xl font-black text-slate-900 tracking-wider">{referralCode}</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`h-[68px] px-6 rounded-xl font-bold flex items-center gap-2 transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                >
                  {copied ? <><Check className="w-5 h-5" /> Copied</> : <><Copy className="w-5 h-5" /> Copy</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-xl font-black text-slate-900 mb-8 text-center">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-1/6 right-1/6 h-0.5 bg-slate-100 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">1. Share Code</h4>
              <p className="text-sm text-slate-500">Send your unique code to friends and family.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">2. Friend Shops</h4>
              <p className="text-sm text-slate-500">They get Rs. 500 off on their first purchase over Rs. 2000.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-[#ffc000]/20 text-[#d4a000] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#ffc000] group-hover:text-slate-900 transition-colors">
                <Coins className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">3. You Earn</h4>
              <p className="text-sm text-slate-500">You receive 500 Hybrid Points instantly in your account!</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
