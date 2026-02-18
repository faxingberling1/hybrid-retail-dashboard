"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Phone, Mail, MapPin, Clock, MessageSquare,
    ArrowRight, Headphones, Globe, Shield,
    CheckCircle, Send, Sparkles
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const contactMethods = [
    {
        icon: Phone,
        title: "Sales Hotline",
        value: "+92 321 000 0000",
        subtitle: "Mon–Sat, 9AM–8PM PKT",
        color: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50",
        bgDark: "dark:bg-blue-900/10",
        borderLight: "border-blue-100",
        borderDark: "dark:border-blue-800/30",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        value: "+92 300 111 2222",
        subtitle: "Always available for you",
        color: "from-emerald-500 to-teal-600",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-900/10",
        borderLight: "border-emerald-100",
        borderDark: "dark:border-emerald-800/30",
    },
    {
        icon: Mail,
        title: "Email Us",
        value: "hello@hybridpos.pk",
        subtitle: "We reply within 2 hours",
        color: "from-violet-500 to-purple-600",
        bgLight: "bg-violet-50",
        bgDark: "dark:bg-violet-900/10",
        borderLight: "border-violet-100",
        borderDark: "dark:border-violet-800/30",
    },
    {
        icon: Globe,
        title: "WhatsApp",
        value: "+92 321 000 0000",
        subtitle: "Chat with us instantly",
        color: "from-green-500 to-emerald-600",
        bgLight: "bg-green-50",
        bgDark: "dark:bg-green-900/10",
        borderLight: "border-green-100",
        borderDark: "dark:border-green-800/30",
    },
];

const offices = [
    {
        city: "Lahore",
        address: "Floor 12, Arfa Software Technology Park, Ferozepur Road",
        phone: "+92 42 111 0000",
        flag: "🇵🇰",
        timezone: "PKT (UTC+5)",
        isHQ: true,
    },
    {
        city: "Karachi",
        address: "Suite 801, Dolmen City Mall, Marine Drive, Clifton",
        phone: "+92 21 111 0000",
        flag: "🇵🇰",
        timezone: "PKT (UTC+5)",
        isHQ: false,
    },
    {
        city: "Islamabad",
        address: "Office 5B, Software Technology Park, Sector I-9/3",
        phone: "+92 51 111 0000",
        flag: "🇵🇰",
        timezone: "PKT (UTC+5)",
        isHQ: false,
    },
];

export default function CallUsPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        preferredTime: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [cmsContent, setCmsContent] = useState<any>(null);

    useEffect(() => {
        fetch('/api/super-admin/cms')
            .then(res => res.json())
            .then(data => setCmsContent(data))
            .catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        await new Promise((r) => setTimeout(r, 1500));
        setIsSubmitted(true);
        setIsSubmitting(false);
        toast.success("Callback request submitted! We'll call you shortly.");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 transition-colors duration-500">
            <SiteHeader />

            {/* Hero */}
            <section className="relative pt-48 pb-20 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[30%] -right-[15%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
                    <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-violet-500/5 dark:bg-violet-500/10 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm"
                        >
                            <Phone className="h-3.5 w-3.5 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Direct Line</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]"
                        >
                            Let&apos;s{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                                Talk.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Our team of retail technology experts is ready to help you transform your business. Reach out anytime.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Contact Methods Grid */}
            <section className="pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {contactMethods.map((method, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className={`group relative p-8 rounded-[2.5rem] ${method.bgLight} ${method.bgDark} border ${method.borderLight} ${method.borderDark} hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    <method.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                                        {method.title}
                                    </p>
                                    <p className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                        {method.value}
                                    </p>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        {method.subtitle}
                                    </p>
                                </div>
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Callback Form + Offices */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-16 max-w-6xl mx-auto">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            <div className="bg-white dark:bg-white/5 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-[0_48px_120px_rgba(0,0,0,0.06)] dark:shadow-[0_48px_120px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-sm">
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100/50 dark:from-blue-900/20 to-transparent rounded-bl-[6rem]" />

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 relative z-10 space-y-6"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto">
                                            <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <h3 className="text-4xl font-black tracking-tighter">
                                            We&apos;ll Call You!
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                                            Your callback request has been received. Our team will reach out at your preferred time.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false);
                                                setFormData({ name: "", phone: "", email: "", subject: "", message: "", preferredTime: "" });
                                            }}
                                            className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] hover:underline"
                                        >
                                            Submit Another Request
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MessageSquare className="h-5 w-5 text-blue-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                                                Request Callback
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                                            We&apos;ll Call You Back
                                        </h2>
                                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mb-10">
                                            Fill in your details and we&apos;ll reach out at the best time for you.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        required
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="Your full name"
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        required
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+92 3XX XXX XXXX"
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                        Email
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="you@company.com"
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                        Preferred Time
                                                    </label>
                                                    <select
                                                        name="preferredTime"
                                                        value={formData.preferredTime}
                                                        onChange={handleChange}
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none appearance-none"
                                                    >
                                                        <option value="">Select time slot...</option>
                                                        <option value="morning">Morning (9AM–12PM)</option>
                                                        <option value="afternoon">Afternoon (12PM–4PM)</option>
                                                        <option value="evening">Evening (4PM–8PM)</option>
                                                        <option value="asap">ASAP</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                    Subject
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none appearance-none"
                                                >
                                                    <option value="">What can we help with?</option>
                                                    <option value="sales">Sales & Pricing</option>
                                                    <option value="support">Technical Support</option>
                                                    <option value="enterprise">Enterprise Solutions</option>
                                                    <option value="partnership">Partnership Inquiry</option>
                                                    <option value="billing">Billing & Accounts</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                                                    Message <span className="text-slate-300 dark:text-slate-600">(Optional)</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    rows={4}
                                                    placeholder="Tell us more about what you need..."
                                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-black/40 border-none rounded-2xl text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all outline-none resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                                            >
                                                {isSubmitting ? (
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                ) : (
                                                    <>
                                                        <Send className="h-4 w-4" />
                                                        Request Callback
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Office Locations */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="h-5 w-5 text-violet-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500">
                                        Our Offices
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter mb-8">
                                    Visit Us
                                </h2>
                            </div>

                            <div className="space-y-5">
                                {offices.map((office, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="group p-7 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-500"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{office.flag}</span>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                                        {office.city}
                                                        {office.isHQ && (
                                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                                                                HQ
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                        {office.timezone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                                            {office.address}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                            <Phone className="h-3.5 w-3.5 text-blue-500" />
                                            {office.phone}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trust Badge */}
                            <div className="p-7 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 border border-slate-800 dark:border-white/10 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="h-5 w-5 text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                                        Trusted Partner
                                    </span>
                                </div>
                                <h4 className="text-xl font-black tracking-tight mb-2">
                                    Enterprise-Grade Support
                                </h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-5">
                                    99.99% uptime SLA, dedicated account managers, and priority response within 15 minutes.
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { value: "< 15min", label: "Response" },
                                        { value: "99.99%", label: "Uptime" },
                                        { value: "24/7", label: "Support" },
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <div className="text-lg font-black text-white">{stat.value}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative p-16 rounded-[3rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 overflow-hidden text-center">
                            {/* Noise overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                            {/* Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-white/10 blur-[80px] rounded-full" />

                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                                    <Sparkles className="h-3.5 w-3.5 text-white" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                        Prefer Self-Service?
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                                    Try HybridPOS Free <br />
                                    <span className="text-white/60">for 14 Days</span>
                                </h2>
                                <p className="text-lg text-white/70 font-medium max-w-xl mx-auto">
                                    No credit card required. Full access to all features. Cancel anytime.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    <Link
                                        href="/demo"
                                        className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        Start Free Trial
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/20 transition-all backdrop-blur-sm"
                                    >
                                        View Pricing
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter cms={cmsContent?.footer} />
        </div>
    );
}
