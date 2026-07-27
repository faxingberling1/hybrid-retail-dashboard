"use client"

import { motion } from "framer-motion"
import { Store, Pill, Laptop, Shirt, Utensils, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const industries = [
  { id: "grocery", name: "Grocery Store", icon: Store, description: "Supermarkets, convenience stores, and specialized food retailers.", recommended: true },
  { id: "pharmacy", name: "Pharmacy & Health", icon: Pill, description: "Pharmacies, clinics, and health supplement stores.", recommended: false },
  { id: "electronics", name: "Electronics", icon: Laptop, description: "Consumer electronics, gadgets, and home appliance stores.", recommended: false },
  { id: "fashion", name: "Fashion & Apparel", icon: Shirt, description: "Clothing, footwear, and accessory boutiques.", recommended: false },
  { id: "restaurant", name: "Restaurants & Cafes", icon: Utensils, description: "Dine-in, takeout, and coffee shop establishments.", recommended: false },
]

export default function StorefrontLandingPage() {
  const router = useRouter()

  const handleSelect = (id: string) => {
    router.push(`/storefront/${id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100"
      >
        <div className="p-8 md:p-12 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Select Your Industry
          </motion.h2>
          <motion.p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Welcome! To tailor your experience perfectly to your business needs, please choose your primary industry below.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-left">
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <motion.div
                  key={industry.id}
                  onClick={() => handleSelect(industry.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    industry.recommended ? "border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100" : "border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  {industry.recommended && (
                    <span className="absolute -top-3 left-6 px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${industry.recommended ? "bg-white text-rose-500 shadow-sm" : "bg-gray-100 text-gray-600 group-hover:bg-white group-hover:shadow-sm group-hover:text-gray-900 transition-colors"}`}>
                      <Icon size={24} />
                    </div>
                    <ChevronRight className={`text-gray-300 transition-transform duration-300 group-hover:translate-x-1 ${industry.recommended ? "group-hover:text-rose-500" : "group-hover:text-gray-500"}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{industry.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}