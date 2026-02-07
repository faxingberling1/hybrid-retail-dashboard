"use client"

import { motion } from "framer-motion"
import {
    DollarSign,
    CreditCard,
    Zap,
    TrendingUp,
    Wallet
} from "lucide-react"

export default function TransactionKpiSection() {
    const kpis = [
        { label: "Today's Revenue", value: "₨ 124.5k", trend: "+12%", icon: DollarSign, color: "rose" },
        { label: "Card Volume", value: "₨ 78.2k", trend: "+8.5%", icon: CreditCard, color: "indigo" },
        { label: "Cash Flow", value: "₨ 46.3k", trend: "-2.1%", icon: Wallet, color: "emerald" },
        { label: "Avg. Ticket", value: "₨ 1,240", trend: "+5.4%", icon: Zap, color: "amber" },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
                <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-500/5 rounded-full blur-3xl -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl`}>
                                <kpi.icon className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                                <TrendingUp className={`h-3 w-3 ${kpi.trend.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`} />
                                <span className="text-[10px] font-black text-gray-500 italic uppercase tracking-widest">{kpi.trend}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{kpi.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">{kpi.value}</h3>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
