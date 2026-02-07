"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Receipt,
    Printer,
    Mail,
    Download,
    CreditCard,
    Wallet,
    Calendar,
    Clock,
    User,
    CheckCircle2,
    Package
} from "lucide-react"

interface TransactionDetailModalProps {
    transaction: any
    isOpen: boolean
    onClose: () => void
}

export default function TransactionDetailModal({ transaction, isOpen, onClose }: TransactionDetailModalProps) {
    if (!transaction) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header Area */}
                        <div className="bg-gray-900 p-8 sm:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <div className="relative flex justify-between items-start">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-md border border-white/10">
                                        <Receipt className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{transaction.id}</h2>
                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-green-500/20 flex items-center gap-1 italic">
                                                <CheckCircle2 className="h-2 w-2" /> Verified
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">Transaction Ledger Detail</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/10 group"
                                >
                                    <X className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            <div className="relative mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Customer</p>
                                    <p className="text-sm font-black italic">{transaction.customer}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Timestamp</p>
                                    <p className="text-sm font-black italic">{transaction.time || "10:30 AM"}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Payment Method</p>
                                    <div className="flex items-center gap-2">
                                        {transaction.type === 'Card' ? <CreditCard className="h-3 w-3 text-indigo-400" /> : <Wallet className="h-3 w-3 text-emerald-400" />}
                                        <p className="text-sm font-black italic uppercase">{transaction.type}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Total Amount</p>
                                    <p className="text-xl font-black italic text-indigo-400">₨ {transaction.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Body / Items Area */}
                        <div className="p-8 sm:p-10 max-h-[400px] overflow-y-auto no-scrollbar">
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="h-4 w-4 text-gray-300" />
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Itemized Receipt</h3>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50 group hover:border-indigo-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-300">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800 italic uppercase">Premium Wireless Headphones</p>
                                                <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-0.5">Quantity: 01 • SKU: PRO-WH-001</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-gray-900 mt-1">₨ 4,500</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Financial Summary */}
                            <div className="mt-10 pt-8 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
                                    <span>Subtotal</span>
                                    <span>₨ {(transaction.amount / 1.17).toFixed(0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-rose-500 uppercase tracking-widest px-4 italic">
                                    <span>GST (17%)</span>
                                    <span>+ ₨ {(transaction.amount * 0.17).toFixed(0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-3xl mt-6 shadow-xl shadow-indigo-900/20">
                                    <div>
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Balance Paid</p>
                                        <p className="text-2xl font-black italic tracking-tighter">SUCCESS</p>
                                    </div>
                                    <p className="text-3xl font-black italic tracking-tighter text-indigo-400">₨ {transaction.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="p-8 sm:p-10 bg-gray-50 flex flex-wrap gap-4">
                            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-white/80 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm group">
                                <Printer className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
                                Print Receipt
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-white/80 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm group">
                                <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-900" />
                                Export PDF
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/20">
                                <Mail className="h-4 w-4" />
                                Email Customer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
