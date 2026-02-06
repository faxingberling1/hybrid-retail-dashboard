// @ts-nocheck
import {
    TrendingUp,
    HardDrive,
    Activity,
    LineChart as LineChartIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

interface AnalyticsTabProps {
    performanceMetrics: any[];
    tableSizes: any[];
    stats: any;
    formatBytes: (bytes: number) => string;
}

export default function AnalyticsTab({
    performanceMetrics,
    tableSizes,
    stats,
    formatBytes
}: AnalyticsTabProps) {
    return (
        <div className="space-y-6">
            {/* Database Growth Chart */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Database Growth Trends</h2>
                            <p className="text-sm text-gray-600 mt-1">Historical growth patterns and projections</p>
                        </div>
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <div className="p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceMetrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke="#666"
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    label={{
                                        value: 'Query Time (ms)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { textAnchor: 'middle' }
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    formatter={(value: any) => [`${value} ms`, 'Query Time']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="queryTime"
                                    name="Query Time"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tables by Size */}
                <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Top Tables by Size</h2>
                                <p className="text-sm text-gray-600 mt-1">Largest tables in the database</p>
                            </div>
                            <HardDrive className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="p-6">
                        {tableSizes.length > 0 ? (
                            <div className="space-y-4">
                                {tableSizes.slice(0, 8).map((table, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
                                                <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{table.name}</h3>
                                                <p className="text-sm text-gray-500">{table.rowCount.toLocaleString()} rows</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{formatBytes(table.size)}</p>
                                            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                                                <div
                                                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                                                    style={{
                                                        width: `${(table.size / Math.max(...tableSizes.map(t => t.size))) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No table size data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white rounded-xl border shadow-sm">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
                                <p className="text-sm text-gray-600 mt-1">Recent performance statistics</p>
                            </div>
                            <Activity className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Average Query Time</span>
                                    <span className="font-semibold text-gray-900">
                                        {performanceMetrics.length > 0
                                            ? `${Math.round(performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length)}ms`
                                            : '--ms'
                                        }
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                        style={{
                                            width: performanceMetrics.length > 0
                                                ? `${Math.min((performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length) / 2, 100)}%`
                                                : '0%'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                                    <span className="font-semibold text-gray-900">
                                        {performanceMetrics.length > 0
                                            ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}%`
                                            : '--%'
                                        }
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                        style={{
                                            width: performanceMetrics.length > 0
                                                ? `${performanceMetrics[performanceMetrics.length - 1].memoryUsage}%`
                                                : '0%'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Active Connections</span>
                                    <span className="font-semibold text-gray-900">{stats?.activeConnections || 0}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                                        style={{ width: `${Math.min((stats?.activeConnections || 0) * 10, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
