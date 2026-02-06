"use client"

import { motion } from "framer-motion"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Activity,
    Users
} from "lucide-react"

interface KpiData {
    label: string
    value: string
    trend: string
    trendingUp: boolean
    icon: any
    color: string
    chart: number[]
}

interface ReportKpiSectionProps {
    kpis: KpiData[]
}

export default function ReportKpiSection({ kpis }: ReportKpiSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpis.map((kpi, i) => (
                <motion.div
                    {...({
                        key: kpi.label,
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: i * 0.1 },
                        className: "bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
                    } as any)}
                >
                    <div className={`absolute right-0 top-0 w-32 h-32 bg-${kpi.color}-50 rounded-full blur-3xl group-hover:bg-${kpi.color}-100 transition-colors duration-700 -mr-16 -mt-16`}></div>

                    <div className="relative flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 ring-1 ring-${kpi.color}-100`}>
                            <kpi.icon className="h-6 w-6" />
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] tracking-widest ${kpi.trendingUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {kpi.trendingUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {kpi.trend}
                        </div>
                    </div>

                    <div className="relative">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-6">{kpi.value}</h3>

                        <div className="h-12 w-full flex items-end gap-1">
                            {kpi.chart.map((val, idx) => (
                                <div
                                    key={idx}
                                    style={{ height: `${val}%` }}
                                    className={`flex-1 rounded-t-lg bg-${kpi.color}-500/20 group-hover:bg-${kpi.color}-500 transition-all duration-500`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
