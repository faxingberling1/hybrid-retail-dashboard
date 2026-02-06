// app/auth/signup/steps/two-factor-setup.tsx
'use client'

import { useState, useEffect } from 'react'
import { Shield, Smartphone, ChevronRight, Check, AlertCircle, RefreshCcw, Key } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function TwoFactorSetup({ formData, updateFormData, theme }: any) {
    const [setupMode, setSetupMode] = useState<'intro' | 'qr' | 'verify'>('intro')
    const [verificationCode, setVerificationCode] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const isGalactic = theme === 'galactic'

    const inputClasses = `w-full px-6 py-4 rounded-2xl border-2 text-center text-2xl font-black tracking-[0.5em] transition-all duration-300 outline-none ${isGalactic
        ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:bg-white/10'
        : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-sky-500/50 focus:bg-white'
        }`

    const handleVerify = () => {
        if (verificationCode.length !== 6) {
            toast.error('Verification code must be 6 digits')
            return
        }

        setIsVerifying(true)
        // Simulate API verification
        setTimeout(() => {
            setIsVerifying(false)
            updateFormData({ twoFactorEnabled: true, twoFactorVerified: true })
            toast.success('Security Protocol Established: 2FA Active')
        }, 1500)
    }

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h2 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Account Security</h2>
                <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                    Secure your administrator account with two-factor authentication. This provides an extra layer of protection.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {setupMode === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-10 rounded-[2.5rem] border-2 flex flex-col items-center text-center space-y-8 ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'
                            }`}
                    >
                        <div className={`p-6 rounded-3xl ${isGalactic ? 'bg-violet-500/20 text-violet-400' : 'bg-sky-100 text-sky-600'}`}>
                            <Shield className="w-12 h-12" />
                        </div>

                        <div className="space-y-4 max-w-sm">
                            <h3 className={`text-xl font-black italic tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Recommended Security</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                We strongly recommend enabling 2FA for all administrator accounts to prevent unauthorized access.
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSetupMode('qr')}
                            className={`px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 ${isGalactic ? 'bg-violet-600 text-white' : 'bg-slate-900 text-white shadow-lg'
                                }`}
                        >
                            <span>Initialize Setup</span>
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                )}

                {setupMode === 'qr' && (
                    <motion.div
                        key="qr"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className={`p-8 rounded-[2.5rem] border-2 grid md:grid-cols-2 gap-10 items-center ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'
                            }`}>
                            <div className="flex flex-col items-center space-y-6">
                                <div className={`p-6 bg-white rounded-3xl border-4 ${isGalactic ? 'border-violet-500/30' : 'border-slate-100'}`}>
                                    {/* Simulated QR Code */}
                                    <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-1">
                                            {[...Array(16)].map((_, i) => (
                                                <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${isGalactic ? 'bg-violet-500/10 text-violet-400' : 'bg-slate-100 text-slate-500'}`}>
                                    Secret Code: ABCD-1234-EFGH
                                </div>
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <h4 className={`text-base font-black italic tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Scan with Authenticator</h4>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                        Open your 2FA app (like Google Authenticator or Authy) and scan the QR code to connect your account.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-500 opacity-60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>ENCRYPTION ACTIVE</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSetupMode('verify')}
                                        className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 ${isGalactic ? 'bg-violet-600 text-white' : 'bg-slate-900 text-white shadow-lg'
                                            }`}
                                    >
                                        <span>I've Scanned the Code</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {setupMode === 'verify' && (
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-10 rounded-[2.5rem] border-2 flex flex-col items-center text-center space-y-8 ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'
                            }`}
                    >
                        <div className={`p-6 rounded-3xl ${isGalactic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Smartphone className={`w-12 h-12 ${formData.twoFactorVerified ? 'animate-bounce' : ''}`} />
                        </div>

                        <div className="space-y-6 w-full max-w-xs">
                            <div className="space-y-2">
                                <h3 className={`text-xl font-black italic tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Verify Service</h3>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-tighter">Enter the 6-digit code from your app</p>
                            </div>

                            <div className="space-y-6">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    className={inputClasses}
                                    disabled={formData.twoFactorVerified || isVerifying}
                                />

                                {!formData.twoFactorVerified ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleVerify}
                                        disabled={isVerifying || verificationCode.length !== 6}
                                        className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 group ${isGalactic ? 'bg-violet-600 text-white' : 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
                                            } disabled:opacity-50`}
                                    >
                                        {isVerifying ? (
                                            <RefreshCcw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Establish Security Link</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                ) : (
                                    <div className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 ${isGalactic ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        }`}>
                                        <Check className="w-5 h-5" />
                                        <span>Security Protocol Active</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.twoFactorVerified && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-6 rounded-[2rem] border w-full flex items-center space-x-4 ${isGalactic ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${isGalactic ? 'bg-violet-500/20 text-violet-400' : 'bg-sky-100 text-sky-600'}`}>
                                    <Key className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Recovery Hash Generated</p>
                                    <p className={`text-[11px] font-bold font-mono ${isGalactic ? 'text-violet-300' : 'text-slate-700'}`}>HVX-92K-WLP-0X2</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
