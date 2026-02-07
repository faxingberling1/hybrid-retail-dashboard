"use client"

import { useState } from "react"
import {
    CreditCard, Search, Filter, Download,
    ArrowRight, Landmark, Wallet, Globe,
    CheckCircle2, Clock, AlertCircle, FileText,
    ChevronRight, Calendar
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminTransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const transactions = [
        { id: "TXN-55291", type: "PAYMENT", customer: "Amna Khan", amount: "₨ 4,500", method: "Mastercard", status: "SUCCESS", date: "Today, 10:45 AM" },
        { id: "TXN-55290", type: "REFUND", customer: "Zaid Ahmed", amount: "-₨ 1,200", method: "Store Credit", status: "PENDING", date: "Today, 09:20 AM" },
        { id: "TXN-55289", type: "PAYMENT", customer: "Sara Ali", amount: "₨ 12,000", method: "Bank Transfer", status: "SUCCESS", date: "Yesterday, 04:15 PM" },
        { id: "TXN-55288", type: "PAYMENT", customer: "Omar Farooq", amount: "₨ 3,200", method: "Cash", status: "FAILED", date: "Yesterday, 02:30 PM" },
        { id: "TXN-55287", type: "PAYMENT", customer: "Hiba Noor", amount: "₨ 2,800", method: "Visa", status: "SUCCESS", date: "Yesterday, 11:10 AM" }
    ]

    const overview = [
        { label: "Successful", count: "1,240", value: "₨ 4.2M", color: "emerald" },
        { label: "Pending", count: "42", value: "₨ 125K", color: "amber" },
        { label: "Failed", count: "12", value: "₨ 45K", color: "red" }
    ]

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Financial Ledger</h1>
                    <p className="text-gray-500 font-medium">Real-time monitoring of all store transactions and payments</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-black shadow-sm hover:bg-gray-50 transition-all">
                        <Download className="h-5 w-5" />
                        Export Ledger
                    </button>
                </div>
            </div>

            {/* Payment Methods & Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {overview.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20"
                        >
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{item.label}</div>
                            <div className="text-3xl font-black text-gray-900 mb-1">{item.value}</div>
                            <div className={`text-[10px] font-bold text-${item.color}-600 bg-${item.color}-50 px-2 py-0.5 rounded-full w-fit`}>
                                {item.count} Txns
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500 rounded-2xl">
                            <Landmark className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Linked Account</div>
                            <div className="font-bold">Habib Bank Ltd.</div>
                        </div>
                    </div>
                    <div className="text-xs text-blue-300 font-medium leading-relaxed opacity-80">
                        Automated payouts are scheduled for every Tuesday at 03:00 AM PKT.
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Txn ID, customer, or amount..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-[1.5rem] outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                            <Calendar className="h-5 w-5" />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-100">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">ID & Type</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Method & Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-gray-50/80 transition-all cursor-pointer">
                                    <td className="px-8 py-7">
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{txn.id}</div>
                                            <div className="text-[10px] font-black tracking-widest uppercase text-gray-400">{txn.type}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-black">
                                                {txn.customer.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{txn.customer}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className={`text-sm font-black ${txn.type === 'REFUND' ? 'text-orange-600' : 'text-gray-900'}`}>{txn.amount}</div>
                                        <div className="text-[10px] text-gray-400 font-bold">{txn.date}</div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm font-bold text-gray-600">{txn.method}</div>
                                            <div className={`
                        flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                        ${txn.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                                    txn.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
                      `}>
                                                {txn.status === 'SUCCESS' ? <CheckCircle2 className="h-3 w-3" /> :
                                                    txn.status === 'PENDING' ? <Clock className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                                {txn.status}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                            <FileText className="h-5 w-5" />
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
