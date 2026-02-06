"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface Activity {
    id: number
    action: string
    user: string
    time: string
    type: string
}

interface RecentActivityProps {
    recentActivities: Activity[]
}

export default function RecentActivity({ recentActivities }: RecentActivityProps) {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="glass-card p-1 rounded-[2rem] overflow-hidden shadow-premium border border-slate-900/10">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[1.8rem]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Pulse</h2>
                                <p className="text-sm text-slate-500 font-medium">Real-time platform event stream</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-start space-x-4 p-5 glass rounded-2xl group hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800">
                                        <div className={`p-3 rounded-xl shadow-lg shadow-current/5 ${activity.type === 'success' ? 'grad-emerald text-white' :
                                            activity.type === 'warning' ? 'grad-warm text-white' :
                                                'grad-ocean text-white'
                                            }`}>
                                            {activity.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                                                activity.type === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                                                    <Info className="h-5 w-5" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-900 dark:text-white font-black tracking-tight">{activity.action}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Operator: <span className="text-indigo-500">{activity.user}</span>
                                                </p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
