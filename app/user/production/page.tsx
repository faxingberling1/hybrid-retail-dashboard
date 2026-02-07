"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Factory,
    Search,
    Filter,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Play,
    Timer,
    ChevronRight,
    ArrowRight,
    MoreVertical,
    History,
    Package,
    LayoutGrid,
    List,
    RefreshCw,
    X,
    Settings
} from "lucide-react"

export default function UserProductionPage() {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const productions = [
        { id: "PRD-001", product: "Premium Coffee Bean (Roasted)", quantity: "50kg", status: "completed", startTime: "08:00 AM", endTime: "10:30 AM", efficiency: "98%", staff: "John Doe" },
        { id: "PRD-002", product: "Organic Milk 1L Bottles", quantity: "200 Units", status: "in-progress", startTime: "11:00 AM", progress: 65, efficiency: "94%", staff: "Sarah Smith" },
        { id: "PRD-003", product: "Chocolate Bar Box", quantity: "15 Boxes", status: "pending", startTime: "02:00 PM", efficiency: "-", staff: "Alex Wong" },
        { id: "PRD-004", product: "Laundry Detergent 5L", quantity: "40 Units", status: "completed", startTime: "Yesterday", endTime: "Yesterday", efficiency: "92%", staff: "John Doe" },
    ]

    const stats = [
        { label: "Active Batches", value: "3", icon: Timer, color: "blue" },
        { label: "Daily Target", value: "85%", icon: CheckCircle2, color: "green" },
        { label: "Pending Tasks", value: "12", icon: AlertCircle, color: "orange" },
        { label: "Staff Active", value: "5", icon: Factory, color: "purple" },
    ]

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
                        <Factory className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Manufacturing Hub</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900">Production Management</h1>
                        <p className="text-gray-500 font-medium italic">Monitor manufacturing stages, batch processing, and output quality</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <History className="h-5 w-5 text-gray-400" />
                        Log History
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Production
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/30 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500"></div>
                        <div className="relative flex items-center gap-5">
                            <div className={`p-4 rounded-2xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                                    stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                        'bg-purple-50 text-purple-600'
                                }`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/60 backdrop-blur-xl border border-gray-200/50 p-4 rounded-[2rem] shadow-sm">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by production ID, product name or staff..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all whitespace-nowrap">
                        <Filter className="h-5 w-5 text-gray-400" />
                        Sort By: Date
                    </button>
                    <div className="h-10 w-px bg-gray-200 hidden lg:block"></div>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <List className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Batch ID / Product</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Yield Quantity</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Timeline / Staff</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Performance</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {productions.map((prd, idx) => (
                                        <motion.tr
                                            key={prd.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-indigo-50/30 transition-all duration-300"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-transparent group-hover:border-indigo-100">
                                                        <Box className="h-6 w-6 text-gray-400 group-hover:text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{prd.product}</p>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prd.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-gray-900 uppercase tracking-widest px-3 py-1.5 bg-gray-100 rounded-lg">
                                                    {prd.quantity}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] w-fit border ${prd.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    prd.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' :
                                                        'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                    {prd.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> :
                                                        prd.status === 'in-progress' ? <Play className="h-3 w-3 fill-current" /> :
                                                            <Clock className="h-3 w-3" />}
                                                    {prd.status.replace('-', ' ')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{prd.startTime} {prd.endTime && `→ ${prd.endTime}`}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prd.staff}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {prd.status === 'in-progress' ? (
                                                    <div className="flex flex-col items-end gap-1.5 min-w-[140px]">
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{prd.progress}% Complete</span>
                                                        <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${prd.progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-black text-gray-900 tracking-widest">{prd.efficiency}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {productions.map((prd, idx) => (
                            <motion.div
                                key={prd.id}
                                layout
                                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[300px]"
                            >
                                <div className="absolute right-0 top-0 h-40 w-40 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-50 transition-colors duration-500"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-16 w-16 bg-gray-900 rounded-[2rem] flex items-center justify-center shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white">
                                            <Factory className="h-7 w-7 text-white" />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${prd.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            prd.status === 'in-progress' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {prd.status.replace('-', ' ')}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase leading-tight line-clamp-1">{prd.product}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">{prd.id} • {prd.staff}</p>

                                    {prd.status === 'in-progress' && (
                                        <div className="mb-6 space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                                <span>In-Progress</span>
                                                <span>{prd.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-indigo-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${prd.progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Yield</p>
                                        <p className="text-2xl font-black text-gray-900">{prd.quantity}</p>
                                    </div>
                                    <button className="p-3 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                        Manage
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add New Production Modal Container */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg ring-1 ring-black/5">
                                            <Plus className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">New Production Batch</h2>
                                            <p className="text-gray-500 font-medium">Initialize a new manufacturing cycle</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Process Type</label>
                                            <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 appearance-none">
                                                <option>Standard Processing</option>
                                                <option>Batch Conversion</option>
                                                <option>Quality Testing</option>
                                                <option>Custom Recipe</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Target Product</label>
                                            <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 appearance-none">
                                                <option>Premium Coffee Bean</option>
                                                <option>Organic Milk 1L</option>
                                                <option>Chocolate Bar</option>
                                                <option>Laundry Detergent</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Expected Yield</label>
                                            <div className="relative">
                                                <input type="text" placeholder="e.g. 50" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900" />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">Units/KG</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Assign Supervisor</label>
                                            <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 appearance-none">
                                                <option>John Doe (Self)</option>
                                                <option>Sarah Smith</option>
                                                <option>Alex Wong</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-2 bg-indigo-600 rounded-lg">
                                                <Settings className="h-4 w-4 text-white" />
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-900">Advanced Parameters</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="h-5 w-5 rounded border-2 border-indigo-200 group-hover:border-indigo-600 transition-colors flex items-center justify-center">
                                                    <div className="h-2.5 w-2.5 bg-indigo-600 rounded-sm opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 transition-all"></div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-indigo-900">Auto-Update Inventory</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="h-5 w-5 rounded border-2 border-indigo-200 group-hover:border-indigo-600 transition-colors flex items-center justify-center">
                                                    <div className="h-2.5 w-2.5 bg-indigo-600 rounded-sm opacity-0 group-hover:opacity-10 scale-0 group-hover:scale-100 transition-all"></div>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-indigo-900">Quality Check Required</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-sm"
                                        >
                                            Discard Batch
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            Initialize Production <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quality Summary */}
            <div className="p-10 bg-gradient-to-br from-indigo-900 via-gray-900 to-black rounded-[4rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="relative flex flex-col xl:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-[3.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center ring-8 ring-white/5">
                                <span className="text-4xl font-black text-white">96%</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 border-2 border-gray-900">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Efficiency Analysis</h2>
                            <p className="text-indigo-200/60 font-medium max-w-md leading-relaxed">Your production team has exceeded the monthly output target by <span className="text-white font-black">4.2%</span>. All active batches are within safety parameters.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Details</button>
                        <button className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all">Generate Full Report</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}

function Box(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    )
}
