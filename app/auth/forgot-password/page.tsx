"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield, Mail, Smartphone, ArrowRight, ArrowLeft,
    CheckCircle, Sparkles, AlertCircle, RefreshCw
} from "lucide-react"
import Link from "next/link"

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export default function ForgotPasswordPage() {
    const [method, setMethod] = useState<"email" | "phone">("email")
    const [identifier, setIdentifier] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!identifier) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method, identifier })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
            } else {
                setError(data.error || "Failed to process request")
            }
        } catch (err) {
            setError("Connection protocol failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <MotionDiv
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-sky-500/10 blur-[120px] rounded-full"
                />
                <MotionDiv
                    animate={{ scale: [1.2, 1, 1.2], rotate: [0, -5, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full"
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
                    <Link href="/login" className="flex items-center space-x-3 group">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">HybridPOS</span>
                    </Link>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl p-1 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                    <div className="bg-slate-950/40 p-10 rounded-[2.25rem]">
                        <AnimatePresence mode="wait">
                            {!success ? (
                                <MotionDiv
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Access Recovery</h2>
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Initialize Security Protocol</p>
                                    </div>

                                    {/* Method Selector */}
                                    <div className="p-1.5 bg-white/5 rounded-2xl flex border border-white/5">
                                        {[
                                            { id: 'email', label: 'Email', icon: Mail },
                                            { id: 'phone', label: 'Phone', icon: Smartphone }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setMethod(t.id as any);
                                                    setIdentifier("");
                                                    setError(null);
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === t.id
                                                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                                    : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                <t.icon className="h-3.5 w-3.5" />
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">
                                                {method === 'email' ? 'Registered Email' : 'Mobile Number'}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors">
                                                    {method === 'email' ? <Mail className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                                                </div>
                                                <input
                                                    type={method === 'email' ? 'email' : 'tel'}
                                                    value={identifier}
                                                    onChange={(e) => setIdentifier(e.target.value)}
                                                    placeholder={method === 'email' ? 'operator@hybridpos.pk' : '+92 3XX XXXXXXX'}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-transparent focus:border-sky-500/30 focus:bg-white/10 rounded-[1.5rem] outline-none transition-all text-sm font-medium text-white placeholder:text-slate-600"
                                                />
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
                                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center group shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all border border-white/10"
                                        >
                                            {isLoading ? (
                                                <RefreshCw className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Issue Reset Link</span>
                                                    <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </MotionButton>
                                    </form>

                                    <div className="text-center pt-4">
                                        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                            <ArrowLeft className="h-3 w-3" />
                                            Return To Login?
                                        </Link>
                                    </div>
                                </MotionDiv>
                            ) : (
                                <MotionDiv
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8 py-4"
                                >
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <MotionDiv
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"
                                            />
                                            <div className="relative h-20 w-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center">
                                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Transmission sent</h3>
                                        <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto">
                                            If the account exists, security instructions have been dispatched to your {method}.
                                        </p>
                                    </div>

                                    <div className="pt-6">
                                        <Link
                                            href="/login"
                                            className="block w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 transition-all"
                                        >
                                            Exit to Login
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 opacity-30">
                                        <Sparkles className="h-3 w-3 text-sky-500" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">System Synchronized</span>
                                    </div>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-12 flex items-center justify-between px-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Encryption</span>
                        <span className="text-xs font-black text-slate-400 tracking-tight italic">AES-256 GCM</span>
                    </div>
                    <div className="h-8 w-px bg-white/5"></div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Security Node</span>
                        <span className="text-xs font-black text-slate-400 tracking-tight italic">SNG-CLOUD-01</span>
                    </div>
                </div>
            </MotionDiv>
        </div>
    )
}
