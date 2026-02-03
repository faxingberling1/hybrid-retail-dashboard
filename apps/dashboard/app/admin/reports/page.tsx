"use client"

import { useState } from "react"
import {
    BarChart3, PieChart, LineChart,
    Download, Calendar, TrendingUp,
    ArrowUpRight, ArrowDownRight, Filter,
    Layers, Package, ShoppingCart, DollarSign
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminReportsPage() {
    const [reportType, setReportType] = useState("SALES")

    const quickKPIs = [
        { title: "Net Revenue", value: "₨ 8.4M", change: "+14.2%", trending: "up", icon: <DollarSign className="h-5 w-5" /> },
        { title: "Exp. Profit", value: "₨ 2.1M", change: "+8.5%", trending: "up", icon: <TrendingUp className="h-5 w-5" /> },
        { title: "Total Taxes", value: "₨ 1.2M", change: "-2.1%", trending: "down", icon: <Layers className="h-5 w-5" /> },
        { title: "Op. Expenses", value: "₨ 450K", change: "+5.0%", trending: "up", icon: <Package className="h-5 w-5" /> }
    ]

    const categories = [
        { name: "Electronics", sales: "₨ 3.2M", percent: 65, color: "bg-blue-500" },
        { name: "Fashion", sales: "₨ 1.8M", percent: 45, color: "bg-indigo-500" },
        { name: "Home Appliances", sales: "₨ 2.4M", percent: 55, color: "bg-purple-500" },
        { name: "Groceries", sales: "₨ 1.0M", percent: 30, color: "bg-emerald-500" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Business Insights</h1>
                    <p className="text-gray-500 font-medium">Advanced reporting and data visualization engine</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-black shadow-sm hover:bg-gray-50 transition-all">
                        <Calendar className="h-4 w-4" />
                        Select Range
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-gray-900/20 hover:scale-[1.02] transition-all">
                        <Download className="h-5 w-5" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {quickKPIs.map((kpi, idx) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:bg-gray-50/50 transition-all"
                        {...({} as any)}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                                {kpi.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black ${kpi.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {kpi.change}
                                {kpi.trending === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </div>
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.title}</div>
                        <div className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Main Chart Area Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Revenue Velocity</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly sales metrics vs target</p>
                        </div>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button onClick={() => setReportType("SALES")} className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all ${reportType === 'SALES' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Weekly</button>
                            <button onClick={() => setReportType("PROFIT")} className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all ${reportType === 'PROFIT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Monthly</button>
                        </div>
                    </div>

                    {/* Mock Chart Visual */}
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {[45, 60, 40, 85, 55, 95, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="w-full relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className={`w-full rounded-t-2xl shadow-lg transition-all group-hover:opacity-80 ${h > 70 ? 'bg-blue-500 shadow-blue-500/30' : 'bg-indigo-300 shadow-indigo-300/30'}`}
                                        {...({} as any)}
                                    />
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Day {i + 1}</div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none" />
                </div>

                {/* Breakdown Panel */}
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Performance Mix</h2>
                    <div className="space-y-8">
                        {categories.map((cat) => (
                            <div key={cat.name} className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase">
                                    <span className="text-gray-400">{cat.name}</span>
                                    <span className="text-gray-900">{cat.sales}</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.percent}%` }}
                                        className={`h-full ${cat.color} rounded-full`}
                                        {...({} as any)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                        <div className="flex items-center gap-3 mb-3">
                            <PieChart className="h-5 w-5 text-blue-600" />
                            <div className="text-sm font-black text-gray-900 tracking-tight">Market Insight</div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            Electronics continues to dominate with 65% contribution. Consider expanding inventory in Home Appliances.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
