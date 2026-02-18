"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
    Shield, ShoppingCart, CheckCircle,
    Building, User, Users, ArrowRight, Sparkles,
    Zap, Globe, Lock, CreditCard,
    TrendingUp, BarChart, Smartphone,
    Layers, Cpu, Activity, Database,
    Package, PieChart, Clock, Menu, X,
    Github, Twitter, Linkedin, Sun, Moon, Store,
    ShieldCheck
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "./providers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LandingPage() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [cmsContent, setCmsContent] = useState<any>(null)
    const [showAnnouncement, setShowAnnouncement] = useState(true)

    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

    useEffect(() => {
        setIsMounted(true)
        fetch('/api/super-admin/cms')
            .then(res => res.json())
            .then(data => setCmsContent(data))
            .catch(err => console.error("CMS Load Error:", err))
    }, [])

    const MotionDiv = motion.div as any
    const MotionButton = motion.button as any
    const isDark = resolvedTheme === 'dark'

    if (!isMounted) return null

    // Fallback data if CMS fails to load
    const content = cmsContent || {
        hero: {
            badge: "Pakistan's No.1 Retail Management System",
            title: "Retail Perfected.",
            subtitle: "The high-fidelity ecosystem for professional commerce. Real-time synchronization, neural inventory, and zero-latency performance.",
            ctaPrimary: "Get Started Free",
            ctaSecondary: "Schedule a Demo"
        },
        branding: {
            vibrancy: 'Elite',
            typography: 'Modern'
        },
        features: [
            { icon: "ShoppingCart", title: "Dynamic POS Engine", desc: "Zero-latency transaction processing with offline resilience and multi-terminal sync.", color: "from-sky-500 to-blue-600" },
            { icon: "Package", title: "Intelligent Inventory", desc: "Neural-driven stock monitoring with automated reordering and predictive analytics.", color: "from-emerald-500 to-teal-600" },
            { icon: "PieChart", title: "Growth Intelligence", desc: "Real-time visual reports and AI-powered business insights for rapid scaling.", color: "from-violet-500 to-purple-600" },
            { icon: "Users", title: "Staff Optimization", desc: "Advanced shift management, performance tracking, and granular access control.", color: "from-rose-500 to-pink-600" },
            { icon: "Globe", title: "Regional Mesh", desc: "Distributed database architecture ensuring speed and data integrity anywhere.", color: "from-amber-500 to-orange-600" },
            { icon: "Shield", title: "Hardened Security", desc: "Bank-grade encryption with multi-factor authentication and audit logging.", color: "from-indigo-500 to-cyan-600" }
        ],
        enterprise: {
            badge: "Mission Critical",
            title: "Command Your Enterprise.",
            subtitle: "The scale-out infrastructure for retail giants. Dedicated zones, custom sharding, and 24/7 priority support.",
            cta: "Deploy Enterprise",
            features: [
                { title: "Global Sharding", desc: "Private mesh nodes isolated from public traffic.", icon: "Globe" },
                { title: "Granular Access", desc: "Role-based permission scaling with biometrics.", icon: "Users" },
                { title: "Forensic Logs", desc: "Immutable activity tracking with 7-year retention.", icon: "Lock" }
            ]
        }
    }

    const iconMap: any = {
        ShoppingCart: <ShoppingCart className="h-6 w-6" />,
        Package: <Package className="h-6 w-6" />,
        PieChart: <PieChart className="h-6 w-6" />,
        Users: <Users className="h-6 w-6" />,
        Globe: <Globe className="h-6 w-6" />,
        Shield: <Shield className="h-6 w-6" />,
        Zap: <Zap className="h-6 w-6" />,
        Lock: <Lock className="h-6 w-6" />,
    }


    return (
        <div className={`min-h-screen font-sans selection:bg-sky-500/10 overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#020412] text-white selection:bg-violet-500/20' : 'bg-white text-slate-900'}`}>

            {/* Backgrounds */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div key="dark-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/10 blur-[130px] rounded-full" />
                            <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full" />
                        </motion.div>
                    ) : (
                        <motion.div key="light-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-100/50 blur-[120px] rounded-full" />
                            <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>


            {/* Announcement Bar */}
            <AnimatePresence>
                {showAnnouncement && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="relative z-50 overflow-hidden"
                    >
                        <div className={`relative py-3 px-6 text-center ${isDark
                            ? 'bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-blue-600/90'
                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600'
                            }`}>
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                />
                            </div>

                            <div className="container mx-auto flex items-center justify-center gap-4 relative">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                </span>
                                <p className="text-[11px] md:text-xs font-bold text-white tracking-wide">
                                    🚀 <span className="font-black">HybridPOS 3.0 is here</span> — Neural inventory, real-time sync, and blazing-fast checkout.
                                    <Link href="/features" className="ml-2 inline-flex items-center gap-1 font-black underline underline-offset-2 decoration-white/40 hover:decoration-white transition-all">
                                        Explore what&apos;s new <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </p>
                                <button
                                    onClick={() => setShowAnnouncement(false)}
                                    className="absolute right-0 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Header */}
            <SiteHeader cms={content.header} />

            {/* Hero Section */}

            {/* Hero Section */}
            <section className="relative pt-64 pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="space-y-12 max-w-5xl mx-auto">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-flex items-center px-4 py-1.5 rounded-full border shadow-sm transition-all duration-500 ${content.branding?.vibrancy === 'Ultra'
                                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                : isDark ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : 'bg-sky-50 border-sky-100 text-sky-600'
                                }`}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{content.hero.badge}</span>
                        </MotionDiv>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`tracking-tighter mb-8 leading-[0.85] transition-all duration-700 ${content.branding?.typography === 'Heavy' ? 'text-7xl md:text-9xl lg:text-[10rem] font-black' :
                                content.branding?.typography === 'Bold' ? 'text-6xl md:text-8xl lg:text-9xl font-extrabold' :
                                    'text-6xl md:text-8xl lg:text-9xl font-black'
                                } ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                            {content.hero.title.split('\n')[0]} <br />
                            <span className={`bg-clip-text text-transparent bg-gradient-to-r transition-all duration-1000 ${content.branding?.vibrancy === 'Ultra'
                                ? 'from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.5)]'
                                : isDark ? 'from-violet-400 via-fuchsia-400 to-white' : 'from-blue-600 via-indigo-600 to-sky-500'
                                }`}>
                                {content.hero.title.split('\n')[1] || "Perfected."}
                            </span>
                        </motion.h1>

                        <p className={`text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {content.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                            <Link href="/auth/signup">
                                <MotionButton
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center group shadow-2xl transition-all duration-300 ${content.branding?.vibrancy === 'Ultra'
                                        ? 'bg-blue-600 text-white shadow-blue-500/40 hover:bg-blue-500'
                                        : isDark ? 'bg-white text-slate-900 shadow-white/20' : 'bg-slate-900 text-white shadow-slate-900/20'
                                        }`}
                                >
                                    {content.hero.ctaPrimary}
                                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                                </MotionButton>
                            </Link>
                            <Link href="/contact">
                                <MotionButton
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-10 py-6 border-2 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center shadow-xl transition-all duration-300 ${isDark ? 'bg-transparent border-white/20 text-white hover:border-violet-400 shadow-violet-500/10' : 'bg-white text-slate-900 border-slate-100 shadow-slate-200/50 hover:border-sky-200'}`}
                                >
                                    {content.hero.ctaSecondary}
                                </MotionButton>
                            </Link>
                        </div>
                    </div>

                    {/* Floating UI Elements */}
                    <div className="mt-40 grid lg:grid-cols-3 gap-8 relative max-w-7xl mx-auto">
                        <MotionDiv
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-[3rem] text-left border-2 relative overflow-hidden group backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30 hover:border-violet-400/50' : 'bg-white/60 border-sky-200 hover:border-sky-300'}`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity className={`h-20 w-20 ${isDark ? 'text-violet-500' : 'text-sky-500'}`} />
                            </div>
                            <div className={`p-4 rounded-2xl w-fit mb-6 ${isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-sky-50 text-sky-500'}`}>
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Pulse</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time telemetry of your entire retail network.</p>
                            <div className="mt-8 relative h-12 w-full flex items-center">
                                {/* Simplified pulse for react - can enhance later */}
                                <div className="h-1.5 w-full bg-slate-100/10 rounded-full overflow-hidden relative">
                                    <div className={`absolute top-0 left-0 h-full w-1/3 rounded-full animate-progress-indeterminate ${isDark ? 'bg-violet-500' : 'bg-sky-500'}`}></div>
                                </div>
                            </div>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`p-12 lg:-mt-20 rounded-[4rem] text-center border-2 relative overflow-hidden group shadow-[0_48px_120px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30 hover:border-violet-400/50' : 'bg-white/60 border-sky-200 hover:border-sky-300'}`}
                        >
                            <div className="relative mb-10 inline-block">
                                <div className={`absolute inset-0 blur-3xl rounded-full scale-150 animate-pulse ${isDark ? 'bg-violet-500/20' : 'bg-blue-500/10'}`}></div>
                                <div className={`relative p-8 text-white rounded-[2.5rem] shadow-2xl bg-gradient-to-br ${isDark ? 'from-violet-600 to-indigo-600' : 'from-blue-500 to-indigo-600'}`}>
                                    <Database className="h-12 w-12" />
                                </div>
                            </div>
                            <h3 className={`text-4xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>99.99% Uptime</h3>
                            <p className={`font-medium text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Architected for mission-critical retail environments.</p>

                            <div className="mt-10 pt-10 border-t border-slate-100/10 flex items-center justify-between">
                                <div className="text-left">
                                    <div className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>1.2ms</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Delay</div>
                                </div>
                                <div className={`text-right ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                            </div>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-[3rem] text-left border-2 relative overflow-hidden group backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30 hover:border-violet-400/50' : 'bg-white/60 border-sky-200 hover:border-sky-300'}`}
                        >
                            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${isDark ? 'text-pink-500' : 'text-indigo-500'}`}>
                                <Layers className="h-20 w-20" />
                            </div>
                            <div className={`p-4 rounded-2xl w-fit mb-6 ${isDark ? 'bg-pink-500/10 text-pink-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Layers className="h-6 w-6" />
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Infinite Scaling</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expand your empire from one store to thousands effortlessly.</p>
                        </MotionDiv>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="features" className={`py-40 relative overflow-hidden ${isDark ? 'bg-[#020412]' : 'bg-slate-50'}`}>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className={`inline-flex items-center px-4 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-400'}`}
                        >
                            <Cpu className="h-4 w-4 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Engineered Core</span>
                        </MotionDiv>
                        <h2 className={`text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Built for <span className={`${isDark ? 'text-violet-500' : 'text-sky-500'}`}>Retail Masters</span>.
                        </h2>
                        <p className={`text-xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Every detail optimized for high-throughput commercial environments.
                            Powering the future of brick-and-mortar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.features.map((feature: any, idx: number) => (
                            <MotionDiv
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10 }}
                                className={`p-10 rounded-[3rem] border transition-all group ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-violet-500/5' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-500/5'}`}
                            >
                                <div className={`p-4 bg-gradient-to-br ${feature.color} text-white rounded-2xl w-fit mb-8 shadow-lg`}>
                                    {iconMap[feature.icon] || <Sparkles className="h-6 w-6" />}
                                </div>
                                <h3 className={`text-2xl font-black tracking-tight mb-4 group-hover:text-opacity-80 transition-colors ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-sky-500'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {feature.desc}
                                </p>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </section>

            {/* Maps Section */}
            <section className={`py-40 relative overflow-hidden ${isDark ? 'bg-[#05081c]' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <div className="mb-20 space-y-6 max-w-2xl">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{content.map?.badge || "Operational Hub"}</span>
                        </div>
                        <h2 className={`text-6xl font-black tracking-tighter leading-[0.9] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {(content.map?.title || "Karachi").split('\n')[0]} <br />
                            <span className="text-emerald-500">{(content.map?.title || "Command Center.").split('\n')[1] || ""}</span>
                        </h2>
                        <p className={`text-xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Orchestrating the unified mesh from the heart of the digital corridor.
                            Serving seamless transactions across the region.
                        </p>
                    </div>

                    <div className="rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl h-[500px] relative">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d924234.6302710465!2d${content.map?.lng || 66.594}!3d${content.map?.lat || 25.193}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1707248512345!5m2!1sen!2s`}
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: content.map?.style === 'Dark' ? 'invert(90%) hue-rotate(180deg)' : (isDark ? 'invert(90%) hue-rotate(180deg)' : 'none') }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-500 text-white rounded-xl">
                                    <Building className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Headquarters</h4>
                                    <p className="text-xs font-medium text-slate-500">Karachi, Sindh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className={`py-40 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-900'} transition-colors duration-500`}>
                <div className={`absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150`}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-20 space-y-8">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-emerald-400 mb-8 backdrop-blur-xl">
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{content.enterprise.badge}</span>
                            </div>
                            <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85]">
                                {content.enterprise.title.split('\n')[0]} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">{content.enterprise.title.split('\n')[1] || "Enterprise."}</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-slate-400">
                                {content.enterprise.subtitle}
                            </p>
                        </div>

                        {/* Enterprise Features */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20">
                            {content.enterprise.features.map((item: any, i: number) => (
                                <MotionDiv
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all group"
                                >
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                        {iconMap[item.icon] || <Zap className="h-7 w-7" />}
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-white mb-4">{item.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                </MotionDiv>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link href="/contact">
                                <MotionButton
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-16 py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/20 group inline-flex items-center bg-emerald-500 text-white hover:bg-emerald-400 transition-all"
                                >
                                    {content.enterprise.cta}
                                    <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-3 transition-transform" />
                                </MotionButton>
                            </Link>
                            <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Limited availability for dedicated clusters
                            </p>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            {/* Footer */}
            <SiteFooter cms={content.footer} />



        </div>
    )
}
