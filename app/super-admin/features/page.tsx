"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MessageSquare,
    Search,
    Filter,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Mail,
    ArrowUpRight,
    Send,
    X,
    ShieldAlert,
    Calendar
} from "lucide-react"

interface FeatureRequest {
    id: string
    email: string
    title: string
    description: string
    importanceLevel: string
    status: string
    response?: string
    createdAt: string
    updatedAt: string
}

export default function SuperAdminFeaturesPage() {
    const [requests, setRequests] = useState<FeatureRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [adminResponse, setAdminResponse] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/features")
            if (res.ok) {
                const data = await res.json()
                setRequests(data)
            }
        } catch (error) {
            console.error("Error fetching requests:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        setIsUpdating(true)
        try {
            const res = await fetch(`/api/features/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, response: adminResponse }),
            })
            if (res.ok) {
                await fetchRequests()
                setSelectedRequest(null)
                setAdminResponse("")
            }
        } catch (error) {
            console.error("Error updating status:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || req.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            case "REVIEWED": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            case "PLANNED": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            case "COMPLETED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            case "DECLINED": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
        }
    }

    const getImportanceColor = (level: string) => {
        switch (level) {
            case "Highest": return "text-rose-500 font-black"
            case "Medium": return "text-amber-500 font-bold"
            case "Low": return "text-blue-500 font-medium"
            default: return "text-slate-500"
        }
    }

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Feature Roadmap</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Manage and prioritize community feature requests.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search blueprint or engineer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all w-64 font-medium"
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                        {["ALL", "PENDING", "PLANNED", "COMPLETED"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                    ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Submissions", value: requests.length, icon: MessageSquare, color: "blue" },
                    { label: "High Priority", value: requests.filter(r => r.importanceLevel === "Highest").length, icon: AlertCircle, color: "rose" },
                    { label: "Active Roadmap", value: requests.filter(r => r.status === "PLANNED").length, icon: Clock, color: "purple" },
                    { label: "Implemented", value: requests.filter(r => r.status === "COMPLETED").length, icon: CheckCircle2, color: "emerald" },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                            <div className={`text-[10px] font-black tracking-widest text-${stat.color}-500 uppercase`}>Insight</div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Request List */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Blueprint Concept</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Engineer / Source</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Importance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Initializing Matrix...</td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center text-slate-400 font-bold uppercase tracking-widest">No matching blueprints found in this quadrant</td>
                                </tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr
                                        key={req.id}
                                        className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer"
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{req.title}</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-1">{req.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{req.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`text-[10px] uppercase font-black tracking-widest ${getImportanceColor(req.importanceLevel)}`}>
                                                {req.importanceLevel}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-100 dark:border-white/5 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
                                        <ShieldAlert className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Blueprint Directive</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 p-8 space-y-8">
                                {/* Header Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedRequest.status)}`}>
                                            {selectedRequest.status}
                                        </span>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(selectedRequest.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{selectedRequest.title}</h2>
                                    <div className="flex items-center gap-2 py-2 px-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 w-fit">
                                        <a
                                            href={`mailto:${selectedRequest.email}?subject=Regarding your feature request: ${selectedRequest.title}`}
                                            className="flex items-center gap-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 w-fit hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all group/mail"
                                        >
                                            <Mail className="w-4 h-4 text-blue-500 group-hover/mail:scale-110 transition-transform" />
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedRequest.email}</span>
                                            <ArrowUpRight className="w-3 h-3 text-blue-400 opacity-0 group-hover/mail:opacity-100 transition-opacity" />
                                        </a>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Architectural Objective</label>
                                    <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                        {selectedRequest.description}
                                    </div>
                                </div>

                                {/* Importance Level Display */}
                                <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className={`w-5 h-5 ${getImportanceColor(selectedRequest.importanceLevel)}`} />
                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Importance Level</span>
                                    </div>
                                    <span className={`text-sm font-black uppercase tracking-[0.2em] ${getImportanceColor(selectedRequest.importanceLevel)}`}>
                                        {selectedRequest.importanceLevel}
                                    </span>
                                </div>

                                {/* Response Section */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Executive Response</label>
                                    <textarea
                                        rows={6}
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Draft architectural response..."
                                        className="w-full p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <div className="grid grid-cols-2 gap-4">
                                    {["REVIEWED", "PLANNED", "COMPLETED", "DECLINED"].map(status => (
                                        <button
                                            key={status}
                                            disabled={isUpdating}
                                            onClick={() => handleUpdateStatus(selectedRequest.id, status)}
                                            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${status === "COMPLETED"
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {status === "COMPLETED" && <CheckCircle2 className="w-4 h-4" />}
                                                {status === "DECLINED" && <X className="w-4 h-4" />}
                                                {status}
                                            </div>
                                            <span className="text-[8px] opacity-70 font-bold">Update & Notify</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
