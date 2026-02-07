
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Building2, Search, Filter, Plus,
    MoreHorizontal, ArrowUpRight, CheckCircle2,
    ShieldAlert, Users, DollarSign, Activity,
    Calendar, Globe, TrendingUp, RefreshCw, Shield
} from "lucide-react"
import OrganizationDetailView from "./shared/organization-detail-view"
import { toast } from "sonner"

export default function OrganizationsTab() {
    const [organizations, setOrganizations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedOrg, setSelectedOrg] = useState<any>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Stats calculation
    const totalOrgs = organizations.length
    const activeOrgs = organizations.filter(o => o.status === 'active').length
    const totalRevenue = organizations.reduce((acc, o) => acc + (parseFloat(o.total_revenue) || 0), 0)

    const fetchOrganizations = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/super-admin/organizations')
            if (!res.ok) throw new Error("Failed to fetch")
            const data = await res.json()
            setOrganizations(data)
        } catch (error) {
            console.error(error)
            toast.error("Could not synchronize organization data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrganizations()
    }, [])

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/super-admin/organizations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (!res.ok) throw new Error("Update failed")

            setOrganizations(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
            if (selectedOrg?.id === id) {
                setSelectedOrg({ ...selectedOrg, status: newStatus })
            }
            toast.success(`Infrastructure ${newStatus === 'active' ? 'restored' : 'suspended'}`)
        } catch (error) {
            toast.error("Status update protocol interrupted")
        }
    }

    const filteredOrganizations = organizations.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || org.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency', currency: 'PKR', minimumFractionDigits: 0
        }).format(amount).replace('PKR', '₨')
    }

    return (
        <div className="space-y-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="h-2 w-8 grad-indigo rounded-full" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Registry Control</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        Organization Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Comprehensive explorer for platform entities and system health
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchOrganizations}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw className={`h-5 w-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="px-6 py-3 grad-indigo text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Provision Org
                    </button>
                </div>
            </div>

            {/* Platform Snapshot Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Managed", value: totalOrgs, icon: <Building2 />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                    { label: "Active Nodes", value: activeOrgs, icon: <CheckCircle2 />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Aggregate Revenue", value: formatCurrency(totalRevenue), icon: <DollarSign />, color: "text-violet-500", bg: "bg-violet-500/10" },
                    { label: "Health Score", value: "98.4%", icon: <Activity />, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white dark:bg-slate-900 border border-slate-900/[0.05] dark:border-slate-800/50 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            {React.cloneElement(stat.icon as React.ReactElement, { className: "h-5 w-5" })}
                        </div>
                        <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Utility Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-2 rounded-[1.8rem] dark:bg-slate-900/50 border border-slate-900/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan for organizations by identity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-950 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-950 rounded-2xl shadow-sm">
                    {['all', 'active', 'suspended'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Organizations Explorer Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-900/[0.05] dark:border-slate-800/50 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Load</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Yield</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-10 h-24" />
                                    </tr>
                                ))
                            ) : filteredOrganizations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Activity className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                        <div className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching entities found in global registry</div>
                                    </td>
                                </tr>
                            ) : filteredOrganizations.map((org) => (
                                <motion.tr
                                    layout
                                    key={org.id}
                                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 grad-indigo p-0.5 rounded-xl group-hover:scale-110 transition-transform">
                                                <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.7rem] flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-indigo-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 group-hover:text-indigo-500 transition-colors">
                                                    {org.name}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {org.industry || 'General Operations'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center space-x-2 ${org.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-rose-500/10 text-rose-500'}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${org.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                <span>{org.status}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-6">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Users</div>
                                                <div className="flex items-center font-bold text-slate-900 dark:text-white">
                                                    <Users className="h-3 w-3 mr-1.5 text-indigo-400" />
                                                    {org.user_count}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tier</div>
                                                <div className="flex items-center font-bold text-slate-900 dark:text-white uppercase">
                                                    <Shield className="h-3 w-3 mr-1.5 text-amber-500" />
                                                    {org.current_plan || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                                            {formatCurrency(org.total_revenue || 0)}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LTV Velocity</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedOrg(org)
                                                setIsDetailOpen(true)
                                            }}
                                            className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-white dark:hover:text-slate-900 rounded-xl transition-all shadow-sm"
                                        >
                                            <ArrowUpRight className="h-5 w-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-8 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-900/5 font-bold text-slate-400 text-xs">
                <span>Showing {filteredOrganizations.length} of {totalOrgs} Registry Entries</span>
                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm opacity-50 cursor-not-allowed">Previous</button>
                    <button className="px-4 py-2 grad-indigo text-white rounded-xl shadow-md">1</button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm opacity-50 cursor-not-allowed">Next</button>
                </div>
            </div>

            {/* Organization Drawer/Modal */}
            <OrganizationDetailView
                organization={selectedOrg}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}
