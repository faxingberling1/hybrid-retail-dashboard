"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
    User,
    Mail,
    MapPin,
    Phone,
    Calendar,
    ShieldCheck,
    Edit3,
    Camera
} from "lucide-react"

export default function UserProfilePage() {
    const { data: session } = useSession()

    const stats = [
        { label: "Joined", value: "6 Months Ago", icon: Calendar },
        { label: "Role", value: "Staff / Cashier", icon: ShieldCheck },
        { label: "Workplace", value: "Main Branch", icon: MapPin },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Profile</h1>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-900/20 hover:scale-105 transition-all active:scale-95">
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-[3rem] p-8 text-center shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative inline-block mb-6">
                            <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 overflow-hidden ring-4 ring-white">
                                <User className="h-16 w-16 text-white" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-xl border border-gray-100 text-gray-400 hover:text-green-600 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        <h2 className="text-xl font-black text-gray-900 mb-1">{session?.user?.name || "Staff User"}</h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{session?.user?.role || "Staff"}</p>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-50">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-600 truncate">{session?.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-50">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-600">0300-1234567</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {stats.map((s) => (
                            <div key={s.label} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-green-100 transition-all">
                                <s.icon className="h-5 w-5 text-gray-400 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                                <p className="font-bold text-gray-900">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-8">Role Capabilities</h3>
                        <div className="space-y-4">
                            {[
                                { title: "POS Operations", desc: "Full access to process sales and manage terminal", active: true },
                                { title: "Inventory Viewer", desc: "Check stock levels and SKU locations", active: true },
                                { title: "Customer Management", desc: "Register and lookup loyalty accounts", active: true },
                                { title: "Financial Reporting", desc: "Access shift and personal performance data", active: true },
                                { title: "System Admin", desc: "Change store settings or manage users", active: false },
                            ].map((cap) => (
                                <div key={cap.title} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${cap.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-200'}`}></div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${cap.active ? 'text-gray-900' : 'text-gray-400 italic'}`}>{cap.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{cap.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
