"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";

const reservedDates = [12, 14, 15, 20, 25]; // Mock reserved
const bookedDates = [2, 5, 28]; // Mock booked

import { SiteFooter } from "@/components/site-footer";

export default function DemoPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessName: '',
        businessType: '',
        industry: '',
        monthlyRevenue: ''
    });

    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const handleDateSelect = (day: number) => {
        if (!reservedDates.includes(day) && !bookedDates.includes(day)) {
            setSelectedDate(day);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/schedule-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    date: `February ${selectedDate}, 2026`
                })
            });

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                toast.error("Failed to schedule demo. Please try again.");
            }
        } catch (error) {
            toast.error("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur-sm"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personalized Tour</span>
                            </motion.div>

                            <h1 className="text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                                Book Your <br />
                                <span className="text-blue-500">Live Demo.</span>
                            </h1>

                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                                Select an available slot on the calendar and our experts will guide you through the HybridPOS matrix.
                            </p>

                            <div className="flex items-center space-x-6 pt-10 border-t border-slate-100 dark:border-white/10">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Available</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Reserved</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Booked</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-[0_48px_120px_rgba(0,0,0,0.08)] dark:shadow-[0_48px_120px_rgba(0,0,0,0.3)] relative overflow-hidden h-fit backdrop-blur-sm"
                        >
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 space-y-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Demo Scheduled!</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">We've reserved {selectedDate && `February ${selectedDate}, 2026`} for your personalized tour. Check email for details.</p>
                                    </motion.div>
                                ) : step === 1 ? (
                                    <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                                        <div className="flex items-center justify-between mb-10">
                                            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">February 2026</h4>
                                            <div className="flex space-x-2">
                                                <button className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-900 dark:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                                                <button className="p-2 hover:bg-slate-50 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-900 dark:text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-3 mb-12">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                                <div key={i} className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase py-2">{day}</div>
                                            ))}
                                            {daysInMonth.map(day => {
                                                const isReserved = reservedDates.includes(day);
                                                const isBooked = bookedDates.includes(day);
                                                const isSelected = selectedDate === day;

                                                let bgClass = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'; // Green by default (Available)

                                                if (isReserved) bgClass = 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 cursor-not-allowed'; // Yellow (Reserved)
                                                if (isBooked) bgClass = 'bg-rose-50 dark:bg-rose-900/20 text-rose-400 dark:text-rose-400 cursor-not-allowed'; // Red (Booked)
                                                if (isSelected) bgClass = 'bg-blue-600 text-white shadow-lg shadow-blue-500/30';

                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => handleDateSelect(day)}
                                                        disabled={isReserved || isBooked}
                                                        className={`
                                                            aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all
                                                            ${bgClass}
                                                        `}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            disabled={!selectedDate}
                                            onClick={() => setStep(2)}
                                            className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl disabled:opacity-50 transition-all"
                                        >
                                            Next: Business Intelligence
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <button onClick={() => setStep(1)} className="mb-8 text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                                            Change Date (Feb {selectedDate})
                                        </button>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Full Name</label>
                                                    <input required name="name" onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Email</label>
                                                    <input required name="email" onChange={handleInputChange} type="email" placeholder="john@company.com" className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Business Name</label>
                                                <input required name="businessName" onChange={handleInputChange} type="text" placeholder="Acme Retail Ltd." className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Industry</label>
                                                    <select required name="industry" onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all appearance-none">
                                                        <option value="">Select...</option>
                                                        <option value="fashion">Fashion & Apparel</option>
                                                        <option value="grocery">Grocery & Mart</option>
                                                        <option value="electronics">Electronics</option>
                                                        <option value="pharmacy">Pharmacy</option>
                                                        <option value="restaurant">Restaurant/Cafe</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Business Type</label>
                                                    <select required name="businessType" onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all appearance-none">
                                                        <option value="">Select...</option>
                                                        <option value="single">Single Store</option>
                                                        <option value="chain">Retail Chain (2-10)</option>
                                                        <option value="enterprise">Enterprise (10+)</option>
                                                        <option value="franchise">Franchise</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Est. Monthly Revenue</label>
                                                <select required name="monthlyRevenue" onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all appearance-none">
                                                    <option value="">Select Range...</option>
                                                    <option value="PRE_REVENUE">Pre-revenue</option>
                                                    <option value="UNDER_50K">Under $50k</option>
                                                    <option value="50K_150K">$50k - $150k</option>
                                                    <option value="150K_500K">$150k - $500k</option>
                                                    <option value="500K_PLUS">$500k+</option>
                                                </select>
                                            </div>

                                            <button type="submit" disabled={isLoading} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all disabled:opacity-70 flex items-center justify-center">
                                                {isLoading ? (
                                                    <svg className="animate-spin h-5 w-5 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : 'Confirm Demo Booking'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </main>
            <SiteFooter />

            <style jsx global>{`
                .glass {
                  background: rgba(255, 255, 255, 0.7);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
