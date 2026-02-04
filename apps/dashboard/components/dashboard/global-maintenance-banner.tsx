"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, Hammer, X, Timer } from "lucide-react"

export default function GlobalMaintenanceBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)
    const [maintenance, setMaintenance] = useState<{ active: boolean, endAt: string | null }>({ active: false, endAt: null })
    const [timeLeft, setTimeLeft] = useState<string>("")

    useEffect(() => {
        // Fetch maintenance status
        const fetchStatus = () => {
            fetch('/api/system/settings')
                .then(res => res.json())
                .then(data => {
                    setMaintenance({
                        active: data.maintenanceMode,
                        endAt: data.maintenanceEndAt
                    })
                    setIsVisible(data.maintenanceMode)
                })
                .catch(err => console.error('Failed to fetch maintenance status:', err))
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 30000)
        return () => clearInterval(interval)
    }, [])

    // Timer logic
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

    if (!isVisible || isDismissed) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-0 left-0 right-0 z-[100] p-2 pointer-events-none"
            >
                <div className="max-w-4xl mx-auto pointer-events-auto">
                    <motion.div
                        className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-orange-500/20 overflow-hidden relative"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ backgroundSize: "200% 200%" }}
                    >
                        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                        <div className="px-6 py-4 flex items-center justify-between relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
                                    <Hammer className="h-5 w-5 text-white animate-bounce" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xs uppercase tracking-widest leading-none mb-1 shadow-sm">
                                        System Maintenance Active
                                    </p>
                                    <p className="text-white/90 text-[10px] font-medium leading-none">
                                        Platform optimizations in progress. Some features may be temporarily restricted.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {timeLeft && (
                                    <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm">
                                        <Timer className="h-3 w-3 text-white" />
                                        <span className="text-[10px] font-bold text-white tabular-nums">
                                            Ends in: {timeLeft}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm">
                                    <ShieldAlert className="h-3 w-3 text-white" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                                        Restricted Access
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsDismissed(true)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
