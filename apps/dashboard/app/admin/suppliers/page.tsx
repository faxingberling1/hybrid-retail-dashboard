"use client"

import { useState } from "react"
import {
    Truck, Search, Filter, Plus,
    Package, Mail, Phone, Calendar,
    MoreVertical, CheckCircle2, Clock,
    MapPin, Globe, CreditCard, ChevronRight,
    Star, ArrowRight
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminSuppliersPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const suppliers = [
        { id: "SUP-001", name: "Global Electronics Ltd", contact: "John Smith", email: "sales@globalelect.com", category: "ELECTRONICS", status: "ACTIVE", rating: 4.8 },
        { id: "SUP-002", name: "Modern Fashion Hub", contact: "Alice Wong", email: "alice@modernfashion.pk", category: "FASHION", status: "PENDING", rating: 4.5 },
        { id: "SUP-003", name: "Supreme Home Goods", contact: "Zaid Ali", email: "zaid@supremehome.com", category: "HOME", status: "ACTIVE", rating: 4.2 },
        { id: "SUP-004", name: "Prime Grocers Co", contact: "Sara Khan", email: "sara@primegrocers.pk", category: "GROCERY", status: "INACTIVE", rating: 3.9 },
        { id: "SUP-005", name: "Tech Accessories Inc", contact: "David Miller", email: "david@techacc.com", category: "ELECTRONICS", status: "ACTIVE", rating: 4.9 }
    ]

    const stats = [
        { title: "Total Suppliers", value: "85", icon: <Truck className="h-5 w-5" />, color: "blue" },
        { title: "Active Orders", value: "12", icon: <Package className="h-5 w-5" />, color: "emerald" },
        { title: "Avg Lead Time", value: "3.2 Days", icon: <Clock className="h-5 w-5" />, color: "amber" },
        { title: "Quality Score", value: "94%", icon: <CheckCircle2 className="h-5 w-5" />, color: "indigo" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Supply Chain</h1>
                    <p className="text-gray-500 font-medium">Manage your vendor relationships and procurement flows</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                        <Plus className="h-5 w-5" />
                        Connect New Supplier
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group cursor-default"
                        {...({} as any)}
                    >
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 w-fit mb-6 transition-transform group-hover:scale-110`}>
                            {stat.icon}
                        </div>
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</div>
                        <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Supplier Grid/List Section */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company, contact, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-[1.5rem] outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Company & ID</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Supply Health</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {suppliers.map((sup) => (
                                <tr key={sup.id} className="group hover:bg-gray-50/80 transition-all cursor-pointer">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 leading-tight">{sup.name}</div>
                                                <div className="text-[10px] font-black tracking-widest uppercase text-blue-600 mt-1">{sup.id} • {sup.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-gray-900">{sup.contact}</div>
                                            <div className="text-xs text-gray-500">{sup.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className={`
                      inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                      ${sup.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                sup.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                    `}>
                                            {sup.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="flex text-amber-400">
                                                <Star className="h-3 w-3 fill-current" />
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{sup.rating}</span>
                                        </div>
                                        <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${sup.rating * 20}%` }} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function Building2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}
