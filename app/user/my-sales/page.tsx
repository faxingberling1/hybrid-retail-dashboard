"use client"

import { motion } from "framer-motion"
import {
    TrendingUp,
    BarChart3,
    Target,
    Award,
    Zap,
    Calendar,
    ChevronRight,
    ArrowUpRight
} from "lucide-react"

export default function UserSalesPage() {
    const stats = [
        { title: "Today's Sales", value: "₨ 42,500", target: "₨ 50,000", progress: 85, icon: <Zap className="h-5 w-5" />, color: "text-amber-500", bg: "bg-amber-50" },
        { title: "Monthly Total", value: "₨ 845,000", target: "₨ 1.2M", progress: 70, icon: <BarChart3 className="h-5 w-5" />, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Conversion", value: "68%", target: "75%", progress: 90, icon: <Target className="h-5 w-5" />, color: "text-purple-500", bg: "bg-purple-50" },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/20">
                    <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Performance</h1>
                    <p className="text-sm text-gray-500">Track your sales and targets</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className={`p-2.5 w-fit rounded-xl ${stat.bg} ${stat.color} mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>

                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Progress</span>
                                <span>{stat.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stat.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full`}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 pt-1 flex items-center gap-1">
                                Target: {stat.target}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Achievements */}
                <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <Award className="h-12 w-12 text-emerald-400 mb-6" />
                    <h2 className="text-2xl font-black tracking-tight mb-2">Staff of the Month</h2>
                    <p className="text-emerald-400/80 font-medium mb-8">You're currently ranked #2 in this region!</p>

                    <div className="space-y-4">
                        {[
                            "Perfect Attendance (Jan)",
                            "Top Service Rating",
                            "Zero Void Errors week"
                        ].map((ach) => (
                            <div key={ach} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                                </div>
                                <span className="text-sm font-bold">{ach}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Shifts */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-bold text-gray-900">Recent Shifts</h2>
                        <button className="text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700 flex items-center gap-1">
                            History <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { date: "Feb 02, 2024", duration: "8h 15m", sales: "₨ 12,400" },
                            { date: "Feb 01, 2024", duration: "7h 45m", sales: "₨ 9,850" },
                            { date: "Jan 31, 2024", duration: "8h 00m", sales: "₨ 15,200" },
                            { date: "Jan 30, 2024", duration: "8h 10m", sales: "₨ 11,100" },
                        ].map((shift, index) => (
                            <motion.div
                                key={shift.date}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-green-200 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-gray-50 rounded-xl">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{shift.date}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{shift.duration} Shift</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">{shift.sales}</p>
                                    <span className="text-[10px] font-bold text-green-600 flex items-center justify-end gap-0.5">
                                        +4.5% <ArrowUpRight className="h-2 w-2" />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
