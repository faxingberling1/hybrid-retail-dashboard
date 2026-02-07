"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Filter, Calendar, User, Activity,
    Database, ChevronRight, ChevronLeft, Download,
    RefreshCw, Shield, AlertCircle, Info, CheckCircle2,
    Eye, MoreHorizontal, LayoutGrid, List
} from "lucide-react"
import { format } from "date-fns"

interface AuditLog {
    id: string
    user_id: string | null
    organization_id: string | null
    action: string
    entity_type: string
    entity_id: string | null
    details: any
    ip_address: string | null
    user_agent: string | null
    status: string
    created_at: string
    organizations?: {
        name: string
    }
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [pagination, setPagination] = useState({ total: 0, pages: 0, currentPage: 1, limit: 20 })
    const [searchTerm, setSearchTerm] = useState("")
    const [activeFilters, setActiveFilters] = useState({
        action: "",
        entityType: "",
        status: ""
    })
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

    const fetchLogs = async (page = 1) => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                ...(searchTerm && { searchTerm }),
                ...(activeFilters.action && { action: activeFilters.action }),
                ...(activeFilters.entityType && { entityType: activeFilters.entityType }),
                ...(activeFilters.status && { status: activeFilters.status })
            })
            const response = await fetch(`/api/logs?${params}`)
            const data = await response.json()
            if (data.logs) {
                setLogs(data.logs)
                setPagination(data.pagination)
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [activeFilters, searchTerm])

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'failed': return <AlertCircle className="w-4 h-4 text-rose-500" />
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />
            default: return <Info className="w-4 h-4 text-blue-500" />
        }
    }

    const getActionColor = (action: string) => {
        const a = action?.toLowerCase()
        if (a.includes('create') || a.includes('add')) return 'text-emerald-500 bg-emerald-500/10'
        if (a.includes('delete') || a.includes('remove')) return 'text-rose-500 bg-rose-500/10'
        if (a.includes('update') || a.includes('edit')) return 'text-amber-500 bg-amber-500/10'
        if (a.includes('login') || a.includes('auth')) return 'text-blue-500 bg-blue-500/10'
        return 'text-slate-500 bg-slate-500/10'
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 p-6 lg:p-10">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-500 mb-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Security & Compliance</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Audit <span className="text-grad">Intelligence</span> Logs
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring platform activities across all nodes and organizations.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all">
                            <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                            onClick={() => fetchLogs(pagination.currentPage)}
                            className="flex items-center gap-2 px-6 py-3 grad-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Sync Node
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="p-2 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col lg:flex-row gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by action, user, or entity..."
                            className="w-full bg-white dark:bg-slate-950 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 px-2 lg:px-0">
                        <select
                            className="bg-white dark:bg-slate-950 border-none rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm min-w-[150px]"
                            value={activeFilters.entityType}
                            onChange={(e) => setActiveFilters({ ...activeFilters, entityType: e.target.value })}
                        >
                            <option value="">All Entities</option>
                            <option value="USER">Users</option>
                            <option value="ORGANIZATION">Organizations</option>
                            <option value="PRODUCT">Products</option>
                            <option value="SYSTEM">System</option>
                        </select>
                        <select
                            className="bg-white dark:bg-slate-950 border-none rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm min-w-[150px]"
                            value={activeFilters.status}
                            onChange={(e) => setActiveFilters({ ...activeFilters, status: e.target.value })}
                        >
                            <option value="">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden lg:block" />
                        <div className="flex bg-white dark:bg-slate-950 p-1 rounded-xl shadow-sm">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Display */}
                <div className="relative min-h-[500px]">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tapping Stream...</span>
                            </div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <Database className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Signal Detected</h3>
                            <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
                        </div>
                    ) : viewMode === 'table' ? (
                        <div className="overflow-hidden bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 shadow-premium">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action Protocol</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Node</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, idx) => (
                                        <tr
                                            key={log.id}
                                            className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(log.created_at), 'HH:mm:ss')}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{format(new Date(log.created_at), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 dark:border-slate-700">
                                                        U
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{log.user_id || 'SYSTEM'}</span>
                                                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{log.organizations?.name || 'GLOBAL'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{log.entity_type}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[100px]">{log.entity_id || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(log.status)}
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{log.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {logs.map((log) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={log.id}
                                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-premium hover:shadow-indigo-500/5 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-2xl ${getActionColor(log.action)}`}>
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log.status)}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.status}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Action</h4>
                                            <p className="font-bold text-slate-900 dark:text-white capitalize">{log.action.replace(/_/g, ' ')}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Entity</h4>
                                                <p className="text-xs font-bold text-indigo-500">{log.entity_type}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time</h4>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{format(new Date(log.created_at), 'HH:mm:ss')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                                                U
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">{log.user_id || 'SYSTEM'}</span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                                        >
                                            Inspect
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-900">
                    <p className="text-xs font-bold text-slate-500">
                        Page <span className="text-slate-900 dark:text-white">{pagination.currentPage}</span> of {pagination.pages}
                        <span className="mx-2 opacity-30">•</span>
                        Total <span className="text-slate-900 dark:text-white">{pagination.total}</span> Log Frames
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => fetchLogs(pagination.currentPage - 1)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <div className="flex items-center gap-1 px-2">
                            {[...Array(Math.min(5, pagination.pages))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => fetchLogs(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${pagination.currentPage === i + 1 ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-slate-50 text-slate-500'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={pagination.currentPage === pagination.pages}
                            onClick={() => fetchLogs(pagination.currentPage + 1)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Log Detail Modal */}
            <AnimatePresence>
                {selectedLog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLog(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${getActionColor(selectedLog.action)}`}>
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Inspect Transmission</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node ID: {selectedLog.id.slice(0, 8)}...</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-90 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Header</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedLog.user_id || 'System Process'}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Vector</span>
                                        <p className="text-sm font-bold text-indigo-500">{selectedLog.ip_address || 'Internal/VPN'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entity Schema</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{selectedLog.entity_type}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Node</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedLog.organizations?.name || 'Central Hive'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Metadata Payload</span>
                                    <div className="bg-slate-950 rounded-[1.5rem] p-6 border border-slate-800">
                                        <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Agent Artifacts</span>
                                    <p className="text-[11px] font-medium text-slate-500 italic leading-relaxed">
                                        {selectedLog.user_agent || 'No agent string detected in transmission metadata.'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button className="px-6 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                                    Copy Raw
                                </button>
                                <button className="px-6 py-3 grad-indigo text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all">
                                    Secure Download
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .text-grad {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .grad-indigo {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                }
                .shadow-premium {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.03),
                                0 0 0 1px rgba(0, 0, 0, 0.01);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    )
}
