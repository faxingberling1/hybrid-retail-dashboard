"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield, Lock, Key, ArrowRight, CheckCircle,
    AlertCircle, RefreshCw, Eye, EyeOff, Sparkles
} from "lucide-react"
import Link from "next/link"

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

function ResetPasswordFormContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    // For OTP flow
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [isOtpFlow, setIsOtpFlow] = useState(false)

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setIsOtpFlow(true)
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError("Password synchronization failed. Keys do not match.")
            return
        }

        if (newPassword.length < 6) {
            setError("Security Requirement: Key must be at least 6 characters.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    otp,
                    identifier,
                    newPassword
                })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => router.push('/login'), 3000)
            } else {
                setError(data.error || "Reset protocol failed.")
            }
        } catch (err) {
            setError("Connection interrupt: Reset could not be completed.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence mode="wait">
            {!success ? (
                <MotionDiv
                    key="reset-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Define New Key</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Establish Secure Credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isOtpFlow && (
                            <div className="space-y-4 pt-2">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Registered Phone</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <input
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder="+92 3XX XXXXXXX"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/30 focus:bg-white/10 rounded-[1.5rem] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Verification Code</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                                            <Key className="h-4 w-4" />
                                        </div>
                                        <input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="6-Digit OTP"
                                            maxLength={6}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/30 focus:bg-white/10 rounded-[1.5rem] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600 tracking-[0.5em] font-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">New Secure Key</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/30 focus:bg-white/10 rounded-[1.5rem] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Confirm Secure Key</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/30 focus:bg-white/10 rounded-[1.5rem] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <MotionDiv
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 text-rose-400"
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-tight leading-relaxed">{error}</p>
                            </MotionDiv>
                        )}

                        <MotionButton
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center group shadow-xl shadow-white/5 hover:bg-slate-50 transition-all border border-transparent"
                        >
                            {isLoading ? (
                                <RefreshCw className="h-5 w-5 animate-spin text-slate-900" />
                            ) : (
                                <>
                                    <span>Update Protocol</span>
                                    <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </MotionButton>
                    </form>
                </MotionDiv>
            ) : (
                <MotionDiv
                    key="reset-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 py-4"
                >
                    <div className="flex justify-center">
                        <div className="relative">
                            <MotionDiv
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"
                            />
                            <div className="relative h-20 w-20 bg-blue-500/10 border border-blue-500/30 rounded-3xl flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Key Re-Established</h3>
                        <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto">
                            Security parameters updated. Redirecting to access terminal...
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 opacity-30 mt-8">
                        <Sparkles className="h-3 w-3 text-sky-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white italic">Vault Secure</span>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <MotionDiv
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-500/10 blur-[130px] rounded-full"
                />
                <MotionDiv
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-500/10 blur-[130px] rounded-full"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-10 space-y-4">
                    <div className="flex items-center space-x-3 group">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10 transition-transform duration-500">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">HybridPOS</span>
                    </div>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl p-1 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="bg-slate-950/40 p-10 rounded-[2.25rem]">
                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initializing Terminal...</p>
                            </div>
                        }>
                            <ResetPasswordFormContent />
                        </Suspense>
                    </div>
                </div>

                <div className="mt-8 text-center px-4">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                        All sessions strictly monitored for anomalies.
                    </p>
                </div>
            </MotionDiv>
        </div>
    )
}
