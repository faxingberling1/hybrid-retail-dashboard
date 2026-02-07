"use client"

import { useState } from "react"
import {
    Calendar, Clock, Plus, ChevronLeft,
    ChevronRight, Users, Bell, MoreHorizontal,
    CheckCircle2, Layout, LayoutGrid, CalendarDays,
    Target, Zap
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminSchedulePage() {
    const [view, setView] = useState("MONTH")

    const events = [
        { title: "Morning Shift", time: "09:00 AM", staff: "5 Members", type: "SHIFT", color: "blue" },
        { title: "Inventory Audit", time: "11:30 AM", staff: "Bilal S.", type: "TASK", color: "indigo" },
        { title: "Supplier Delivery", time: "01:00 PM", staff: "Global Elec", type: "EVENT", color: "amber" },
        { title: "Evening Shift", time: "05:00 PM", staff: "4 Members", type: "SHIFT", color: "emerald" },
        { title: "System Maintenance", time: "11:00 PM", staff: "IT Team", type: "TASK", color: "purple" }
    ]

    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Operation Schedule</h1>
                    <p className="text-gray-500 font-medium">Coordinate shifts, deliveries, and critical business tasks</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm mr-2">
                        <button onClick={() => setView("MONTH")} className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${view === 'MONTH' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400'}`}>Month</button>
                        <button onClick={() => setView("WEEK")} className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${view === 'WEEK' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400'}`}>Week</button>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                        <Plus className="h-5 w-5" />
                        New Event
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Calendar Main Grid */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <CalendarDays className="h-7 w-7 text-blue-600" />
                            February 2026
                        </h2>
                        <div className="flex items-center gap-2">
                            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-900 transition-colors">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-gray-900 transition-colors">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{day}</div>
                        ))}
                        {days.map(day => (
                            <motion.div
                                key={day}
                                whileHover={{ scale: 1.05 }}
                                className={`
                  aspect-square rounded-2xl p-4 border transition-all cursor-pointer relative group
                  ${day === 3 ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/40 translate-y-[-4px]' : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-lg'}
                `}
                            >
                                <div className={`text-sm font-black ${day === 3 ? 'text-white' : 'text-gray-900'}`}>{day}</div>
                                {day === 3 && <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/20 rounded-full" />}
                                {day % 7 === 0 && day !== 3 && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-red-400 rounded-full" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Tasks */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <Target className="h-6 w-6 text-blue-400" />
                            Today's Agenda
                        </h3>
                        <div className="space-y-6">
                            {events.map((event, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full bg-${event.color}-500 ring-4 ring-${event.color}-500/20 shadow-lg shadow-${event.color}-500/40`} />
                                        {idx !== events.length - 1 && <div className="w-[2px] flex-1 bg-gray-800 my-2" />}
                                    </div>
                                    <div className="pb-6">
                                        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">{event.time}</div>
                                        <div className="text-sm font-bold mb-0.5 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{event.title}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">Assigned: {event.staff}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 mt-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            View Detailed Timeline
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-12 -mt-12" />
                        <div className="relative z-10">
                            <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl mb-6">
                                <Zap className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Shift Overlap Alert</h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                You have a potential 15-minute gap between Morning and Evening shifts on Saturday.
                            </p>
                            <button className="text-sm font-black text-blue-600 hover:underline">Resolve Constraint</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
