"use client"

import { motion } from "framer-motion"
import {
    Settings,
    Bell,
    Lock,
    Globe,
    Monitor,
    Moon,
    Smartphone,
    ShieldAlert
} from "lucide-react"

export default function UserSettingsPage() {
    const sections = [
        {
            title: "Display Preferences",
            desc: "Customize how the POS terminal looks",
            icon: Monitor,
            settings: [
                { label: "Dark Mode", type: "toggle", status: "Off" },
                { label: "High Contrast", type: "toggle", status: "Off" },
                { label: "Auto-Refresh Stock", type: "toggle", status: "On" },
            ]
        },
        {
            title: "Security & Privacy",
            desc: "Manage your account security",
            icon: Lock,
            settings: [
                { label: "Two-Factor Auth", type: "action", value: "Setup" },
                { label: "Active Sessions", type: "action", value: "View All" },
                { label: "API Tokens", type: "action", value: "Manage" },
            ]
        },
        {
            title: "Notifications",
            desc: "Manage alerts and updates",
            icon: Bell,
            settings: [
                { label: "New Notifications", type: "toggle", status: "On" },
                { label: "Stock Warnings", type: "toggle", status: "On" },
                { label: "Email Summaries", type: "toggle", status: "Off" },
            ]
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-lg ring-1 ring-white/10">
                    <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Personal Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your terminal and account preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, idx) => (
                    <motion.div
                        {...({
                            key: section.title,
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            transition: { delay: idx * 0.1 },
                            className: "bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm overflow-hidden relative group"
                        } as any)}
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            <div className="md:w-1/3 xl:w-1/4">
                                <div className="flex items-center gap-3 mb-2">
                                    <section.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                                    <h2 className="font-black text-gray-900 tracking-tight uppercase text-xs">{section.title}</h2>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{section.desc}</p>
                            </div>

                            <div className="flex-1 space-y-4">
                                {section.settings.map((s: any) => (
                                    <div key={s.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-50 hover:bg-white hover:border-gray-100 transition-all shadow-sm">
                                        <span className="text-sm font-bold text-gray-700">{s.label}</span>
                                        {s.type === 'toggle' ? (
                                            <button className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${s.status === 'On' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${s.status === 'On' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </button>
                                        ) : (
                                            <button className="text-xs font-black uppercase tracking-widest text-indigo-600 px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all">{s.value}</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-5 relative">
                    <div className="p-3 bg-red-100 rounded-2xl">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-red-900">Danger Zone</h3>
                        <p className="text-sm text-red-800/60 font-medium">Deactivate your account or reset all terminal data.</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-900/10 hover:bg-red-700 transition-all active:scale-95 relative">Reset Terminal</button>
            </div>
        </div>
    )
}
