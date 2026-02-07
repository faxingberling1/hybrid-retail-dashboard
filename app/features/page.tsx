"use client";

import { motion } from "framer-motion";
import {
    Store, Users, BarChart3, ShieldCheck, Zap, Globe,
    BrainCircuit, Mic, Wallet, ScanFace,
    Layers, Smartphone, Wifi, ShoppingBag, Heart
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const featureCategories = [
    {
        title: "Unified Operations",
        description: "Everything you need to run your store from a single pane of glass.",
        features: [
            {
                title: "Cloud POS",
                desc: "Process sales from anywhere. Works offline and syncs automatically when online.",
                icon: Store,
                color: "blue"
            },
            {
                title: "Smart Inventory",
                desc: "Real-time tracking across multiple locations with low-stock alerts.",
                icon: Layers,
                color: "emerald"
            },
            {
                title: "Staff Management",
                desc: "Granular permissions, shift scheduling, and performance tracking.",
                icon: Users,
                color: "violet"
            }
        ]
    },
    {
        title: "Customer Intelligence",
        description: "Turn data into actionable insights to grow your business.",
        features: [
            {
                title: "CRM & Loyalty",
                desc: "Build customer profiles and run targeted loyalty campaigns effortlessly.",
                icon: Heart,
                color: "rose"
            },
            {
                title: "Advanced Analytics",
                desc: "Visual dashboards for sales, profit, and inventory turnover trends.",
                icon: BarChart3,
                color: "amber"
            },
            {
                title: "Mobile Dashboard",
                desc: "Monitor your business from your phone in real-time.",
                icon: Smartphone,
                color: "sky"
            }
        ]
    },
    {
        title: "Enterprise Scale",
        description: "Built to handle high volume and multi-store complexity.",
        features: [
            {
                title: "Bank-Grade Security",
                desc: "End-to-end encryption for all payments and data transactions.",
                icon: ShieldCheck,
                color: "slate"
            },
            {
                title: "Offline Resilience",
                desc: "Never stop selling. The system keeps running even if the internet fails.",
                icon: Wifi,
                color: "orange"
            },
            {
                title: "Open API",
                desc: "Connect with your favorite accounting and e-commerce tools.",
                icon: Globe,
                color: "indigo"
            }
        ]
    }
];

const comingSoon = [
    {
        title: "Predictive Ordering",
        desc: "AI that predicts what you need to restock before you run out.",
        icon: BrainCircuit,
        gradient: "from-pink-500 to-rose-500"
    },
    {
        title: "Voice POS",
        desc: "Hands-free checkout using natural language voice commands.",
        icon: Mic,
        gradient: "from-violet-600 to-indigo-600"
    },
    {
        title: "Crypto Payments",
        desc: "Native support for BTC, ETH, and USDC payments.",
        icon: Wallet,
        gradient: "from-emerald-400 to-teal-500"
    },
    {
        title: "ID Recognition",
        desc: "Facial ID for instant staff login and VIP customer alerts.",
        icon: ScanFace,
        gradient: "from-blue-400 to-cyan-400"
    },
    {
        title: "Store Fronts",
        desc: "Launch a fully synced online store with drag-and-drop ease.",
        icon: ShoppingBag,
        gradient: "from-fuchsia-500 to-pink-500"
    }
];

// Helper for dynamic icon colors
const ColorIcon = ({ icon: Icon, color }: { icon: any, color: string }) => {
    const colorClasses: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-blue-400",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-600/20 dark:text-emerald-400",
        violet: "text-violet-600 bg-violet-50 dark:bg-violet-600/20 dark:text-violet-400",
        rose: "text-rose-600 bg-rose-50 dark:bg-rose-600/20 dark:text-rose-400",
        amber: "text-amber-600 bg-amber-50 dark:bg-amber-600/20 dark:text-amber-400",
        sky: "text-sky-600 bg-sky-50 dark:bg-sky-600/20 dark:text-sky-400",
        slate: "text-slate-600 bg-slate-50 dark:bg-slate-600/20 dark:text-slate-400",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-600/20 dark:text-orange-400",
        indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-600/20 dark:text-indigo-400",
    };
    return (
        <div className={`p-4 rounded-2xl ${colorClasses[color]} mb-6 w-fit backdrop-blur-sm`}>
            <Icon className="w-8 h-8" />
        </div>
    );
};

import { SiteFooter } from "@/components/site-footer";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32 px-6">
                {/* specialized header */}
                <div className="max-w-7xl mx-auto text-center mb-32 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Feature Matrix</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
                    >
                        Capabilities <br />
                        <span className="text-blue-500">Unleashed.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Engineered for high-performance retail operations. Every module architected for scale, speed, and security.
                    </motion.p>
                </div>

                {/* Categorized Features */}
                <div className="max-w-7xl mx-auto space-y-24 mb-40">
                    {featureCategories.map((category, i) => (
                        <div key={i} className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden ring-1 ring-white/10 backdrop-blur-xl">
                            {/* Noise Background */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                    className="mb-16 text-center max-w-3xl mx-auto"
                                >
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">{category.title}</h2>
                                    <p className="text-xl text-slate-400 font-medium leading-relaxed">{category.description}</p>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {category.features.map((feature, j) => (
                                        <motion.div
                                            key={j}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: j * 0.1 }}
                                            viewport={{ once: true }}
                                            className="group p-8 rounded-[2rem] bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_24px_64px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
                                        >
                                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                                <feature.icon className={`w-32 h-32 text-${feature.color}-500 -mr-10 -mt-10 rotate-12`} />
                                            </div>

                                            <ColorIcon icon={feature.icon} color={feature.color} />

                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium relative z-10">{feature.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-12 md:p-24 relative overflow-hidden ring-1 ring-white/10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <div className="relative z-10">
                            <div className="mb-20">
                                <span className="inline-block px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-500/30">
                                    The Labs
                                </span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                                    Building the <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Future of Retail.</span>
                                </h2>
                                <p className="text-slate-400 text-xl font-medium max-w-2xl">
                                    Our R&D team is constantly pushing boundaries. Here is a sneak peek at what is currently in development.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {comingSoon.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                            <item.icon className="text-white w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <SiteFooter />
        </div>
    );
}
