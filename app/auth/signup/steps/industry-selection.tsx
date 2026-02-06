// app/auth/signup/steps/industry-selection.tsx
'use client'

import {
  Pill,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Home,
  Utensils,
  Car,
  Building2,
  Factory,
  Coffee,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const INDUSTRIES = [
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Manage medications, prescriptions, and patient records',
    icon: Pill,
    playful: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100',
    galactic: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20',
    features: ['Prescription Management', 'Inventory Tracking']
  },
  {
    id: 'fashion',
    name: 'Fashion & Retail',
    description: 'Track inventory, manage orders, and analyze trends',
    icon: ShoppingBag,
    playful: 'bg-pink-50 text-pink-600 border-pink-100 group-hover:bg-pink-100',
    galactic: 'bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:bg-pink-500/20',
    features: ['Inventory Management', 'Trend Analysis']
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    description: 'Menu management, table reservations, and orders',
    icon: Utensils,
    playful: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100',
    galactic: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20',
    features: ['Menu Management', 'Table Reservations']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Patient management, appointments, and records',
    icon: Stethoscope,
    playful: 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-100',
    galactic: 'bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-500/20',
    features: ['Patient Records', 'Appointment Scheduling']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Manage students, courses, and resources',
    icon: GraduationCap,
    playful: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100',
    galactic: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20',
    features: ['Student Management', 'Course Scheduling']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property management, listings, and clients',
    icon: Home,
    playful: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100',
    galactic: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/20',
    features: ['Property Listings', 'Client CRM']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Vehicle inventory, service, and customers',
    icon: Car,
    playful: 'bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-slate-100',
    galactic: 'bg-slate-500/10 text-slate-400 border-slate-500/20 group-hover:bg-slate-500/20',
    features: ['Vehicle Inventory', 'Service Records']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production planning and supply chain',
    icon: Factory,
    playful: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100',
    galactic: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20',
    features: ['Production Planning', 'Supply Chain']
  }
]

export default function IndustrySelection({ formData, updateFormData, theme }: any) {
  const isGalactic = theme === 'galactic'

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Select Your Industry</h2>
        <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
          Choose your business type to customize your experience. You can change this later in settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INDUSTRIES.map((industry) => {
          const Icon = industry.icon
          const isSelected = formData.industry === industry.id

          return (
            <motion.button
              key={industry.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => updateFormData({ industry: industry.id })}
              className={`group p-6 rounded-[2rem] border-2 text-left transition-all duration-300 relative overflow-hidden ${isSelected
                ? (isGalactic ? 'bg-white text-black border-white shadow-2xl' : 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10')
                : (isGalactic ? 'bg-white/5 border-white/5 hover:border-white/20' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm')
                }`}
            >
              <div className="flex items-start gap-5 relative z-10">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-black/10' : (isGalactic ? industry.galactic : industry.playful)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg tracking-tight">{industry.name}</h3>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-3 h-3 rounded-full ${isGalactic ? 'bg-black' : 'bg-sky-400'}`} />
                    )}
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isSelected ? (isGalactic ? 'text-black/60' : 'text-white/60') : 'text-slate-400'}`}>
                    {industry.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {industry.features.map(feature => (
                      <span
                        key={feature}
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isSelected ? (isGalactic ? 'bg-black/5 text-black' : 'bg-white/20 text-white') : (isGalactic ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500')}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {formData.industry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 border rounded-[2rem] flex items-center space-x-5 ${isGalactic ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}
          >
            <div className={`p-2 rounded-xl ${isGalactic ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight leading-none">
                {INDUSTRIES.find(i => i.id === formData.industry)?.name} Selected
              </p>
              <p className="text-xs font-bold opacity-70 mt-1 uppercase tracking-tighter">
                Setting up specialized tools for your business.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}