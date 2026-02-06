"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Users,
    Search,
    UserPlus,
    Mail,
    Phone,
    ArrowUpRight,
    MoreHorizontal,
    Star
} from "lucide-react"

export default function UserCustomersPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const customers = [
        { id: 1, name: "Ali Ahmed", email: "ali@example.com", phone: "0300-1234567", points: 450, visits: 12, lastVisit: "2 hours ago" },
        { id: 2, name: "Sara Khan", email: "sara.k@gmail.com", phone: "0321-7654321", points: 1280, visits: 45, lastVisit: "Yesterday" },
        { id: 3, name: "Usman Malik", email: "usman.m@outlook.com", phone: "0345-8889900", points: 50, visits: 2, lastVisit: "3 days ago" },
        { id: 4, name: "Fatima Raza", email: "fatima@company.com", phone: "0312-4445566", points: 890, visits: 23, lastVisit: "1 week ago" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/20">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Directory</h1>
                        <p className="text-sm text-gray-500">Manage customer loyalty and profiles</p>
                    </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-95">
                    <UserPlus className="h-5 w-5" />
                    New Customer
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, email or phone number..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customers.map((customer, index) => (
                    <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400 group-hover:from-orange-50 group-hover:to-orange-100 group-hover:text-orange-600 transition-all border border-gray-100">
                                    <span className="text-xl font-black">{customer.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                            <Mail className="h-3 w-3" /> {customer.email}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                            <Phone className="h-3 w-3" /> {customer.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-orange-50 transition-all">
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Points</p>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                                    <p className="font-black text-gray-900 tracking-tight">{customer.points}</p>
                                </div>
                            </div>
                            <div className="text-center border-x border-gray-200">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Visits</p>
                                <p className="font-black text-gray-900 tracking-tight">{customer.visits}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Recent</p>
                                <p className="font-bold text-gray-900 tracking-tight text-xs mt-0.5">{customer.lastVisit}</p>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 group-hover:text-orange-600 transition-colors uppercase tracking-widest">
                            View History
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
