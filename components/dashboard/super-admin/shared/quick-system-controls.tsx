"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
    Settings, ShieldAlert, Zap,
    Bell, Database, Cpu,
    Power, Activity, Terminal
} from "lucide-react"

export default function QuickSystemControls() {
    const [controls, setControls] = useState([
        { id: 'maintenance', label: 'Maintenance Mode', active: false, icon: Power, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'debug', label: 'API Debugger', active: true, icon: Terminal, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'notifs', label: 'Broadcast Alerts', active: true, icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'indexing', label: 'Auto-Indexing', active: false, icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ])

    const toggleControl = (id: string) => {
        setControls(prev => prev.map(c =>
            c.id === id ? { ...c, active: !c.active } : c
        ))
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            {...({ className: "glass-card p-1 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800" } as any)}
        >
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[1.8rem]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <Settings className="h-4 w-4 text-slate-400 animate-spin-slow" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Environment</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quick Controls</h2>
                        <p className="text-sm text-slate-500 font-medium">Real-time system overrides</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <Cpu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                </div>

                <div className="space-y-4">
                    {controls.map((control) => {
                        const Icon = control.icon
                        return (
                            <div
                                key={control.id}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2.5 rounded-xl ${control.bg} ${control.color} group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-tight">{control.label}</span>
                                </div>

                                <button
                                    onClick={() => toggleControl(control.id)}
                                    className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${control.active ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                >
                                    <motion.div
                                        animate={{ x: control.active ? 26 : 2 }}
                                        {...({ className: "absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" } as any)}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
                        <Activity className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">View Logs</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group">
                        <ShieldAlert className="h-5 w-5 text-slate-400 group-hover:text-rose-500 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Isolation</span>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
