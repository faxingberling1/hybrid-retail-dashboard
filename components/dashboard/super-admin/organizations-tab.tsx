"use client"

import React from "react"
import { motion } from "framer-motion"
import { Building2, Filter, TrendingUp, Package, CreditCard, Users, Activity } from "lucide-react"

interface OrganizationsTabProps {
    topOrganizations: any[]
}

export default function OrganizationsTab({ topOrganizations }: OrganizationsTabProps) {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Top Organizations */}
                <div className="glass-card p-1 rounded-[2rem] overflow-hidden">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <Building2 className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Enterprise</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Top Organizations</h2>
                                <p className="text-sm text-slate-500 font-medium">Monitoring peak performance across the ecosystem</p>
                            </div>
                            <button className="p-3 glass rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <Filter className="h-5 w-5 text-indigo-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {topOrganizations.map((org, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-center justify-between p-5 glass-card rounded-2xl group cursor-pointer">
                                        <div className="flex items-center">
                                            <div className="h-14 w-14 grad-indigo p-0.5 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                                                    <Building2 className="h-6 w-6 text-indigo-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">{org.name}</div>
                                                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {org.users} Active Users
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center space-x-6">
                                            <div className="hidden md:block">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Performance</div>
                                                <div className="flex items-center text-emerald-500 font-black justify-end">
                                                    <TrendingUp className="h-4 w-4 mr-1" />
                                                    <span>{org.growth}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{org.revenue}</div>
                                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${org.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {org.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Organization Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden grad-ocean">
                        <div className="bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[1.8rem] h-full flex flex-col justify-between min-h-[220px]">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-white/10 px-3 py-1 rounded-full">
                                    Real-time
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1 tracking-tight">1,248</h3>
                                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Total Transactions</p>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-black text-white">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                <span>+12.5% Scaling</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden grad-indigo">
                        <div className="bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[1.8rem] h-full flex flex-col justify-between min-h-[220px]">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-white/10 px-3 py-1 rounded-full">
                                    Fiscal
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1 tracking-tight">₨ 8.4M</h3>
                                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Platform Revenue</p>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-black text-white">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                <span>+23.1% Velocity</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden grad-emerald">
                        <div className="bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-[1.8rem] h-full flex flex-col justify-between min-h-[220px]">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-white/10 px-3 py-1 rounded-full">
                                    Ecosystem
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-1 tracking-tight">98.2%</h3>
                                <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Success Score</p>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-black text-white">
                                <Activity className="h-4 w-4 mr-2" />
                                <span>High Availability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
