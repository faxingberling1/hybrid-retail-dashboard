"use client"

import React from "react"
import { motion } from "framer-motion"
import { Database, Zap, ShieldCheck, Globe, Activity } from "lucide-react"

export default function SystemStatusBanner() {
    const systems = [
        { name: "PostgreSQL", status: "operational", icon: Database, latency: "4ms" },
        { name: "Redis Cache", status: "operational", icon: Zap, latency: "1ms" },
        { name: "Stripe Gateway", status: "operational", icon: Globe, latency: "124ms" },
        { name: "NextAuth", status: "operational", icon: ShieldCheck, latency: "12ms" },
    ]

    const MotionDiv = motion.div as any

    return (
        <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-1 rounded-[2rem] overflow-hidden shadow-premium border border-slate-900/[0.08]"
        >
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-5 md:p-6 rounded-[1.8rem] flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                    <div className="relative">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                        <div className="h-3 w-3 rounded-full bg-emerald-500 relative" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">All Systems Functional</span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

                <div className="flex flex-wrap items-center gap-6 md:ml-4">
                    {systems.map((system, index) => {
                        const Icon = system.icon
                        return (
                            <div key={index} className="flex items-center space-x-2 group cursor-help">
                                <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {system.name}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                        <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest">{system.latency}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="ml-auto hidden lg:flex items-center space-x-4">
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Global Ping</span>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white">Just now</span>
                    </div>
                    <div className="p-2 glass rounded-xl">
                        <Activity className="h-4 w-4 text-indigo-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </MotionDiv>
    )
}
