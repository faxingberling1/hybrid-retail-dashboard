
"use client"

import { Globe, Languages } from "lucide-react"
import { motion } from "framer-motion"

interface GeneralSettingsProps {
    data: any
    onChange: (field: string, value: any) => void
}

export function GeneralSettings({ data, onChange }: GeneralSettingsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
        >
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Globe className="h-6 w-6" />
                    </div>
                    Business Profile
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Official Store Name</label>
                        <input
                            type="text"
                            value={data.name || ""}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Business Email</label>
                        <input
                            type="email"
                            value={data.billing_email || ""}
                            onChange={(e) => onChange("billing_email", e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900"
                        />
                    </div>
                </div>

                <div className="space-y-2 mb-12">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Store Address</label>
                    <textarea
                        rows={3}
                        value={data.address || ""}
                        onChange={(e) => onChange("address", e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900 resize-none"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Currency</label>
                        <select
                            value={data.currency || "PKR"}
                            onChange={(e) => onChange("currency", e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 outline-none appearance-none cursor-pointer"
                        >
                            <option value="PKR">PKR (₨)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Timezone</label>
                        <select
                            value={data.timezone || "Asia/Karachi"}
                            onChange={(e) => onChange("timezone", e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 outline-none appearance-none cursor-pointer"
                        >
                            <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                            <option value="UTC">UTC (GMT+0)</option>
                            <option value="America/New_York">New York (GMT-5)</option>
                            <option value="Europe/London">London (GMT+0)</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
