// app/auth/signup/steps/confirmation.tsx
'use client'

import { CheckCircle2, Shield, FileText, Bell, Check, Info } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Confirmation({ formData, updateFormData, theme }: any) {
  const isGalactic = theme === 'galactic'

  const sectionClasses = `p-8 rounded-[2rem] border-2 ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'
    }`

  const labelClasses = `text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1`
  const valueClasses = `font-black text-sm tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Final Review</h2>
        <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
          Review your details and agree to the terms to finish setting up your account.
        </p>
      </div>

      <div className="space-y-8">
        {/* Summary Card */}
        <div className={sectionClasses}>
          <div className="flex items-center space-x-3 mb-8">
            <div className={`p-2 rounded-xl ${isGalactic ? 'bg-violet-500/10 text-violet-400' : 'bg-sky-100 text-sky-600'}`}>
              <Info className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account Summary</span>
          </div>

          <div className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className={labelClasses}>Business Name</p>
                <p className={valueClasses}>{formData.businessName}</p>
              </div>
              <div>
                <p className={labelClasses}>Industry</p>
                <p className={valueClasses + " capitalize"}>{formData.industry}</p>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/5" />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className={labelClasses}>Admin Name</p>
                <p className={valueClasses}>{formData.adminName}</p>
              </div>
              <div>
                <p className={labelClasses}>Email Address</p>
                <p className={valueClasses}>{formData.adminEmail}</p>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-white/5" />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className={labelClasses}>Security Level</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${formData.twoFactorVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                  <p className={valueClasses}>
                    {formData.twoFactorVerified ? '2FA Enabled & Verified' : 'Standard Protection'}
                  </p>
                </div>
              </div>
              {formData.twoFactorVerified && (
                <div>
                  <p className={labelClasses}>Recovery Method</p>
                  <p className={valueClasses}>Recovery Hash Generated</p>
                </div>
              )}
            </div>

            {formData.userEmails.length > 0 && (
              <>
                <div className="h-px bg-slate-200 dark:bg-white/5" />
                <div>
                  <p className={labelClasses}>Team Members ({formData.userEmails.length})</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.userEmails.slice(0, 3).map((email: string, i: number) => (
                      <span key={i} className={`text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full ${isGalactic ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                        {email}
                      </span>
                    ))}
                    {formData.userEmails.length > 3 && (
                      <span className="text-[9px] font-black text-slate-400 self-center">+{formData.userEmails.length - 3} More</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4 px-2">
          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${formData.termsAccepted
                ? (isGalactic ? 'bg-violet-600 border-violet-600 shadow-lg shadow-violet-500/20' : 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10')
                : (isGalactic ? 'bg-white/5 border-white/10 group-hover:border-white/20' : 'bg-white border-slate-200 group-hover:border-slate-300')
                }`}>
                {formData.termsAccepted && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <span className={`text-[11px] font-bold leading-relaxed ${isGalactic ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-800'}`}>
              Accept global <span className={isGalactic ? 'text-violet-400 underline underline-offset-4' : 'text-sky-600 underline underline-offset-4'}>Terms of Operation</span> and data privacy protocols. All activity will be encrypted within the vault.
            </span>
          </label>

          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={formData.marketingEmails}
                onChange={(e) => updateFormData({ marketingEmails: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${formData.marketingEmails
                ? (isGalactic ? 'bg-violet-600 border-violet-600 shadow-lg shadow-violet-500/20' : 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10')
                : (isGalactic ? 'bg-white/5 border-white/10 group-hover:border-white/20' : 'bg-white border-slate-200 group-hover:border-slate-300')
                }`}>
                {formData.marketingEmails && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <span className={`text-[11px] font-bold leading-relaxed ${isGalactic ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-800'}`}>
              Establish synchronization for intelligence updates, feature briefings, and ecosystem optimizations.
            </span>
          </label>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Vault Ready', desc: 'GDPR & SSL v3 Active', color: 'blue' },
            { icon: CheckCircle2, title: '14D Ignition', desc: 'Full Feature Unlock', color: 'green' },
            { icon: Bell, title: '24/7 Direct', desc: 'Operator Support Node', color: 'purple' }
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <item.icon className="w-4 h-4 text-slate-400" />
                <p className={`text-[9px] font-black uppercase tracking-widest ${isGalactic ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}