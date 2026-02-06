// @ts-nocheck
import {
    Table,
    FileText,
    HardDrive,
    Clock,
    Activity,
    BarChart3,
    TrendingUp,
    Users,
    Cpu,
    Zap,
    Layers,
    Database as DatabaseIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

interface DashboardTabProps {
    stats: any;
    performanceMetrics: any[];
    tableSizes: any[];
    liveUptime: string;
    formatBytes: (bytes: number) => string;
}

const chartColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899'
];

export default function DashboardTab({
    stats,
    performanceMetrics,
    tableSizes,
    liveUptime,
    formatBytes
}: DashboardTabProps) {
    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Tables Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform">
                            <Table className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                            {stats.totalTables}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Total Tables</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Schema Architecture</p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Layers className="w-3 h-3 mr-1.5" />
                            <span>Verified Schema</span>
                        </div>
                    </div>
                </motion.div>

                {/* Total Rows Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                            {stats.totalRows.toLocaleString()}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Total Records</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Data Volume</p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            <span>Active Growth</span>
                        </div>
                    </div>
                </motion.div>

                {/* Database Size Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-xl group-hover:scale-110 transition-transform">
                            <HardDrive className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-fuchsia-700 bg-clip-text text-transparent">
                            {stats.totalSize}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Storage Status</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Disk Usage</p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <DatabaseIcon className="w-3 h-3 mr-1.5" />
                            <span>PostgreSQL Cluster</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Uptime Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <span className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent italic">
                            {liveUptime}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">System Uptime</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Live Availability</p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                            <span>99.9% Reliable</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Performance Telemetry</h3>
                            <p className="text-sm font-medium text-gray-500">Real-time latency and connection tracking</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Query Speed
                            </div>
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceMetrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    fontWeight={700}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    fontWeight={700}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid #f1f5f9',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                <Line
                                    type="monotone"
                                    dataKey="queryTime"
                                    name="Latency (ms)"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="connections"
                                    name="Clients"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Distributed Schema (Table Sizes) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Schema Density</h3>
                            <p className="text-sm font-medium text-gray-500">Distribution of storage mass</p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-indigo-400 opacity-50" />
                    </div>

                    <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tableSizes}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="size"
                                    nameKey="name"
                                >
                                    {tableSizes.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={chartColors[index % chartColors.length]}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${formatBytes(Number(value))}`, 'Density']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Label Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Cluster</span>
                            <span className="text-lg font-black text-gray-900">{stats.totalTables} Tables</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* System Health Pulse Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Active Connections Pulse */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-2xl">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Links</div>
                            <div className="text-2xl font-black text-white">{stats.activeConnections} Connections</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            <span>Pool Saturation</span>
                            <span>{Math.round((stats.activeConnections / 100) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(stats.activeConnections, 100)}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Memory Load Pulse */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Memory Matrix</div>
                            <div className="text-2xl font-black text-white">
                                {performanceMetrics.length > 0
                                    ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}% Load`
                                    : '--%'
                                }
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            <span>Heap Allocation</span>
                            <span>{performanceMetrics.length > 0 ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}%` : '0%'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${performanceMetrics.length > 0 ? performanceMetrics[performanceMetrics.length - 1].memoryUsage : 0}%` }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Compute Velocity Pulse */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-amber-500/20 rounded-2xl">
                            <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Compute Velocity</div>
                            <div className="text-2xl font-black text-white">
                                {performanceMetrics.length > 0
                                    ? `${Math.round(performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length)}ms Avg`
                                    : '--ms'
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Exec</div>
                            <div className="text-sm font-black text-white">
                                {performanceMetrics.length > 0 ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].queryTime)}ms` : '--'}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Peak</div>
                            <div className="text-sm font-black text-emerald-400">
                                {performanceMetrics.length > 0 ? `${Math.round(Math.min(...performanceMetrics.map(m => m.queryTime)))}ms` : '--'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
