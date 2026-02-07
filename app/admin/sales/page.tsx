"use client"

import { useState } from "react"
import {
    ShoppingBag, Search, Filter, Download,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Clock, Calendar, User, CreditCard, ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminSalesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const stats = [
        { title: "Total Revenue", value: "₨ 1,240,000", change: "+12.5%", trending: "up", color: "blue" },
        { title: "Total Orders", value: "856", change: "+8.2%", trending: "up", color: "indigo" },
        { title: "Average Order", value: "₨ 1,448", change: "-2.4%", trending: "down", color: "purple" },
        { title: "Conversion Rate", value: "3.2%", change: "+0.5%", trending: "up", color: "emerald" }
    ]

    const recentSales = [
        { id: "ORD-8821", customer: "Amna Khan", item: "Wireless Earbuds", amount: "₨ 4,500", status: "COMPLETED", date: "10 mins ago" },
        { id: "ORD-8820", customer: "Zaid Ahmed", item: "Smart Watch S4", amount: "₨ 12,000", status: "PENDING", date: "25 mins ago" },
        { id: "ORD-8819", customer: "Sara Ali", item: "Mechanical Keyboard", amount: "₨ 8,500", status: "COMPLETED", date: "1 hour ago" },
        { id: "ORD-8818", customer: "Omar Farooq", item: "USB-C Hub 7-in-1", amount: "₨ 3,200", status: "CANCELLED", date: "2 hours ago" },
        { id: "ORD-8817", customer: "Hiba Noor", item: "Laptop Stand", amount: "₨ 2,800", status: "COMPLETED", date: "4 hours ago" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Sales Analytics</h1>
                    <p className="text-gray-500 font-medium">Monitor your store's performance and transaction history</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black ${stat.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                                {stat.trending === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </div>
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</div>
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Advanced Filter Bar */}
            <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-md mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer, or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-xl outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                            <Filter className="h-5 w-5" />
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block" />
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Sort By:</span>
                            <select className="bg-transparent text-sm font-bold text-gray-900 outline-none cursor-pointer">
                                <option>Newest First</option>
                                <option>Amount: High to Low</option>
                                <option>Status</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">Recent Transactions</h2>
                    <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentSales.map((sale, idx) => (
                                <tr key={sale.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{sale.id}</div>
                                                <div className="text-xs text-gray-500">{sale.item}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                                {sale.customer.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{sale.customer}</div>
                                                <div className="text-[10px] text-gray-400">{sale.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`
                      inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase
                      ${sale.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                sale.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                    `}>
                                            {sale.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-black text-gray-900">{sale.amount}</div>
                                        <div className="text-[10px] text-gray-500">via Credit Card</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                            <ChevronRight className="h-5 w-5" />
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
