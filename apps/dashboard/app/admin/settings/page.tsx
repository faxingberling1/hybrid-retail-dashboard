"use client"

import { useState } from "react"
import {
    Settings, Store, Bell, Shield,
    Globe, CreditCard, Puzzle, HelpCircle,
    Save, ChevronRight, CheckCircle2, Moon,
    Smartphone, Share2, Languages
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("GENERAL")
    const [isSaving, setIsSaving] = useState(false)

    const tabs = [
        { id: "GENERAL", label: "General", icon: <Store className="h-4 w-4" /> },
        { id: "NOTIFICATIONS", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
        { id: "PAYMENTS", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
        { id: "SECURITY", label: "Security", icon: <Shield className="h-4 w-4" /> },
        { id: "INTEGRATIONS", label: "Integrations", icon: <Puzzle className="h-4 w-4" /> }
    ]

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 2000)
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Store Settings</h1>
                    <p className="text-gray-500 font-medium">Fine-tune your store's configuration and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-gray-900/20 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Publishing Changes..." : "Save Configuration"}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Navigation Sidebar */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-8">
                        <div className="space-y-1.5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm
                    ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">System Status</div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-gray-700">All Modules Healthy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">
                    {/* General Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
                        {...({} as any)}
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
                                    <input type="text" defaultValue="TechGadget Lahore" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Business Email</label>
                                    <input type="email" defaultValue="admin@techgadget.pk" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-12">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Store Address</label>
                                <textarea rows={3} defaultValue="Shop 42, Floor 2, IT Tower, Gulberg III, Lahore, Pakistan" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-900 resize-none" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Currency</label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 outline-none appearance-none cursor-pointer">
                                        <option>PKR (₨)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Language</label>
                                    <div className="relative">
                                        <Languages className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 outline-none appearance-none cursor-pointer">
                                            <option>English (International)</option>
                                            <option>Urdu (Pakistan)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Preferences Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-50 rounded-[3.5rem] p-12 border border-gray-100 shadow-sm"
                        {...({} as any)}
                    >
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-10">Interface Preferences</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { label: "Dark Mode Ecosystem", icon: <Moon />, desc: "Adjust theme based on sun" },
                                { label: "Mobile Optimization", icon: <Smartphone />, desc: "Responsive first layout" },
                                { label: "Social Connect", icon: <Share2 />, desc: "Public store visibility" }
                            ].map((pref) => (
                                <div key={pref.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-200/50 hover:border-blue-200 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                                    <div className="p-3 bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 w-fit rounded-2xl mb-6 transition-colors">
                                        {pref.icon}
                                    </div>
                                    <div className="text-sm font-black text-gray-900 mb-2">{pref.label}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.desc}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Support */}
            <div className="mt-20 py-12 border-t border-gray-100 flex flex-col items-center">
                <HelpCircle className="h-10 w-10 text-gray-300 mb-4" />
                <h3 className="text-lg font-black text-gray-900 mb-2">Need Help with Configuration?</h3>
                <p className="text-gray-500 font-medium mb-8 text-center max-w-sm">
                    Our specialized onboarding team is ready to assist you with any advanced setup requirements.
                </p>
                <button className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline">
                    Open Support Portal
                </button>
            </div>
        </div>
    )
}
