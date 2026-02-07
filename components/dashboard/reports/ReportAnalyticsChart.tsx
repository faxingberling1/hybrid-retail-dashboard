"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export default function ReportAnalyticsChart() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -mr-64 -mt-64 text-white/5 font-black text-8xl leading-none flex items-center justify-center pointer-events-none">DATA</div>

            <div className="relative flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic text-rose-400 mb-1">Sales Performance Matrix</h2>
                    <p className="text-white/40 text-sm font-medium">Real-time revenue conversion trends over selected period</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-white/20"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Projection</span>
                    </div>
                </div>
            </div>

            {/* Faux Large Chart Visualization */}
            <div className="relative h-[300px] w-full mt-10">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[100, 75, 50, 25, 0].map((level) => (
                        <div key={level} className="w-full flex items-center gap-4">
                            <span className="text-[8px] font-black text-white/10 w-8">{level}%</span>
                            <div className="flex-1 h-px bg-white/5 relative">
                                {level === 100 && <div className="absolute right-0 -top-1 px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[6px] font-black uppercase tracking-widest">Target Peak</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data Bars & Trend Line Container */}
                <div className="absolute inset-0 left-12 flex items-end justify-between gap-4 px-4 pb-0">
                    {/* SVG Trend Line Overlay */}
                    <svg className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d={`M ${[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) =>
                                `${(i * (100 / 11))}% ${300 - (h * 3)}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        {/* Data Points */}
                        {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) => (
                            <motion.circle
                                key={i}
                                cx={`${(i * (100 / 11))}%`}
                                cy={`${300 - (h * 3)}`}
                                r="3"
                                fill="#f43f5e"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1 + i * 0.1 }}
                                className="shadow-lg shadow-rose-500/50"
                            />
                        ))}
                    </svg>

                    {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar relative z-10">
                            <div className="w-full relative h-[300px] flex items-end">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="w-full bg-gradient-to-t from-rose-600/40 to-rose-400/10 rounded-2xl border border-rose-500/20 group-hover/bar:from-rose-600 group-hover/bar:to-rose-400 group-hover/bar:border-rose-400 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 inset-x-0 h-1 bg-white/30 hidden group-hover/bar:block"></div>
                                </motion.div>
                                {/* Tooltip */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-xl font-black text-[10px] opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none shadow-2xl">
                                    ₨{h}k
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest group-hover/bar:text-white transition-colors">M{i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-10 mt-10">
                <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Top Selling</p>
                    <p className="text-xl font-black tracking-tight">Vocalist Series</p>
                    <p className="text-[10px] font-bold text-rose-500 tracking-widest mt-1">+12.4% VOLUME</p>
                </div>
                <div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Conversion Rate</p>
                    <p className="text-xl font-black tracking-tight">4.82%</p>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-1">BENCHMARK 3.5%</p>
                </div>
                <div className="xl:col-span-2 flex items-center justify-end">
                    <button className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center gap-3 group transition-all">
                        <span className="text-xs font-black uppercase tracking-widest">Full Performance Audit</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
