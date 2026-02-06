"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldAlert, AlertCircle, CheckCircle, Info, Eye, Lock, UserCheck } from "lucide-react"

interface SecurityTabProps {
    securityAlerts: any[]
}

export default function SecurityTab({ securityAlerts }: SecurityTabProps) {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Security Alerts */}
                <div className="glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-900/[0.08]">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[1.8rem]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Security Pulse</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Access Sentinel</h2>
                                <p className="text-sm text-slate-500 font-medium">Real-time threat detection and access audit</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Protection</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {securityAlerts.map((alert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`p-5 rounded-2xl border flex items-start justify-between group cursor-pointer transition-all ${alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30' :
                                        alert.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30' :
                                            'bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/30'
                                        }`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-xl ${alert.type === 'warning' ? 'bg-amber-500 text-white' :
                                                alert.type === 'success' ? 'bg-emerald-500 text-white' :
                                                    'bg-indigo-500 text-white'
                                                }`}>
                                                {alert.type === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                                                    alert.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                                                        <Info className="h-5 w-5" />
                                                }
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white tracking-tight mb-1">{alert.message}</div>
                                                <div className="flex items-center space-x-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${alert.severity === 'high' ? 'bg-rose-500 text-white' :
                                                        alert.severity === 'medium' ? 'bg-amber-500 text-white' :
                                                            'bg-indigo-500 text-white'
                                                        }`}>
                                                        {alert.severity}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{alert.time} • Global IP Trace</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 glass rounded-xl text-slate-400 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Security Intelligence Layer */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                            <div className="p-6 glass-card rounded-[1.5rem] bg-indigo-500/5 border border-slate-900/[0.08]">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 grad-indigo rounded-xl">
                                        <Lock className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Security Index</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-4">94.2%</div>
                                <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="absolute inset-0 grad-indigo" />
                                </div>
                            </div>

                            <div className="p-6 glass-card rounded-[1.5rem] bg-emerald-500/5 border border-slate-900/[0.08]">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 grad-emerald rounded-xl">
                                        <UserCheck className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Identity Audit</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-4">78% 2FA</div>
                                <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="absolute inset-0 grad-emerald" />
                                </div>
                            </div>

                            <div className="p-6 glass-card rounded-[1.5rem] bg-rose-500/5 border border-slate-900/[0.08]">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 grad-warm rounded-xl">
                                        <ShieldAlert className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Threat Pulse</span>
                                </div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-4">Low Risk</div>
                                <div className="flex items-center space-x-1">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Active Scans: 12 Nodes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
