"use client"

import { useState } from "react"
import {
    LayoutDashboard,
    Settings,
    Printer,
    FileText,
    Shield,
    Zap,
    Plus,
    ChevronRight,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { HardwareConfig } from "@/components/dashboard/super-admin/pos/hardware-config"
import { ReceiptBuilder } from "@/components/dashboard/super-admin/pos/receipt-builder"
import { OrganizationAccess } from "@/components/dashboard/super-admin/pos/organization-access"

export default function SuperAdminPosPage() {
    const [activeTab, setActiveTab] = useState("HARDWARE")

    const tabs = [
        { id: "HARDWARE", label: "Hardware Support", icon: <Printer className="h-4 w-4" /> },
        { id: "RECEIPT", label: "Receipt Designer", icon: <FileText className="h-4 w-4" /> },
        { id: "ACCESS", label: "Organization Access", icon: <Shield className="h-4 w-4" /> },
        { id: "SECURITY", label: "POS Security", icon: <Shield className="h-4 w-4" /> },
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">POS System Control</h1>
                    </div>
                    <p className="text-gray-500 font-medium">Configure global terminal standards and hardware protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                        System Ready
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105'
                                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[500px]"
                >
                    {activeTab === "HARDWARE" && <HardwareConfig />}
                    {activeTab === "RECEIPT" && <ReceiptBuilder />}
                    {activeTab === "ACCESS" && <OrganizationAccess />}
                    {activeTab === "SECURITY" && (
                        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col items-center justify-center text-center">
                            <div className="p-6 bg-rose-50 rounded-full mb-6">
                                <Shield className="h-12 w-12 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Terminal Security Protocols</h3>
                            <p className="text-gray-500 max-w-md font-medium mb-8">
                                Manage end-to-end encryption for terminal transactions and IP-based access control.
                            </p>
                            <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                                Configure Security Policies
                            </button>
                        </div>
                    )}
                    {activeTab === "GLOBAL" && (
                        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col items-center justify-center text-center">
                            <div className="p-6 bg-amber-50 rounded-full mb-6">
                                <Zap className="h-12 w-12 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Default Hardware Presets</h3>
                            <p className="text-gray-500 max-w-md font-medium mb-8">
                                Define universal baud rates, paper sizes, and character sets for all organization terminals.
                            </p>
                            <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                                Manage Master Presets
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Footer Status */}
            <div className="mt-20 flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Settings className="h-6 w-6 text-gray-400 animate-spin-slow" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 text-sm">Hardware Gateway</h4>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">v1.2.0 - All systems operational</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-100 transition-all">
                        Documentation
                    </button>
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-100 transition-all">
                        Support API
                    </button>
                </div>
            </div>
        </div>
    )
}
