"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
    Shield, ShoppingCart,
    Users, ArrowRight, Sparkles,
    Zap, Globe, Lock,
    Activity, Database,
    Package, PieChart, Layers, Cpu, ShieldCheck, TrendingUp, Building
} from "lucide-react"
import { useTheme } from "../providers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PreviewPage() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [cmsContent, setCmsContent] = useState<any>(null)

    useEffect(() => {
        setIsMounted(true)

        // Initial fetch to avoid placeholder content
        fetch('/api/super-admin/cms')
            .then(res => res.json())
            .then(data => setCmsContent(data))
            .catch(err => console.error("CMS Preview Load Error:", err))

        // Listen for messages from the parent window (CMS Editor)
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'CMS_UPDATE') {
                setCmsContent(event.data.content)
            }
        }

        window.addEventListener('message', handleMessage)

        // Check if we have initial content in the window (for better cold start)
        if ((window as any).initialCMSContent) {
            setCmsContent((window as any).initialCMSContent)
        }

        return () => window.removeEventListener('message', handleMessage)
    }, [])

    const MotionDiv = motion.div as any
    const MotionButton = motion.button as any
    const isDark = resolvedTheme === 'dark'

    if (!isMounted) return null

    // Fallback data if no content received yet
    const content = cmsContent || {
        hero: {
            badge: "Live Preview Mode",
            title: "Your Design\nAppears Here.",
            subtitle: "Start editing in the Master Page Editor to see your changes reflected in high-fidelity real-time.",
            ctaPrimary: "Action One",
            ctaSecondary: "Action Two"
        },
        features: [],
        enterprise: {
            badge: "Enterprise",
            title: "Enterprise Ready.",
            subtitle: "Scalable infrastructure.",
            cta: "Get Started",
            features: []
        },
        header: {
            logoText: "HybridPOS",
            logoSubtext: "Enterprise Unified",
            links: [],
            ctaText: "Login",
            ctaHref: "/login"
        },
        footer: {
            tagline: "The ultimate retail ecosystem.",
            columns: [],
            copyright: "Hybrid Retail Systems Ltd.",
            socials: {}
        },
        map: {
            badge: "Operational Hub",
            title: "Karachi Command Center.",
            lat: 25.193,
            lng: 66.594,
            zoom: 12,
            style: "Dark"
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
        <div className={`min-h-screen font-sans selection:bg-sky-500/10 overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#020412] text-white' : 'bg-white text-slate-900'}`}>
            {/* Backgrounds */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div key="dark-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }}
                                transition={{ duration: 25, repeat: Infinity }}
                                className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/10 blur-[130px] rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }}
                                transition={{ duration: 30, repeat: Infinity }}
                                className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full"
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="light-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
                                transition={{ duration: 20, repeat: Infinity }}
                                className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-100/50 blur-[120px] rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }}
                                transition={{ duration: 25, repeat: Infinity }}
                                className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <SiteHeader cms={content.header} />

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
                                {content.hero.title.split('\n')[1] || ""}
                            </span>
                        </motion.h1>

                        <p className={`text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {content.hero.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center shadow-2xl transition-all duration-300 ${content.branding?.vibrancy === 'Ultra'
                                    ? 'bg-blue-600 text-white shadow-blue-500/40 hover:bg-blue-500'
                                    : isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                    }`}
                            >
                                {content.hero.ctaPrimary}
                                <ArrowRight className="ml-3 h-5 w-5" />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`px-10 py-6 border-2 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center shadow-xl transition-all duration-300 ${isDark ? 'bg-transparent border-white/20 text-white' : 'bg-white text-slate-900 border-slate-100'}`}
                            >
                                {content.hero.ctaSecondary}
                            </motion.div>
                        </div>
                    </div>

                    {/* Floating UI Elements */}
                    <div className="mt-40 grid lg:grid-cols-3 gap-8 relative max-w-7xl mx-auto text-left">
                        <MotionDiv
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-[3rem] border-2 relative overflow-hidden group backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30' : 'bg-white/60 border-sky-200'}`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Activity className={`h-20 w-20 ${isDark ? 'text-violet-500' : 'text-sky-500'}`} />
                            </div>
                            <div className={`p-4 rounded-2xl w-fit mb-6 ${isDark ? 'bg-violet-500/10 text-violet-400' : 'bg-sky-50 text-sky-500'}`}>
                                <Activity className="h-6 w-6" />
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Pulse</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time telemetry of your entire retail network.</p>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`p-12 lg:-mt-20 rounded-[4rem] text-center border-2 relative overflow-hidden group shadow-[0_48px_120px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30' : 'bg-white/60 border-sky-200'}`}
                        >
                            <div className="relative mb-8 inline-block">
                                <div className={`relative p-8 text-white rounded-[2.5rem] shadow-2xl bg-gradient-to-br ${isDark ? 'from-violet-600 to-indigo-600' : 'from-blue-500 to-indigo-600'}`}>
                                    <Database className="h-12 w-12" />
                                </div>
                            </div>
                            <h3 className={`text-4xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>99.99% Uptime</h3>
                            <p className={`font-medium text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Architected for mission-critical retail.</p>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-[3rem] border-2 relative overflow-hidden group backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-white/5 border-violet-500/30' : 'bg-white/60 border-sky-200'}`}
                        >
                            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${isDark ? 'text-pink-500' : 'text-indigo-500'}`}>
                                <Layers className="h-20 w-20" />
                            </div>
                            <div className={`p-4 rounded-2xl w-fit mb-6 ${isDark ? 'bg-pink-500/10 text-pink-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Layers className="h-6 w-6" />
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Infinite Scaling</h3>
                            <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expand effortlessly from one store to thousands.</p>
                        </MotionDiv>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`py-40 relative overflow-hidden ${isDark ? 'bg-[#020412]' : 'bg-slate-50'}`}>
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
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.features?.map((feature: any, idx: number) => (
                            <div
                                key={idx}
                                className={`p-10 rounded-[3rem] border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className={`p-4 bg-gradient-to-br ${feature.color} text-white rounded-2xl w-fit mb-8 shadow-lg`}>
                                    {iconMap[feature.icon] || <Sparkles className="h-6 w-6" />}
                                </div>
                                <h3 className={`text-2xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {feature.title}
                                </h3>
                                <p className={`font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Maps Section */}
            <section className={`py-40 relative overflow-hidden ${isDark ? 'bg-[#05081c]' : 'bg-white'}`}>
                <div className="container mx-auto px-6">
                    <div className="mb-20 space-y-6 max-w-2xl text-left">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border shadow-sm ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{content.map.badge}</span>
                        </div>
                        <h2 className={`text-6xl font-black tracking-tighter leading-[0.9] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {content.map.title.split('\n')[0]} <br />
                            <span className="text-emerald-500">{content.map.title.split('\n')[1] || ""}</span>
                        </h2>
                    </div>

                    <div className="rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl h-[400px] relative">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d924234.6302710465!2d${content.map.lng}!3d${content.map.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1707248512345!5m2!1sen!2s`}
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: content.map.style === 'Dark' ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* enterprise section */}
            <section className={`py-40 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-slate-900'}`}>
                <div className="container mx-auto px-6 relative z-10">
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

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {content.enterprise.features?.map((item: any, i: number) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 text-white">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 text-emerald-400">
                                    {iconMap[item.icon] || <Zap className="h-7 w-7" />}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-4">{item.title}</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <div className="px-16 py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] inline-flex items-center bg-emerald-500 text-white shadow-2xl shadow-emerald-900/40">
                            {content.enterprise.cta}
                            <ArrowRight className="ml-4 h-6 w-6" />
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter cms={content.footer} />

            {/* Preview Overlay Indicator */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-[100] border-4 border-white/20 backdrop-blur-xl flex items-center gap-3">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                Live Preview Active
            </div>
        </div>
    )
}
