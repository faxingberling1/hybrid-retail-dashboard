"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Package, BarChart3, MapPin, Zap,
    ShoppingCart, Users, TrendingUp, Shield
} from "lucide-react"

interface AddOnsBadgeProps {
    addOns: string[] | null
    compact?: boolean
}

// Map add-on IDs to display info
const ADD_ON_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    inventory_plus: { label: "Inventory+", icon: Package, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    analytics_pro: { label: "Analytics Pro", icon: BarChart3, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    multi_location: { label: "Multi-Location", icon: MapPin, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    advanced_pos: { label: "Advanced POS", icon: ShoppingCart, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    team_management: { label: "Team Mgmt", icon: Users, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    marketing_suite: { label: "Marketing", icon: TrendingUp, color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
    priority_support: { label: "Priority Support", icon: Shield, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    api_access: { label: "API Access", icon: Zap, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
}

export default function AddOnsBadge({ addOns, compact = false }: AddOnsBadgeProps) {
    if (!addOns || addOns.length === 0) {
        return (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                No Add-ons
            </span>
        )
    }

    if (compact) {
        return (
            <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                    {addOns.slice(0, 3).map((addOnId, index) => {
                        const config = ADD_ON_CONFIG[addOnId]
                        if (!config) return null
                        const Icon = config.icon
                        return (
                            <div
                                key={addOnId}
                                className={`h-6 w-6 rounded-full border ${config.color} flex items-center justify-center`}
                                title={config.label}
                            >
                                <Icon className="h-3 w-3" />
                            </div>
                        )
                    })}
                </div>
                {addOns.length > 3 && (
                    <span className="text-[10px] font-black text-slate-400 ml-1">
                        +{addOns.length - 3}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {addOns.map((addOnId) => {
                const config = ADD_ON_CONFIG[addOnId]
                if (!config) {
                    return (
                        <span
                            key={addOnId}
                            className="px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-slate-100 text-slate-500 border border-slate-200"
                        >
                            {addOnId}
                        </span>
                    )
                }
                const Icon = config.icon
                return (
                    <motion.div
                        key={addOnId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center space-x-1.5 ${config.color}`}
                    >
                        <Icon className="h-3 w-3" />
                        <span>{config.label}</span>
                    </motion.div>
                )
            })}
        </div>
    )
}
