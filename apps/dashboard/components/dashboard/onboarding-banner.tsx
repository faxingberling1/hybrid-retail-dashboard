"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, ArrowRight, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

export function OnboardingBanner() {
    const { data: session } = useSession()
    const router = useRouter()
    const [visible, setVisible] = useState(false)
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true)

    const organizationId = session?.organizationId

    useEffect(() => {
        if (!organizationId) return

        const checkProgress = async () => {
            try {
                const response = await fetch(`/api/onboarding/${organizationId}/progress`)
                if (!response.ok) return

                const data = await response.json()
                const completedCount = data.completedSteps?.length || 0
                const totalCount = 5 // Based on ONBOARDING_STEPS in page.tsx

                if (completedCount < totalCount) {
                    setProgress(Math.round((completedCount / totalCount) * 100))
                    setVisible(true)
                }
            } catch (error) {
                console.error("Failed to check onboarding progress:", error)
            } finally {
                setLoading(false)
            }
        }

        checkProgress()
    }, [organizationId])

    if (!visible || loading) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-white">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <p className="font-bold tracking-tight">Your setup is {progress}% complete!</p>
                            <p className="text-xs text-blue-100/80">Calibration required for full operational efficiency.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-white shadow-[0_0_10px_white]"
                                />
                            </div>
                            <span className="text-[10px] font-black text-white">{progress}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push(`/onboarding/${organizationId}`)}
                                className="px-5 py-2 bg-white text-blue-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                Complete Setup
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => setVisible(false)}
                                className="p-2 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
