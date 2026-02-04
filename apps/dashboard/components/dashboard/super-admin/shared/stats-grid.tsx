"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatItem {
    title: string
    value: string
    change: string
    icon: React.ReactNode
    color: string
    trend: string
    description: string
}

interface StatsGridProps {
    statsData: StatItem[]
}

export default function StatsGrid({ statsData }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
                <div
                    key={stat.title}
                    className="glass-card p-6 rounded-2xl relative overflow-hidden group"
                >
                    {/* Background Decorative Pattern */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl shadow-lg shadow-current/10 ${stat.color} text-white`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {stat.trend === 'up' ?
                                        <TrendingUp className="h-3 w-3 mr-1" /> :
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                    }
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                {stat.title}
                            </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {stat.description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
