"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { ShieldAlert, Hammer, Timer, Lock, ShieldCheck } from "lucide-react"

export default function GlobalMaintenanceModal() {
    const { data: session } = useSession()
    const [isVisible, setIsVisible] = useState(false)
    const [maintenance, setMaintenance] = useState<{ active: boolean, endAt: string | null }>({ active: false, endAt: null })
    const [timeLeft, setTimeLeft] = useState<string>("")

    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'SUPERADMIN'

    useEffect(() => {
        const fetchStatus = () => {
            fetch('/api/system/settings')
                .then(res => res.json())
                .then(data => {
                    const isActive = !!data.maintenanceMode
                    setMaintenance({
                        active: isActive,
                        endAt: data.maintenanceEndAt
                    })
                    // Only show modal for non-superadmins when active
                    setIsVisible(isActive && !isSuperAdmin)
                })
                .catch(err => console.error('Failed to fetch maintenance status:', err))
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 15000) // Poll for the lock
        return () => clearInterval(interval)
    }, [isSuperAdmin])

    useEffect(() => {
        if (!maintenance.active || !maintenance.endAt) return

        const calculate = () => {
            const end = new Date(maintenance.endAt!).getTime()
            const now = new Date().getTime()
            const diff = end - now
            if (diff <= 0) {
                setTimeLeft("Finishing...")
                return
            }
            const mins = Math.floor(diff / 60000)
            const secs = Math.floor((diff % 60000) / 1000)
            setTimeLeft(`${mins}m ${secs}s`)
        }
        calculate()
        const timer = setInterval(calculate, 1000)
        return () => clearInterval(timer)
    }, [maintenance])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.15),transparent)] pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                <div className="p-8 lg:p-12 relative z-10 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-xl"
                            />
                            <div className="relative h-20 w-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40 border border-white/20">
                                <Hammer className="h-10 w-10 text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 uppercase">
                        System Locked
                    </h1>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Maintenance Mode Active</span>
                        </div>
                    </div>

                    <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                        We're currently performing essential system optimizations to improve your experience. Access will be restored shortly.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
                            <Timer className="h-5 w-5 text-amber-500 mx-auto mb-3" />
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Estimated Time</div>
                            <div className="text-xl font-black text-white tabular-nums">{timeLeft || "Checking..."}</div>
                        </div>
                        <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
                            <Lock className="h-5 w-5 text-indigo-500 mx-auto mb-3" />
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Status</div>
                            <div className="text-xl font-black text-white uppercase tracking-tighter">Locked</div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">
                            Contact Support for Urgent Inquiries
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer group">
                                <span>Support Documentation</span>
                                <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
