"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

import { SiteFooter } from "@/components/site-footer";

export default function FeedbackPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Community Driven</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                        Request a <br />
                        <span className="text-blue-500">Feature.</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Help us shape the future of retail. We review every suggestion to improve your operational matrix.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-white dark:bg-white/5 p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-white/5 backdrop-blur-sm"
                >
                    {isSubmitted ? (
                        <div className="text-center py-10 space-y-6">
                            <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Thank You!</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Your request has been logged in our development priority matrix.</p>
                            <button onClick={() => setIsSubmitted(false)} className="text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest text-[10px]">Submit another</button>
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Feature Title</label>
                                <input required type="text" placeholder="e.g. Advanced Loyalty Module" className="w-full px-6 py-5 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all" />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Description</label>
                                <textarea required rows={5} placeholder="How should this work?" className="w-full px-6 py-5 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all resize-none"></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Impact Level</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Low', 'Medium', 'Critical'].map(level => (
                                        <button key={level} type="button" className="py-4 rounded-xl border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all">
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all">
                                Log Request
                            </button>
                        </form>
                    )}
                </motion.div>
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
