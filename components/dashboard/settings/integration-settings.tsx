
"use client"

import { Puzzle, MessageSquare, Briefcase, Zap, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface IntegrationSettingsProps {
    data: any
}

export function IntegrationSettings({ data }: IntegrationSettingsProps) {
    const integrations = [
        { label: "WhatsApp Business", desc: "Automated receipts & alerts", icon: <MessageSquare />, color: "emerald", active: true },
        { label: "Slack Ecosystem", desc: "Internal team inventory logs", icon: <Zap />, color: "indigo", active: false },
        { label: "External ERP", desc: "Sync stock with legacy systems", icon: <Briefcase />, color: "blue", active: false }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
        >
            <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Puzzle className="h-6 w-6" />
                        </div>
                        Marketplace
                    </h2>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all">
                        <Plus className="h-4 w-4" />
                        Discover
                    </button>
                </div>

                <div className="grid gap-4">
                    {integrations.map((item) => (
                        <div key={item.label} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-purple-200 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className={`p-4 bg-white text-${item.color}-500 rounded-3xl shadow-sm group-hover:shadow-md transition-all`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-lg font-black text-gray-900 leading-tight">{item.label}</div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{item.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {item.active ? (
                                    <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        Operational
                                    </div>
                                ) : (
                                    <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-colors">
                                        Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Request a custom integration?</p>
                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                        Contact Hybrid Support
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
