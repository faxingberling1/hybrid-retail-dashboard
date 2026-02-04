
"use client"

import { Bell, Mail, Smartphone, Monitor } from "lucide-react"
import { motion } from "framer-motion"

interface NotificationSettingsProps {
    data: any
    onChange: (field: string, value: any) => void
}

export function NotificationSettings({ data, onChange }: NotificationSettingsProps) {
    const preferences = [
        {
            id: "email_notifications",
            label: "Email Notifications",
            desc: "Receive daily reports and stock alerts via email",
            icon: <Mail className="h-5 w-5" />
        },
        {
            id: "push_notifications",
            label: "Push Notifications",
            desc: "Critical alerts on your mobile device",
            icon: <Smartphone className="h-5 w-5" />
        },
        {
            id: "desktop_notifications",
            label: "Desktop Notifications",
            desc: "Real-time updates while using the dashboard",
            icon: <Monitor className="h-5 w-5" />
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden"
        >
            <div className="max-w-3xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <Bell className="h-6 w-6" />
                    </div>
                    Notifications
                </h2>

                <div className="space-y-6">
                    {preferences.map((pref) => (
                        <div key={pref.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-gray-200 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white text-gray-400 group-hover:text-blue-600 rounded-xl shadow-sm transition-colors">
                                    {pref.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 mb-1">{pref.label}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.desc}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => onChange(pref.id, !data[pref.id])}
                                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${data[pref.id] ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${data[pref.id] ? 'left-7' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-start gap-6">
                    <div className="p-3 bg-blue-100/50 text-blue-600 rounded-2xl">
                        <Bell className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-900 mb-2 font-bold">Smart Digest Frequency</h4>
                        <p className="text-xs text-blue-700/70 mb-6 leading-relaxed font-medium">
                            Choose how often you want to receive consolidated notification summaries.
                        </p>
                        <select
                            value={data.digest_frequency || "realtime"}
                            onChange={(e) => onChange("digest_frequency", e.target.value)}
                            className="bg-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 outline-none cursor-pointer"
                        >
                            <option value="realtime">Real-time alerts</option>
                            <option value="daily">Daily summary</option>
                            <option value="weekly">Weekly digest</option>
                        </select>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
