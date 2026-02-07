"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Send, CheckCircle2, Calendar, Clock, Lock } from "lucide-react";

export default function FeedbackPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [importanceLevel, setImportanceLevel] = useState("Medium");
    const [currentTime, setCurrentTime] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleString());
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (captchaInput.toUpperCase() !== captcha) {
            alert("Incorrect captcha. Please try again.");
            generateCaptcha();
            setCaptchaInput("");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/features", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, title, description, importanceLevel }),
            });

            if (res.ok) {
                setIsSubmitted(true);
                setTitle("");
                setDescription("");
                setEmail("");
                setImportanceLevel("Medium");
                setCaptchaInput("");
                generateCaptcha();
            }
        } catch (error) {
            console.error("Error submitting feature request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Thank You!</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Your request has been logged in our development priority matrix. We will be in touch shortly.</p>
                            <button onClick={() => setIsSubmitted(false)} className="text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest text-[10px]">Submit another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Timestamp Display */}
                            <div className="flex items-center gap-2 px-6 py-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">{currentTime}</span>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Feature Title</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Advanced Loyalty Module"
                                    className="w-full px-6 py-5 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Your Contact Email</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="engineer@company.com"
                                    className="w-full px-6 py-5 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="How should this work? Describe the objective..."
                                    className="w-full px-6 py-5 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Importance Level</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Low', 'Medium', 'Highest'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setImportanceLevel(level)}
                                            className={`py-4 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${importanceLevel === level
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Captcha Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">Security Verification</label>
                                <div className="flex items-center gap-4">
                                    <div className="px-6 py-4 bg-slate-100 dark:bg-white/10 rounded-xl font-mono text-xl font-bold tracking-[0.3em] text-slate-900 dark:text-white select-none italic border-2 border-dashed border-slate-300 dark:border-white/20">
                                        {captcha}
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-6 py-4 bg-slate-50 dark:bg-black/20 border-none rounded-xl text-slate-900 dark:text-white font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : "Submit"}
                                {!isSubmitting && <Send className="w-4 h-4" />}
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
