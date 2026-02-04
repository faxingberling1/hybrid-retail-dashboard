
"use client"

import { Shield, Lock, Smartphone, Key, History } from "lucide-react"
import { motion } from "framer-motion"

interface SecuritySettingsProps {
    data: any
    onChange: (field: string, value: any) => void
}

export function SecuritySettings({ data, onChange }: SecuritySettingsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
        >
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Shield className="h-6 w-6" />
                    </div>
                    Vault Security
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-emerald-200 transition-all group">
                        <div className="p-3 bg-white text-emerald-600 w-fit rounded-2xl mb-6 shadow-sm">
                            <Lock className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-2">Password Policy</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-6">Require 12+ characters and symbols</p>
                        <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors">
                            Update Policy
                        </button>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-emerald-200 transition-all group">
                        <div className="p-3 bg-white text-emerald-600 w-fit rounded-2xl mb-6 shadow-sm">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 mb-2">Two-Factor Auth</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-6">Extra layer of biometric security</p>
                        <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all">
                            Enable 2FA
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-4">API & External Access</h3>
                    {[
                        { label: "Revoke Idle Sessions", desc: "Sign out after 24h of inactivity", icon: <History /> },
                        { label: "Strict API Filtering", desc: "Block requests from unknown IPs", icon: <Key /> }
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-6 border border-gray-100 rounded-[1.5rem] hover:bg-gray-50/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2 text-gray-400">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">{item.label}</div>
                                    <div className="text-[10px] font-medium text-gray-400">{item.desc}</div>
                                </div>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer relative">
                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
