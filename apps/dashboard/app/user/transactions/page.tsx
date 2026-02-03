"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CreditCard,
    Search,
    Filter,
    ArrowUpRight,
    Download,
    Receipt,
    Clock,
    ChevronDown,
    ArrowDownRight,
    ArrowUpDown,
    CheckCircle2,
    Calendar,
    Wallet,
    Layers
} from "lucide-react"
import TransactionKpiSection from "@/components/dashboard/transactions/TransactionKpiSection"
import TransactionDetailModal from "@/components/dashboard/transactions/TransactionDetailModal"

export default function UserTransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedMethod, setSelectedMethod] = useState("all")
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const transactions = [
        { id: "TXN-0941", time: "10:30 AM", customer: "Ali Ahmed", amount: 12500, type: "Card", status: "completed" },
        { id: "TXN-0942", time: "11:15 AM", customer: "Sara Khan", amount: 8750, type: "Cash", status: "completed" },
        { id: "TXN-0943", time: "12:45 PM", customer: "Usman Malik", amount: 25000, type: "Card", status: "pending" },
        { id: "TXN-0944", time: "01:30 PM", customer: "Fatima Raza", amount: 6200, type: "Cash", status: "completed" },
        { id: "TXN-0945", time: "02:15 PM", customer: "Bilal Hussain", amount: 15800, type: "Card", status: "completed" },
        { id: "TXN-0946", time: "03:00 PM", customer: "Zainab Bibi", amount: 3200, type: "Cash", status: "completed" },
        { id: "TXN-0947", time: "03:45 PM", customer: "Mustafa Ali", amount: 19500, type: "Card", status: "completed" },
        { id: "TXN-0948", time: "04:20 PM", customer: "Hassan Raza", amount: 45000, type: "Card", status: "completed" },
        { id: "TXN-0949", time: "05:00 PM", customer: "Ibrahim Khalid", amount: 1200, type: "Cash", status: "failed" },
    ]

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.customer.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === "all" || txn.status === selectedStatus
        const matchesMethod = selectedMethod === "all" || txn.type === selectedMethod
        return matchesSearch && matchesStatus && matchesMethod
    })

    return (
        <div className="space-y-10 pb-20">
            {/* Header Intelligence */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-4 bg-gray-900 rounded-[1.5rem] shadow-2xl shadow-gray-900/20 rotate-3">
                            <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Transaction Ledger</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Live Cloud Sync Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:bg-gray-50 transition-all shadow-sm group">
                        <Calendar className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
                        Date Range
                        <ChevronDown className="h-4 w-4 text-gray-300" />
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 group">
                        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                        Export Audit
                    </button>
                </div>
            </div>

            {/* KPI Overview */}
            <TransactionKpiSection />

            {/* Filtering & Search Hub */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Trace ID or Customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-[1.5rem] font-black text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-6 py-5 bg-gray-50 border-none rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-gray-600 focus:ring-2 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer pr-12 relative"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1rem' }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>

                        <select
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="px-6 py-5 bg-gray-50 border-none rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-gray-600 focus:ring-2 focus:ring-indigo-500/10 outline-none appearance-none cursor-pointer pr-12 relative"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1rem' }}
                        >
                            <option value="all">All Methods</option>
                            <option value="Card">Card</option>
                            <option value="Cash">Cash</option>
                        </select>

                        <button className="p-5 bg-gray-900 text-white rounded-[1.5rem] hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/20">
                            <Layers className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions Grid/List */}
            <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-8 text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-2">
                    <div className="col-span-4 flex items-center gap-2">
                        <ArrowUpDown className="h-3 w-3" /> Ledger Entry
                    </div>
                    <div className="col-span-3">Customer Profile</div>
                    <div className="col-span-2">Payment</div>
                    <div className="col-span-2 text-right">Value</div>
                    <div className="col-span-1"></div>
                </div>

                <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((txn, index) => (
                        <motion.div
                            {...({
                                key: txn.id,
                                initial: { opacity: 0, x: -20 },
                                animate: { opacity: 1, x: 0 },
                                exit: { opacity: 0, scale: 0.95 },
                                transition: { delay: index * 0.05 },
                                layout: true,
                                className: "bg-white p-6 rounded-[2rem] border border-gray-100 grid grid-cols-12 gap-4 items-center hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
                            } as any)}
                        >
                            {/* Visual Accent */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${txn.status === 'completed' ? 'bg-green-500' :
                                txn.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                                }`}></div>

                            <div className="col-span-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-colors ${txn.status === 'completed' ? 'bg-green-50 text-green-600' :
                                        txn.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        <Receipt className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-gray-900 italic tracking-tighter">{txn.id}</span>
                                            {txn.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 fill-green-50" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {txn.time}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">• CLOUD-AUTH</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-3">
                                <p className="text-sm font-black text-gray-700 italic uppercase">{txn.customer}</p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5">Registered Patron</p>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${txn.type === 'Card' ? 'bg-indigo-50 text-indigo-400' : 'bg-emerald-50 text-emerald-400'}`}>
                                        {txn.type === 'Card' ? <CreditCard className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{txn.type}</span>
                                </div>
                            </div>

                            <div className="col-span-2 text-right">
                                <p className="text-xl font-black text-gray-900 tracking-tighter italic">₨ {txn.amount.toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${txn.status === 'completed' ? 'bg-green-50 text-green-600' :
                                        txn.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1 flex justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedTransaction(txn)
                                        setIsDetailModalOpen(true)
                                    }}
                                    className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all border border-gray-100 group-hover:border-transparent"
                                >
                                    <ArrowUpRight className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredTransactions.length === 0 && (
                    <motion.div
                        {...({
                            initial: { opacity: 0 },
                            animate: { opacity: 1 },
                            className: "py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200"
                        } as any)}
                    >
                        <div className="p-6 bg-white w-20 h-20 rounded-[2rem] shadow-xl mx-auto mb-6 flex items-center justify-center">
                            <Search className="h-8 w-8 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 italic uppercase">No Traces Found</h3>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Adjust the filters to broaden your search</p>
                    </motion.div>
                )}
            </div>

            {/* Detail Modal */}
            <TransactionDetailModal
                transaction={selectedTransaction}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />
        </div>
    )
}
