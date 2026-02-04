// app/auth/signup/steps/business-details.tsx
'use client'

import { useState } from 'react'
import { Building2, Users, MapPin, Clock, Info } from 'lucide-react'
import { motion } from 'framer-motion'

const BUSINESS_TYPES = [
  'Sole Proprietorship', 'Partnership', 'LLC', 'Corporation', 'Other'
]

const EMPLOYEE_RANGES = [
  '1-10', '11-50', '51-200', '201-500', '501+'
]

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Pakistan', 'Germany', 'France', 'Other'
]

export default function BusinessDetails({ formData, updateFormData, theme }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isGalactic = theme === 'galactic'

  const inputClasses = `w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 outline-none font-medium ${isGalactic
    ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/10'
    : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-sky-500/50 focus:bg-white'
    }`

  const labelClasses = `block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isGalactic ? 'text-slate-400' : 'text-slate-500'
    }`

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }
    if (!value.trim()) {
      newErrors[field] = 'Required Parameter Missing'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Business Details</h2>
        <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
          Tell us about your company. This helps us tailor your dashboard.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Business Name */}
        <div className="space-y-2">
          <label className={labelClasses}>
            <div className="flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-2 opacity-50" />
              Business Name
            </div>
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => {
              updateFormData({ businessName: e.target.value })
              validateField('businessName', e.target.value)
            }}
            className={inputClasses}
            placeholder="e.g. Nexus Dynamics Corp"
          />
          {errors.businessName && (
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter ml-2">{errors.businessName}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Business Type */}
          <div className="space-y-2">
            <label className={labelClasses}>Business Type</label>
            <div className="relative">
              <select
                value={formData.businessType}
                onChange={(e) => {
                  updateFormData({ businessType: e.target.value })
                  validateField('businessType', e.target.value)
                }}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="" disabled className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>Select type...</option>
                {BUSINESS_TYPES.map(type => (
                  <option key={type} value={type} className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>{type}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
              </div>
            </div>
          </div>

          {/* Employee Count */}
          <div className="space-y-2">
            <label className={labelClasses}>Number of Employees</label>
            <div className="relative">
              <select
                value={formData.employees}
                onChange={(e) => updateFormData({ employees: e.target.value })}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                {EMPLOYEE_RANGES.map(range => (
                  <option key={range} value={range} className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>{range} Employees</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Country */}
          <div className="space-y-2">
            <label className={labelClasses}>Country / Region</label>
            <div className="relative">
              <select
                value={formData.country}
                onChange={(e) => {
                  updateFormData({ country: e.target.value })
                  validateField('country', e.target.value)
                }}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="" disabled className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>Select region...</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country} className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>{country}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Timezone (simplified) */}
          <div className="space-y-2">
            <label className={labelClasses}>Timezone</label>
            <div className="relative">
              <select
                value={formData.timezone}
                onChange={(e) => updateFormData({ timezone: e.target.value })}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="UTC" className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>Global (UTC)</option>
                <option value="PST" className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>Pacific (PST)</option>
                <option value="EST" className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>Eastern (EST)</option>
                <option value="GMT" className={isGalactic ? 'bg-[#020412]' : 'bg-white'}>London (GMT)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {formData.industry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-6 border rounded-[2rem] flex items-center space-x-5 ${isGalactic ? 'bg-violet-500/10 border-violet-500/20' : 'bg-sky-50 border-sky-100'}`}
        >
          <div className={`p-2 rounded-xl ${isGalactic ? 'bg-violet-500/20 text-violet-400' : 'bg-sky-100 text-sky-600'}`}>
            <Info className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-slate-500">
            Setting up {formData.industry} tools for your {formData.businessType || 'business'}.
          </p>
        </motion.div>
      )}
    </div>
  )
}