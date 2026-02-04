"use client"

import React from "react"
import { motion } from "framer-motion"
import { Hammer, Loader2, ShieldAlert, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-rose-500/10 blur-[120px] rounded-full"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-card p-1 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl p-10 rounded-[2.4rem] text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex justify-center mb-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                                <div className="relative p-6 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                                    <Hammer className="h-12 w-12 text-indigo-500" />
                                </div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-2 -right-2 p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20"
                                >
                                    <ShieldAlert className="h-4 w-4 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                            Platform <br /><span className="text-sky-600">Calibration</span>
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">
                            We're currently performing scheduled system optimizations. Access is temporarily restricted to Super-Admin personnel.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/30">
                                <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                    Updating Node Cluster
                                </span>
                            </div>

                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
                            >
                                <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center space-x-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Status: Core Services Preserved
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
