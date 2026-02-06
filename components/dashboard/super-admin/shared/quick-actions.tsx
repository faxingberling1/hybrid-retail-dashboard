"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Shield, Database, Users, BarChart3,
    RefreshCw, Globe, ServerCrash, Zap
} from "lucide-react"

export default function QuickActions() {
    const actions = [
        {
            title: 'Security Audit',
            description: 'Run deep security scan',
            icon: Shield,
            grad: 'grad-indigo',
            shadow: 'shadow-indigo-500/10'
        },
        {
            title: 'Database Sync',
            description: 'Re-index & optimize DB',
            icon: Database,
            grad: 'grad-ocean',
            shadow: 'shadow-blue-500/10'
        },
        {
            title: 'Deploy Patch',
            description: 'Push v2.4 globally',
            icon: Zap,
            grad: 'grad-warm',
            shadow: 'shadow-amber-500/10'
        },
        {
            title: 'Network Cache',
            description: 'Flush global edge cache',
            icon: RefreshCw,
            grad: 'grad-emerald',
            shadow: 'shadow-emerald-500/10'
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            {...({ className: "glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800" } as any)}
        >
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[1.8rem]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quick Control</h2>
                        <p className="text-sm text-slate-500 font-medium">Mission critical overrides</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                {...({ className: `group w-full p-5 glass rounded-2xl text-left transition-all border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl ${action.shadow}` } as any)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl text-white ${action.grad} group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">{action.title}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter opacity-70">{action.description}</div>
                                    </div>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <button className="w-full py-4 rounded-xl grad-warm text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center">
                        <ServerCrash className="h-4 w-4 mr-2" />
                        System Panic Mode
                    </button>
                    <p className="mt-3 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Authorized Personnel Only<br />
                        All actions are logged & traced
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
