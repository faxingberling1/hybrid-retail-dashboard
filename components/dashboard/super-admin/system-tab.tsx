"use client"

import React from "react"
import { motion } from "framer-motion"
import { Server, Cpu, HardDrive, Network } from "lucide-react"

export default function SystemTab() {
    const systemServices = [
        { service: 'Database', status: 'running', uptime: '99.9%' },
        { service: 'API Gateway', status: 'running', uptime: '99.8%' },
        { service: 'Authentication', status: 'running', uptime: '99.7%' },
        { service: 'Payment Processing', status: 'running', uptime: '99.6%' },
        { service: 'Email Service', status: 'running', uptime: '99.5%' },
    ]

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* System Health */}
                <div className="glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-900/[0.08]">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <Server className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Environment</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Core</h2>
                                <p className="text-sm text-slate-500 font-medium">Real-time infrastructure health audit</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Node Sync Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-6 glass-card rounded-2xl group transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 grad-ocean rounded-xl group-hover:scale-110 transition-transform">
                                        <Cpu className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">CPU Load</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400">Workload</span>
                                        <span className="text-2xl font-black text-emerald-500">45%</span>
                                    </div>
                                    <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '45%' }}
                                        >
                                            <div className="absolute inset-0 grad-emerald" />
                                        </motion.div>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stability: Excellent</div>
                                </div>
                            </div>

                            <div className="p-6 glass-card rounded-2xl group transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 grad-indigo rounded-xl group-hover:scale-110 transition-transform">
                                        <HardDrive className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Dynamic Memory</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400">Total Used</span>
                                        <span className="text-xl font-black text-indigo-500">6.2GB / 16GB</span>
                                    </div>
                                    <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '38%' }}
                                        >
                                            <div className="absolute inset-0 grad-indigo" />
                                        </motion.div>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilization: Optimal</div>
                                </div>
                            </div>

                            <div className="p-6 glass-card rounded-2xl group transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 grad-warm rounded-xl group-hover:scale-110 transition-transform">
                                        <Network className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Network I/O</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-400">Bandwidth</span>
                                        <span className="text-2xl font-black text-rose-500">1.2 Gbps</span>
                                    </div>
                                    <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '60%' }}
                                        >
                                            <div className="absolute inset-0 grad-warm" />
                                        </motion.div>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak: 2.4 Gbps Burst</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Diagnostics & Critical Log Stream */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-900/[0.08]">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Critical Events</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Live Diagnostics</span>
                                </div>
                            </div>
                            <div className="space-y-2 font-mono">
                                {[
                                    { time: '01:04:22', event: 'Database migration sync completed', type: 'info' },
                                    { time: '01:02:15', event: 'High latency detected on Node-4B', type: 'warning' },
                                    { time: '00:58:10', event: 'Global edge cache flushed (Admin Override)', type: 'danger' },
                                    { time: '00:55:04', event: 'New SSL certificate deployed for core.api', type: 'success' },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-2.5 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all">
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase">{log.time}</span>
                                        <div className={`h-1.5 w-1.5 rounded-full ${log.type === 'success' ? 'bg-emerald-500' :
                                            log.type === 'warning' ? 'bg-amber-500' :
                                                log.type === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'
                                            }`} />
                                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {log.event}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-900/[0.08]">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem] h-full flex flex-col justify-between">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Resource Stability</h3>
                            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 glass rounded-2xl mb-4 border border-emerald-500/10 bg-emerald-500/5">
                                <div className="text-4xl font-black text-emerald-500 mb-2">99.98%</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Uptime</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                                Monitoring 1.4M events/sec<br /> across 4 global regions
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
