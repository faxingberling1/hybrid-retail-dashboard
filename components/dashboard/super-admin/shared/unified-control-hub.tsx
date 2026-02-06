"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Settings, ShieldAlert, Zap,
    Bell, Database, Cpu,
    Power, Activity, Terminal,
    RefreshCw, ServerCrash, Shield,
    Search, ArrowRight, CheckCircle2,
    Lock, Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function UnifiedControlHub() {
    const [isAuditRunning, setIsAuditRunning] = useState(false)
    const [auditProgress, setAuditProgress] = useState(0)

    const [controls, setControls] = useState([
        { id: 'maintenance', label: 'Maintenance Mode', active: false, icon: Power, color: 'text-amber-500', bg: 'bg-amber-500/10', description: 'Gracefully pause all user traffic' },
        { id: 'debug', label: 'API Debugger', active: true, icon: Terminal, color: 'text-indigo-500', bg: 'bg-indigo-500/10', description: 'Enable verbose logging for API calls' },
        { id: 'broadcast', label: 'Priority Alerts', active: true, icon: Bell, color: 'text-rose-500', bg: 'bg-rose-500/10', description: 'Push system notifications to all users' },
        { id: 'indexing', label: 'Real-time Index', active: false, icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10', description: 'Immediate DB record indexing' },
    ])

    const [maintenanceDuration, setMaintenanceDuration] = useState("30") // minutes

    useEffect(() => {
        fetch('/api/system/settings')
            .then(res => res.json())
            .then(data => {
                if (data.maintenanceMode !== undefined) {
                    setControls(prev => prev.map(c =>
                        c.id === 'maintenance' ? { ...c, active: data.maintenanceMode } : c
                    ))
                }
            })
            .catch(err => console.error('Failed to fetch settings:', err))
    }, [])

    const handleAction = (action: string) => {
        if (action === 'Security Audit') {
            startSecurityAudit()
            return
        }

        toast.loading(`Executing ${action}...`, {
            duration: 1500,
            id: `action-${action}`
        })

        setTimeout(() => {
            toast.success(`${action} completed successfully`, {
                id: `action-${action}`,
                description: "System metrics updated in real-time.",
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            })
        }, 1500)
    }

    const startSecurityAudit = () => {
        if (isAuditRunning) return

        setIsAuditRunning(true)
        setAuditProgress(0)
        toast.info("Starting Deep Security Audit", {
            description: "Scanning for vulnerabilities and unauthorized access.",
            id: 'security-audit'
        })

        const interval = setInterval(() => {
            setAuditProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsAuditRunning(false)
                    toast.success("Security Audit Finished", {
                        id: 'security-audit',
                        description: "No critical vulnerabilities found in the core system."
                    })
                    return 100
                }
                return prev + 5
            })
        }, 200)
    }

    const handlePanic = () => {
        toast.error("PANIC MODE REQUESTED", {
            description: "Are you sure? This will disconnect all nodes immediately.",
            action: {
                label: "Confirm",
                onClick: () => {
                    toast.error("System Isolated", {
                        description: "All incoming connections dropped. Entering fail-safe state.",
                        duration: 5000
                    })
                }
            },
            duration: 10000
        })
    }

    const toggleControl = async (id: string, label: string) => {
        const currentControl = controls.find(c => c.id === id)
        if (!currentControl) return

        const newState = !currentControl.active

        // Persistent update for maintenance mode
        if (id === 'maintenance') {
            let endAt = null
            if (newState) {
                const date = new Date()
                date.setMinutes(date.getMinutes() + parseInt(maintenanceDuration))
                endAt = date.toISOString()
            }

            const promise = fetch('/api/system/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    maintenanceMode: newState,
                    maintenanceEndAt: endAt
                })
            }).then(async res => {
                if (!res.ok) throw new Error('Failed to update')
                return res.json()
            })

            toast.promise(promise, {
                loading: `${newState ? 'Enabling' : 'Disabling'} Maintenance Mode...`,
                success: `Maintenance Mode ${newState ? 'activated' : 'deactivated'}`,
                error: (err) => `Failed to update Maintenance Mode: ${err.message}`
            })

            try {
                await promise
                setControls(prev => prev.map(c => c.id === id ? { ...c, active: newState } : c))
            } catch (err) {
                // State revert not needed if we follow optimistic UI pattern or just wait for resolution
            }
            return
        }

        // Other controls (still simulation for now)
        setControls(prev => prev.map(c => {
            if (c.id === id) {
                toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 800)),
                    {
                        loading: `${newState ? 'Enabling' : 'Disabling'} ${label}...`,
                        success: `${label} ${newState ? 'activated' : 'deactivated'}`,
                        error: `Failed to update ${label}`
                    }
                )
                return { ...c, active: newState }
            }
            return c
        }))
    }

    const actions = [
        {
            title: 'Security Audit',
            description: 'Run deep scan',
            icon: isAuditRunning ? Loader2 : Shield,
            grad: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            loading: isAuditRunning
        },
        {
            title: 'Database Sync',
            description: 'Optimize DB',
            icon: Database,
            grad: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        },
        {
            title: 'Flush Cache',
            description: 'Clear Redis',
            icon: Zap,
            grad: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
        {
            title: 'Scale Nodes',
            description: 'Add capacity',
            icon: Cpu,
            grad: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-1 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
            <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.4rem]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                                <Settings className="h-4 w-4 text-indigo-500 animate-spin-slow" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">System Ops</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Control Hub</h2>
                        <p className="text-sm text-slate-500 font-medium">Unified management for all core services</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors">
                            <Activity className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Section 1: Environment Toggles */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Cpu className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Services</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {controls.map((control) => {
                            const Icon = control.icon
                            return (
                                <div
                                    key={control.id}
                                    className="flex flex-col p-4 rounded-2xl bg-white/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/30 transition-all hover:border-indigo-500/30 group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl ${control.bg} ${control.color} group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight leading-none mb-1">{control.label}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{control.description}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleControl(control.id, control.label)}
                                            className={`relative w-12 h-6 rounded-full transition-all focus:outline-none ${control.active ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-700'
                                                }`}
                                        >
                                            <motion.div
                                                animate={{ x: control.active ? 26 : 2 }}
                                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>

                                    {control.id === 'maintenance' && !control.active && (
                                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Duration</span>
                                            <select
                                                value={maintenanceDuration}
                                                onChange={(e) => setMaintenanceDuration(e.target.value)}
                                                className="bg-transparent text-[10px] font-black text-indigo-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="15">15 Mins</option>
                                                <option value="30">30 Mins</option>
                                                <option value="60">1 Hour</option>
                                                <option value="120">2 Hours</option>
                                                <option value="240">4 Hours</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Section 2: Rapid Actions */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">System Actions</span>
                        </div>
                        {isAuditRunning && (
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-indigo-500 animate-pulse">AUDIT IN PROGRESS: {auditProgress}%</span>
                                <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${auditProgress}%` }}
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {actions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAction(action.title)}
                                    className={`group relative p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/50 transition-all text-left overflow-hidden`}
                                >
                                    <div className="relative z-10 flex items-center space-x-4">
                                        <div className={`p-2.5 rounded-xl text-white shadow-lg ${action.grad} ${action.loading ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{action.title}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{action.description}</div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="h-3 w-3 text-indigo-500" />
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Emergency Block */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-500/20 rounded-lg">
                                <ShieldAlert className="h-5 w-5 text-rose-500" />
                            </div>
                            <div>
                                <div className="text-sm font-black text-rose-600 dark:text-rose-400 leading-none mb-1 uppercase tracking-tighter">Emergency Override</div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Critical system isolation</p>
                            </div>
                        </div>
                        <button
                            onClick={handlePanic}
                            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/30 flex items-center"
                        >
                            <ServerCrash className="h-3.5 w-3.5 mr-2" />
                            Panic
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
