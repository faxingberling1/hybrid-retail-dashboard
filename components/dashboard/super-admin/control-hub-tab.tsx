"use client"

import React from "react"
import { motion } from "framer-motion"
import UnifiedControlHub from "./shared/unified-control-hub"
import { ShieldAlert, Info } from "lucide-react"

export default function ControlHubTab() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
                {/* Information Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-900/[0.08] h-fit">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-[1.8rem]">
                            <div className="flex items-center space-x-2 mb-4">
                                <Info className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Security Note</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-3">Privileged Operations</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                                Actions performed in the Control Hub have immediate, platform-wide effects.
                                Ensure you have verified the operational requirements before triggering overrides.
                            </p>
                            <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <div className="flex items-start space-x-3">
                                    <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5" />
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase leading-tight">
                                        All actions are logged and attributed to your session.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-[1.8rem]">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Node Cluster</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "Cluster-A (US-East)", load: "12%", status: "active" },
                                    { name: "Cluster-B (EU-West)", load: "24%", status: "active" },
                                    { name: "Cluster-C (Asia-S)", load: "8%", status: "active" },
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">{node.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-bold text-slate-400">{node.load}</span>
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Control Hub */}
                <div className="lg:col-span-8">
                    <UnifiedControlHub />
                </div>
            </motion.div>
        </div>
    )
}
