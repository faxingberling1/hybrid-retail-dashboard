"use client"

import { useState } from "react"
import {
    Users, Search, Filter, Plus,
    Mail, Phone, MapPin, MoreHorizontal,
    Star, ShoppingBag, Calendar, ArrowRight,
    TrendingUp, Activity
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminCustomersPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const customers = [
        { id: "CUS-001", name: "Amna Khan", email: "amna@example.pk", phone: "+92 300 1234567", category: "PLATINUM", totalOrders: 42, totalSpent: "₨ 185,000", lastVisit: "2 days ago" },
        { id: "CUS-002", name: "Zaid Ahmed", email: "zaid@gmail.pk", phone: "+92 321 9876543", category: "GOLD", totalOrders: 15, totalSpent: "₨ 45,000", lastVisit: "Directly" },
        { id: "CUS-003", name: "Sara Ali", email: "sara.ali@office.com", phone: "+92 333 4445556", category: "SILVER", totalOrders: 8, totalSpent: "₨ 12,500", lastVisit: "1 week ago" },
        { id: "CUS-004", name: "Omar Farooq", email: "omar@farooq.pk", phone: "+92 345 1112223", category: "NEW", totalOrders: 1, totalSpent: "₨ 3,200", lastVisit: "Today" },
        { id: "CUS-005", name: "Hiba Noor", email: "hiba@noor.pk", phone: "+92 300 0009999", category: "GOLD", totalOrders: 12, totalSpent: "₨ 38,000", lastVisit: "3 days ago" }
    ]

    const stats = [
        { title: "Total Customers", value: "2,845", change: "+145 this month", icon: <Users className="h-5 w-5" />, color: "blue" },
        { title: "Active Now", value: "34", change: "Current sessions", icon: <Activity className="h-5 w-5" />, color: "emerald" },
        { title: "Avg. Life Value", value: "₨ 14,200", change: "+5.2% growth", icon: <TrendingUp className="h-5 w-5" />, color: "indigo" },
        { title: "Loyalty Rate", value: "68%", change: "+2% retention", icon: <Star className="h-5 w-5" />, color: "amber" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Customer Relations</h1>
                    <p className="text-gray-500 font-medium">Manage and nurture your customer base with deep insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
                        <Plus className="h-5 w-5" />
                        Add New Customer
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/10 hover:shadow-2xl transition-all group"
                    >
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight mb-2">{stat.value}</div>
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                            {stat.change}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-[1.5rem] outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-100">
                            <Filter className="h-4 w-4" />
                            Advanced Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Customer Identity</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Information</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Loyalty Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Activity</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="group hover:bg-gray-50/80 transition-all cursor-pointer">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 leading-tight">{customer.name}</div>
                                                <div className="text-xs text-blue-600 font-bold">{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Mail className="h-3.5 w-3.5" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Phone className="h-3.5 w-3.5" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider
                      ${customer.category === 'PLATINUM' ? 'bg-indigo-100 text-indigo-700' :
                                                customer.category === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                                                    customer.category === 'SILVER' ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'}
                    `}>
                                            <Star className="h-3 w-3 fill-current" />
                                            {customer.category}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div>
                                            <div className="text-sm font-black text-gray-900">{customer.totalSpent}</div>
                                            <div className="text-[10px] text-gray-400 font-bold">{customer.totalOrders} Orders • Last visit {customer.lastVisit}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm transition-all active:scale-90">
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Showing 5 of 2,845 customers</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-400 transition-all cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-50 transition-all shadow-sm">Next Page</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
