"use client"

import { useState, useEffect } from "react"
import {
    Mail, Phone, MapPin, Send, ArrowRight, ArrowLeft,
    MessageSquare, Building, Users, CheckCircle2,
    Globe, Clock, Headphones, Calendar, Sparkles,
    Shield, Zap, BarChart3, ChevronLeft, ChevronRight,
    Star, TrendingUp
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const MotionDiv = motion.div as any

// Generate calendar days for current month
function getMonthData(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    return { firstDay, daysInMonth, monthName }
}

const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
]

// Simulate some booked slots
const bookedDays = [3, 7, 14, 21, 28]
const partialDays = [5, 12, 19, 26]

const salesStats = [
    { value: "500+", label: "Businesses Onboarded", icon: Building },
    { value: "98%", label: "Client Retention Rate", icon: TrendingUp },
    { value: "< 2hrs", label: "Avg. Response Time", icon: Clock },
    { value: "4.9★", label: "Customer Satisfaction", icon: Star },
]

const testimonials = [
    {
        quote: "HybridPOS transformed our 12-store chain. Sales up 34% in the first quarter.",
        author: "Ahmed Khan",
        role: "CEO, Khan Retail Group",
        metric: "+34% Revenue"
    },
    {
        quote: "The best POS investment we've ever made. Setup was seamless and the support is incredible.",
        author: "Sarah Malik",
        role: "Operations Head, FreshMart",
        metric: "12 Stores"
    },
    {
        quote: "Real-time inventory sync across all branches. Zero stockouts since deployment.",
        author: "Usman Raza",
        role: "Founder, MedPlus Pharmacy",
        metric: "Zero Stockouts"
    },
]

export default function ContactSalesPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [selectedDate, setSelectedDate] = useState<number | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [cmsContent, setCmsContent] = useState<any>(null)

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "",
        businessName: "", businessType: "RETAIL",
        storeCount: "1", message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { firstDay, daysInMonth, monthName } = getMonthData(currentYear, currentMonth)

    useEffect(() => {
        fetch('/api/super-admin/cms')
            .then(res => res.json())
            .then(data => setCmsContent(data))
            .catch(() => { })
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitted(true)
            toast.success("Demo booked successfully! Check your email for confirmation.")
        }, 1500)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const goNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
    }
    const goPrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
    }

    const today = new Date()
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear()

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 transition-colors duration-500">
            <SiteHeader />

            {/* Hero */}
            <section className="relative pt-48 pb-16 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full" />
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        >
                            <Sparkles className="h-3.5 w-3.5 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sales & Partnerships</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
                        >
                            Scale Your{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                                Business.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Book a personalized demo with our retail experts. See how HybridPOS can transform your operations in 30 minutes.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Sales Stats Bar */}
            <section className="pb-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {salesStats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.05 }}
                                className="text-center p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
                            >
                                <stat.icon className="h-5 w-5 mx-auto mb-3 text-indigo-500" />
                                <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Booking Section */}
            <section className="pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-start">

                        {/* Left: Calendar + Form (multi-step) */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-[0_48px_120px_rgba(0,0,0,0.06)] dark:shadow-[0_48px_120px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-sm"
                            >
                                {/* Corner accent */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-100/50 dark:from-indigo-900/20 to-transparent rounded-bl-[6rem]" />

                                {/* Step indicators */}
                                <div className="relative z-10 flex items-center gap-3 mb-10">
                                    {[
                                        { num: 1, label: "Pick a Date" },
                                        { num: 2, label: "Choose Time" },
                                        { num: 3, label: "Your Details" },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s.num
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                    : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                                                }`}>
                                                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${step >= s.num ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
                                                }`}>{s.label}</span>
                                            {i < 2 && <div className={`w-8 h-px ${step > s.num ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'}`} />}
                                        </div>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-16 relative z-10 space-y-6"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <h3 className="text-4xl font-black tracking-tighter">Demo Booked!</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                                                Your demo is scheduled for <span className="font-black text-slate-900 dark:text-white">{monthName.split(' ')[0]} {selectedDate}</span> at <span className="font-black text-slate-900 dark:text-white">{selectedTime}</span>. We&apos;ll send confirmation to <span className="font-black text-indigo-600">{formData.email}</span>.
                                            </p>
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                                <Link href="/" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center gap-2">
                                                    Back to Home <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => { setSubmitted(false); setStep(1); setSelectedDate(null); setSelectedTime(null) }}
                                                    className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] hover:underline"
                                                >
                                                    Book Another
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : step === 1 ? (
                                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Step 1</span>
                                                    </div>
                                                    <h2 className="text-2xl font-black tracking-tighter">Select a Date</h2>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={goPrevMonth} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                                                    <span className="text-sm font-black w-36 text-center">{monthName}</span>
                                                    <button onClick={goNextMonth} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                                                </div>
                                            </div>

                                            {/* Day labels */}
                                            <div className="grid grid-cols-7 gap-2 mb-3">
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                                    <div key={d} className="text-center text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-wider py-2">{d}</div>
                                                ))}
                                            </div>

                                            {/* Calendar grid */}
                                            <div className="grid grid-cols-7 gap-2 mb-8">
                                                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                                    const isPast = isCurrentMonth && day < today.getDate()
                                                    const isBooked = bookedDays.includes(day)
                                                    const isPartial = partialDays.includes(day)
                                                    const isSelected = selectedDate === day
                                                    const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0

                                                    const disabled = isPast || isBooked || isWeekend
                                                    let classes = 'aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer '

                                                    if (isSelected) classes += 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110'
                                                    else if (disabled) classes += 'bg-slate-50 dark:bg-white/5 text-slate-200 dark:text-slate-700 cursor-not-allowed'
                                                    else if (isPartial) classes += 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20'
                                                    else classes += 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'

                                                    return (
                                                        <button
                                                            key={day}
                                                            disabled={disabled}
                                                            onClick={() => setSelectedDate(day)}
                                                            className={classes}
                                                        >
                                                            {day}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            {/* Legend */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    {[
                                                        { color: 'bg-emerald-400', label: 'Available' },
                                                        { color: 'bg-amber-400', label: 'Limited' },
                                                        { color: 'bg-slate-200 dark:bg-slate-700', label: 'Unavailable' },
                                                    ].map(l => (
                                                        <div key={l.label} className="flex items-center gap-1.5">
                                                            <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{l.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    disabled={!selectedDate}
                                                    onClick={() => setStep(2)}
                                                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-40 transition-all hover:shadow-2xl flex items-center gap-2"
                                                >
                                                    Next <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : step === 2 ? (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative z-10">
                                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6 hover:underline">
                                                <ChevronLeft className="h-3 w-3" /> Change Date ({monthName.split(' ')[0]} {selectedDate})
                                            </button>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Step 2</span>
                                            </div>
                                            <h2 className="text-2xl font-black tracking-tighter mb-8">Choose a Time Slot</h2>

                                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-10">
                                                {timeSlots.map(slot => {
                                                    const isSelected = selectedTime === slot
                                                    return (
                                                        <button
                                                            key={slot}
                                                            onClick={() => setSelectedTime(slot)}
                                                            className={`py-4 rounded-2xl text-sm font-bold transition-all ${isSelected
                                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                                    : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-white/5'
                                                                }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">All times in PKT (UTC+5)</p>
                                                <button
                                                    disabled={!selectedTime}
                                                    onClick={() => setStep(3)}
                                                    className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-40 transition-all hover:shadow-2xl flex items-center gap-2"
                                                >
                                                    Next <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                                            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6 hover:underline">
                                                <ChevronLeft className="h-3 w-3" /> {monthName.split(' ')[0]} {selectedDate} at {selectedTime}
                                            </button>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="h-4 w-4 text-indigo-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Step 3</span>
                                            </div>
                                            <h2 className="text-2xl font-black tracking-tighter mb-8">Your Business Details</h2>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Full Name</label>
                                                        <input required name="name" value={formData.name} onChange={handleChange} placeholder="Your full name"
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Phone</label>
                                                        <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 3XX XXX XXXX"
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none" />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Work Email</label>
                                                        <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@company.com"
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Business Name</label>
                                                        <input required name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Your company"
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none" />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Industry</label>
                                                        <select name="businessType" value={formData.businessType} onChange={handleChange}
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none appearance-none">
                                                            <option value="RETAIL">Retail Store</option>
                                                            <option value="RESTAURANT">Restaurant / Cafe</option>
                                                            <option value="PHARMACY">Pharmacy</option>
                                                            <option value="SUPERMARKET">Supermarket / Grocery</option>
                                                            <option value="FASHION">Fashion & Apparel</option>
                                                            <option value="ELECTRONICS">Electronics</option>
                                                            <option value="OTHER">Other</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Number of Stores</label>
                                                        <select name="storeCount" value={formData.storeCount} onChange={handleChange}
                                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none appearance-none">
                                                            <option value="1">Single Store</option>
                                                            <option value="2-5">2–5 Stores</option>
                                                            <option value="6-10">6–10 Stores</option>
                                                            <option value="10+">10+ Stores (Enterprise)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                                        Anything else? <span className="text-slate-300 dark:text-slate-600">(Optional)</span>
                                                    </label>
                                                    <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us about your needs..."
                                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none resize-none" />
                                                </div>

                                                <button
                                                    type="submit" disabled={isSubmitting}
                                                    className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/20 hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                                                >
                                                    {isSubmitting ? (
                                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <Calendar className="h-4 w-4" />
                                                            Confirm Demo Booking
                                                        </>
                                                    )}
                                                </button>

                                                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 px-4">
                                                    By scheduling, you agree to our <Link href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-indigo-500 hover:underline">Terms</Link>.
                                                </p>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Contact */}
                            <div className="space-y-4">
                                {[
                                    { icon: Phone, title: "Sales Hotline", value: "+92 300 1234567", sub: "Mon–Sat, 9AM–8PM PKT", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
                                    { icon: Mail, title: "Email Sales", value: "sales@hybridpos.pk", sub: "Response within 2 hours", color: "from-violet-500 to-purple-600", bg: "bg-violet-50 dark:bg-violet-900/10" },
                                    { icon: MapPin, title: "Head Office", value: "Arfa Tech Park, Lahore", sub: "Walk-ins welcome", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
                                ].map((c, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                                        className={`p-6 rounded-[2rem] ${c.bg} border border-slate-100 dark:border-white/5 group hover:shadow-lg transition-all`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                <c.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{c.title}</p>
                                                <p className="text-sm font-black tracking-tight">{c.value}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{c.sub}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Rotating Testimonial */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 border border-slate-800 dark:border-white/10 text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentTestimonial}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <p className="text-sm font-medium text-slate-300 leading-relaxed mb-5 italic">
                                                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-black">{testimonials[currentTestimonial].author}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">{testimonials[currentTestimonial].role}</p>
                                                </div>
                                                <div className="px-3 py-1.5 bg-emerald-500/20 rounded-full">
                                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">{testimonials[currentTestimonial].metric}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                    <div className="flex gap-1.5 mt-5">
                                        {testimonials.map((_, i) => (
                                            <button key={i} onClick={() => setCurrentTestimonial(i)}
                                                className={`h-1 rounded-full transition-all ${currentTestimonial === i ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: Shield, label: "SOC 2", sub: "Certified" },
                                    { icon: Zap, label: "99.99%", sub: "Uptime" },
                                    { icon: Headphones, label: "24/7", sub: "Support" },
                                ].map((b, i) => (
                                    <div key={i} className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <b.icon className="h-4 w-4 mx-auto mb-2 text-indigo-500" />
                                        <div className="text-sm font-black">{b.label}</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{b.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter cms={cmsContent?.footer} />
        </div>
    )
}
