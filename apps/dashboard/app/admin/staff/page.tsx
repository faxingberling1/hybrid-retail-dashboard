"use client"

import { useState } from "react"
import {
    Users, UserPlus, Shield, Key,
    Mail, Phone, Clock, Search,
    Filter, MoreVertical, BadgeCheck,
    CheckCircle2, AlertCircle, Ban, ArrowUpRight
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminStaffPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const staff = [
        { id: "STF-101", name: "Ahmed Raza", email: "ahmed.raza@store.pk", role: "MANAGER", status: "ACTIVE", lastActive: "Just now", shifts: "Morning", rating: 4.8 },
        { id: "STF-102", name: "Fatima Noor", email: "fatima@store.pk", role: "CASHIER", status: "ACTIVE", lastActive: "15 mins ago", shifts: "Evening", rating: 4.9 },
        { id: "STF-103", name: "Bilal Sheikh", email: "bilal@store.pk", role: "INVENTORY", status: "ON_BREAK", lastActive: "2 hours ago", shifts: "Full Day", rating: 4.7 },
        { id: "STF-104", name: "Zoya Khan", email: "zoya@store.pk", role: "CASHIER", status: "OFFLINE", lastActive: "Yesterday", shifts: "Morning", rating: 4.5 },
        { id: "STF-105", name: "Hamza Ali", email: "hamza@store.pk", role: "MANAGER", status: "INACTIVE", lastActive: "3 days ago", shifts: "N/A", rating: 4.2 }
    ]

    const metrics = [
        { title: "Total Members", value: "24", sub: "All roles", color: "blue" },
        { title: "On Shift", value: "8", sub: "Currently working", color: "emerald" },
        { title: "Avg. Performance", value: "4.7", sub: "Rating score", color: "amber" },
        { title: "Pending Invites", value: "3", sub: "Awaiting response", color: "indigo" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Team Management</h1>
                    <p className="text-gray-500 font-medium">Coordinate your workforce and security protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-black shadow-sm hover:bg-gray-50 transition-all">
                        <Shield className="h-4 w-4" />
                        Roles & Permissions
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                        <UserPlus className="h-5 w-5" />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {metrics.map((m, idx) => (
                    <motion.div
                        key={m.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white p-6 rounded-[2.5rem] border-2 border-transparent hover:border-${m.color}-100 shadow-xl shadow-gray-200/20 transition-all`}
                        {...({} as any)}
                    >
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{m.title}</div>
                        <div className={`text-4xl font-black text-gray-900 mb-1`}>{m.value}</div>
                        <div className="text-[10px] font-bold text-gray-400">{m.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Staff Grid */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden mb-12">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or ID..."
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-gray-100">
                    {staff.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-8 hover:bg-gray-50/50 transition-all group relative"
                            {...({} as any)}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400 border-4 border-white shadow-md overflow-hidden">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${member.status === 'ACTIVE' ? 'bg-green-500' :
                                                member.status === 'ON_BREAK' ? 'bg-amber-500' :
                                                    member.status === 'OFFLINE' ? 'bg-gray-400' : 'bg-red-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 leading-tight">{member.name}</h3>
                                        <div className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">{member.role}</div>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {member.email}
                                </div>
                                <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    Shift: {member.shifts} • Active {member.lastActive}
                                </div>
                            </div>

                            <div className="flex h-12 rounded-2xl bg-gray-50 p-1">
                                <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                                    <BadgeCheck className="h-4 w-4" />
                                    Activity
                                </button>
                                <div className="w-[1px] bg-gray-200 my-2" />
                                <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                                    <Key className="h-4 w-4" />
                                    Access
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
