// app/auth/signup/steps/admin-setup.tsx
'use client'

import { useState } from 'react'
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X, ShieldCheck, Sparkles } from 'lucide-react'
import { validatePasswordStrength } from '@/lib/auth-utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSetup({ formData, updateFormData, theme }: any) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] as string[] })
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
      newErrors[field] = 'Required'
    } else if (field === 'adminEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newErrors[field] = 'Invalid Protocol'
    } else {
      delete newErrors[field]
    }
    setErrors(newErrors)
  }

  const handlePasswordChange = (password: string) => {
    updateFormData({ adminPassword: password })
    const strength = validatePasswordStrength(password)
    setPasswordStrength(strength)
    validateField('adminPassword', password)
  }

  const getPasswordStrengthColor = () => {
    if (!formData.adminPassword) return isGalactic ? 'bg-white/10' : 'bg-slate-200'
    if (formData.adminPassword.length < 8) return 'bg-rose-500'
    if (passwordStrength.isValid) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
    return 'bg-amber-500'
  }

  const passwordRequirements = [
    { text: '8+ Characters', met: formData.adminPassword?.length >= 8 },
    { text: 'Uppercase', met: /[A-Z]/.test(formData.adminPassword || '') },
    { text: 'Number', met: /[0-9]/.test(formData.adminPassword || '') },
    { text: 'Symbol', met: /[^A-Za-z0-9]/.test(formData.adminPassword || '') }
  ]

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Admin Account</h2>
        <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
          Create your administrator account to manage your organization.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Full Name */}
        <div className="space-y-2">
          <label className={labelClasses}>Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={formData.adminName}
              onChange={(e) => {
                updateFormData({ adminName: e.target.value })
                validateField('adminName', e.target.value)
              }}
              className={`${inputClasses} ${errors.adminName ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
              placeholder="e.g. Commander Shepard"
            />
            <User className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className={labelClasses}>Primary Auth Node (Email)</label>
          <div className="relative">
            <input
              type="email"
              value={formData.adminEmail}
              onChange={(e) => {
                updateFormData({ adminEmail: e.target.value })
                validateField('adminEmail', e.target.value)
              }}
              className={`${inputClasses} ${errors.adminEmail ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
              placeholder="admin@nexus-dynamics.io"
            />
            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Password */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={labelClasses}>Encryption Key (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.adminPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`${inputClasses} pr-14 ${errors.adminPassword ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
                  placeholder="Secure protocol..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Strength Bar */}
            <div className="space-y-3 px-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Key Strength</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${passwordStrength.isValid ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {formData.adminPassword ? (passwordStrength.isValid ? 'Vault Grade' : 'Vulnerable') : 'Awaiting Input'}
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isGalactic ? 'bg-white/5' : 'bg-slate-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((formData.adminPassword.length / 12) * 100, 100)}%` }}
                  className={`h-full transition-colors duration-500 ${getPasswordStrengthColor()}`}
                />
              </div>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className={`p-6 rounded-[2rem] border-2 ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <label className={labelClasses}>Security Protocols</label>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all duration-500 ${req.met ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-white/10'}`}>
                    {req.met && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${req.met ? (isGalactic ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`p-8 border rounded-[2.5rem] flex items-center space-x-6 ${isGalactic ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
        <div className={`p-3 rounded-2xl ${isGalactic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Admin Protocol Confirmed</h4>
          <p className="text-[10px] font-bold text-slate-500 mt-1 leading-relaxed uppercase tracking-tighter">
            Establishing biometric simulation and master key encryption. Your identity will be the root node of the {formData.businessName || 'Business'} ecosystem.
          </p>
        </div>
      </div>
    </div>
  )
}