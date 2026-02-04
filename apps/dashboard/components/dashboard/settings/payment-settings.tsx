
"use client"

import { CreditCard, Wallet, Percent, Receipt } from "lucide-react"
import { motion } from "framer-motion"

interface PaymentSettingsProps {
    data: any
    onChange: (field: string, value: any) => void
}

export function PaymentSettings({ data, onChange }: PaymentSettingsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
        >
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    Terminal Configuration
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Default Tax Rate (%)</label>
                        <div className="relative">
                            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input
                                type="number"
                                value={data.tax_rate || 17}
                                onChange={(e) => onChange("tax_rate", parseFloat(e.target.value))}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Invoice Prefix</label>
                        <div className="relative">
                            <Receipt className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input
                                type="text"
                                value={data.invoice_prefix || "INV"}
                                onChange={(e) => onChange("invoice_prefix", e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">Enabled Payment Methods</h3>
                    {[
                        { id: "cash", label: "Cash Terminal", icon: <Wallet /> },
                        { id: "card", label: "Credit/Debit Card", icon: <CreditCard /> }
                    ].map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-gray-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-gray-400 rounded-xl shadow-sm">
                                    {method.icon}
                                </div>
                                <div className="text-sm font-black text-gray-900">{method.label}</div>
                            </div>
                            <div className="w-14 h-8 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute top-1 left-7 w-6 h-6 bg-white rounded-full shadow-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
