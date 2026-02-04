"use client"

import React from "react"
import { motion } from "framer-motion"
import { TrendingUp, Activity, DollarSign } from "lucide-react"
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell
} from 'recharts'

interface OverviewTabProps {
    platformGrowthData: any[]
    revenueData: any[]
    systemMetrics: any[]
    formatCurrency: (amount: number) => string
    CustomTooltip: any
}

export default function OverviewTab({
    platformGrowthData,
    revenueData,
    systemMetrics,
    formatCurrency,
    CustomTooltip
}: OverviewTabProps) {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Platform Growth Chart */}
                <div className="glass-card p-1 rounded-[2rem] overflow-hidden">
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <Activity className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Analytics</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform Growth</h2>
                                <p className="text-sm text-slate-500 font-medium">Monitoring enterprise adoption and revenue scaling</p>
                            </div>
                            <div className="flex items-center gap-4 p-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="flex items-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">Companies</span>
                                </div>
                                <div className="flex items-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">Users</span>
                                </div>
                                <div className="flex items-center px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">Revenue</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart data={platformGrowthData}>
                                    <defs>
                                        <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ stroke: '#4F46E5', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="organizations"
                                        stroke="#4F46E5"
                                        strokeWidth={4}
                                        dot={false}
                                        activeDot={{ r: 8, strokeWidth: 0, fill: '#4F46E5' }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#10B981"
                                        strokeWidth={4}
                                        dot={false}
                                        activeDot={{ r: 8, strokeWidth: 0, fill: '#10B981' }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        strokeDasharray="8 8"
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }}
                                    />
                                </RechartsLineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Market Share Distribution */}
                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem] h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Market Power</span>
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Share</h2>
                                    <p className="text-sm text-slate-500 font-medium">Revenue dominant entities</p>
                                </div>
                                <div className="p-3 grad-indigo rounded-2xl shadow-lg shadow-indigo-500/20">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="h-64 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={revenueData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={90}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {revenueData.map((entry: any, index: number) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Revenue</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {formatCurrency(revenueData.reduce((acc: number, curr: any) => acc + curr.revenue, 0))}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {revenueData.map((item: any, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            {...({ className: "group flex items-center justify-between p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer" } as any)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{item.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatCurrency(item.revenue)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}%</span>
                                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {item.growth}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Metrics */}
                    <div className="glass-card p-1 rounded-[2rem] overflow-hidden">
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-[1.8rem]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Core Vitals</h2>
                                    <p className="text-sm text-slate-500 font-medium">Real-time system health audit</p>
                                </div>
                                <div className="p-3 grad-emerald rounded-2xl shadow-lg shadow-emerald-500/20">
                                    <Activity className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {systemMetrics.map((metric: any, index: number) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{metric.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{metric.value}</span>
                                                <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {metric.change}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: metric.name.includes('Uptime') ? '99.9%' :
                                                        metric.name.includes('Sessions') ? '62%' :
                                                            metric.name.includes('Database') ? '85%' : '45%'
                                                }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            >
                                                <div className={`h-full rounded-full ${metric.status === 'good' ? 'grad-emerald' :
                                                    metric.status === 'warning' ? 'grad-warm' :
                                                        'bg-rose-500'
                                                    }`} />
                                            </motion.div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <span>Current: {metric.value}</span>
                                            <span>Quota: {metric.target}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
