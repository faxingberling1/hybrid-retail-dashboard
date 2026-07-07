import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PromoBanner() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container (Glassmorphism) */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
        <div className="max-w-xl mb-6 md:mb-0">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            Weekend Special
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
            Fresh Groceries, <br className="hidden md:block"/> Delivered to Your Door.
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-sm max-w-md">
            Get up to 40% off on all organic produce and daily essentials. Limited time only.
          </p>
        </div>
        
        <Link 
          href="/storefront"
          className="flex-shrink-0 flex items-center justify-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-full font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-indigo-50 transition-all group"
        >
          Shop The Sale
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
