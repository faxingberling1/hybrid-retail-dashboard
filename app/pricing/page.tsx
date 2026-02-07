"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Printer, Scan, Monitor, Smartphone, Zap, X, HelpCircle, Info, Archive, Tag, LayoutTemplate } from "lucide-react";

import { SiteHeader } from "@/components/site-header";

// Feature Matrix Data
const featureComparison = [
    {
        category: "Core POS",
        features: [
            { name: "Register Terminals", essential: "1", professional: "Unlimited", enterprise: "Unlimited" },
            { name: "Staff Accounts", essential: "2", professional: "10", enterprise: "Unlimited" },
            { name: "Product/SKU Limit", essential: "1,000", professional: "10,000", enterprise: "Unlimited" },
            { name: "Customer Profiles", essential: "Basic", professional: "Advanced CRM", enterprise: "AI Segments" },
        ]
    },
    {
        category: "Inventory & Management",
        features: [
            { name: "Multi-Store Sync", essential: false, professional: true, enterprise: true },
            { name: "Purchase Orders", essential: true, professional: true, enterprise: true },
            { name: "Low Stock Alerts", essential: true, professional: true, enterprise: true },
            { name: "Stock Transfers", essential: false, professional: true, enterprise: true },
            { name: "Supplier Management", essential: false, professional: true, enterprise: true },
        ]
    },
    {
        category: "Reporting & Analytics",
        features: [
            { name: "Sales Dashboard", essential: "Basic", professional: "Advanced", enterprise: "Real-time AI" },
            { name: "Tax Reports", essential: true, professional: true, enterprise: true },
            { name: "Employee Performance", essential: false, professional: true, enterprise: true },
            { name: "Export to Excel/PDF", essential: true, professional: true, enterprise: true },
        ]
    },
    {
        category: "Support & Security",
        features: [
            { name: "Support Channel", essential: "Email", professional: "Email & Chat", enterprise: "24/7 Dedicated" },
            { name: "Onboarding Session", essential: false, professional: "1 Hour", enterprise: "On-site" },
            { name: "User Roles/Permissions", essential: "Admin/Staff", professional: "Custom Roles", enterprise: "Granular ACL" },
        ]
    }
];

// Pricing Data Configuration
const pricingData = {
    plans: [
        {
            id: "essential",
            name: "Essential",
            description: "Everything you need to run a single modern retail store.",
            features: ["1 POS Terminal", "2 Staff Accounts", "1,000 Products", "Basic Reporting"],
            color: "slate-900",
            price: {
                monthly: { PKR: "4,000", USD: "19" },
                annual: { PKR: "3,200", USD: "15" }
            }
        },
        {
            id: "professional",
            name: "Professional",
            description: "Advanced tools for growing businesses and multi-outlet chains.",
            features: ["Unlimited Terminals", "10 Staff Accounts", "10,000 Products", "Multi-Store Sync", "Advanced CRM"],
            color: "blue-600",
            popular: true,
            price: {
                monthly: { PKR: "12,000", USD: "49" },
                annual: { PKR: "9,600", USD: "39" }
            }
        },
        {
            id: "enterprise",
            name: "Enterprise",
            description: "Mission-critical scale for national retail networks.",
            features: ["Unlimited Everything", "AI-Driven Analytics", "Dedicated Support", "Custom Integrations", "SLA Guarantee"],
            color: "indigo-600",
            price: {
                monthly: { PKR: "Quote", USD: "Quote" },
                annual: { PKR: "Quote", USD: "Quote" }
            }
        }
    ],
    addons: [
        {
            name: "Smart POS Terminal",
            description: "The ultimate countertop command center. All-in-one Android terminal with integrated printer.",
            price: { PKR: "85,000", USD: "299" },
            icon: Monitor,
            specs: ["15.6\" HD Touch Display", "Built-in 80mm Thermal Printer", "4G + WiFi + Bluetooth", "Android 13 OS"]
        },
        {
            name: "Wireless Scanner",
            description: "Industrial-grade freedom. Scan barcodes from up to 100m away with extreme precision.",
            price: { PKR: "14,000", USD: "49" },
            icon: Scan,
            specs: ["1D & 2D QR Support", "100m Wireless Range", "7-Day Battery Life", "IP54 Rugged Drop-Proof"]
        },
        {
            name: "Network Printer",
            description: "High-speed kitchen and receipt printing ensuring your operations never bottle-neck.",
            price: { PKR: "28,000", USD: "99" },
            icon: Printer,
            specs: ["250mm/s Print Speed", "Auto-Cutter (1.5M Cuts)", "LAN/USB/Serial Interface", "Wall-Mount Compatible"]
        },
        {
            name: "Pro Cash Drawer",
            description: "Heavy-duty steel construction with smooth ball-bearing glides for high-volume cash handling.",
            price: { PKR: "16,000", USD: "55" },
            icon: Archive,
            specs: ["Heavy Gauge Steel", "RJ11/RJ12 Interface", "5 Bill / 8 Coin Slots", "1 Million Cycle Life"]
        },
        {
            name: "Label Printer",
            description: "Create custom barcodes and price tags on demand. Perfect for inventory management.",
            price: { PKR: "35,000", USD: "125" },
            icon: Tag,
            specs: ["Direct Thermal Printing", "UPC/EAN Support", "127mm/s Speed", "Label Design Software"]
        },
        {
            name: "Customer Display",
            description: "Engage customers at checkout with a secondary screen for prices, promos, and QR codes.",
            price: { PKR: "25,000", USD: "89" },
            icon: LayoutTemplate,
            specs: ["10.1\" IPS Display", "USB Powered", "Customizable Slideshows", "Dynamic QR Payments"]
        }
    ]
};

import { SiteFooter } from "@/components/site-footer";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center mb-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Flexible Casting</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
                    >
                        Pricing <br />
                        <span className="text-emerald-500">Perfected.</span>
                    </motion.h1>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12"
                    >
                        {/* Billing Cycle Toggle */}
                        <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center relative backdrop-blur-sm">
                            {['monthly', 'annual'].map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() => setBillingCycle(cycle as any)}
                                    className={`relative z-10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === cycle ? 'text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {cycle}
                                    {cycle === 'annual' && <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold shadow-sm">-20%</span>}
                                </button>
                            ))}
                            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-900 dark:bg-blue-600 rounded-xl transition-all duration-300 ${billingCycle === 'annual' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}></div>
                        </div>

                        {/* Currency Toggle */}
                        <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center relative backdrop-blur-sm">
                            {['PKR', 'USD'].map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => setCurrency(curr as any)}
                                    className={`relative z-10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currency === curr ? 'text-blue-600 dark:text-white bg-white dark:bg-blue-600 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Plans Grid */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-40">
                    {pricingData.plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-12 rounded-[3.5rem] bg-white dark:bg-white/5 border ${plan.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/10' : 'border-slate-100 dark:border-white/5'} relative overflow-hidden flex flex-col backdrop-blur-sm`}
                        >
                            {plan.popular && (
                                <div className="absolute top-8 right-8 bg-blue-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 text-sm">{plan.description}</p>

                            <div className="mb-10 flex items-baseline space-x-1">
                                {plan.price[billingCycle][currency] !== 'Quote' && (
                                    <span className="text-3xl font-black text-slate-400 dark:text-slate-500 align-top mr-1">{currency === 'USD' ? '$' : 'Rs.'}</span>
                                )}
                                <span className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">{plan.price[billingCycle][currency]}</span>
                                {plan.price[billingCycle][currency] !== "Quote" && <span className="text-sm font-bold text-slate-400 dark:text-slate-500">/mo</span>}
                            </div>

                            <div className="space-y-4 mb-12 flex-grow">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all bg-${plan.color} ${plan.color === 'slate-900' ? 'dark:bg-white dark:text-black' : ''} text-white hover:scale-105 shadow-xl mt-auto`}>
                                Select {plan.name}
                            </button>

                            {plan.color === 'slate-900' && <style>{`.bg-slate-900 { background-color: #0f172a }`}</style>}
                            {plan.color === 'blue-600' && <style>{`.bg-blue-600 { background-color: #2563eb }`}</style>}
                            {plan.color === 'indigo-600' && <style>{`.bg-indigo-600 { background-color: #4f46e5 }`}</style>}
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="max-w-7xl mx-auto mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
                            Construct Your <span className="text-blue-600">Comparison.</span>
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 border-b-2 border-slate-100 dark:border-white/5 min-w-[200px]"></th>
                                    <th className="p-6 border-b-2 border-slate-100 dark:border-white/5 text-xl font-black text-slate-900 dark:text-white min-w-[200px]">Essential</th>
                                    <th className="p-6 border-b-2 border-blue-500 text-xl font-black text-blue-600 dark:text-blue-400 min-w-[200px] bg-blue-50/50 dark:bg-blue-900/10 rounded-t-2xl">Professional</th>
                                    <th className="p-6 border-b-2 border-slate-100 dark:border-white/5 text-xl font-black text-indigo-600 dark:text-indigo-400 min-w-[200px]">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {featureComparison.map((category, i) => (
                                    <>
                                        <tr key={category.category} className="bg-slate-50/50 dark:bg-white/5">
                                            <td colSpan={4} className="p-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-6">
                                                {category.category}
                                            </td>
                                        </tr>
                                        {category.features.map((feature, j) => (
                                            <tr key={j} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center group cursor-help relative">
                                                    {feature.name}
                                                    <Info className="h-3 w-3 ml-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </td>
                                                <td className="p-6 text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
                                                    {typeof feature.essential === 'boolean' ? (
                                                        feature.essential ? <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /> : <div className="h-1 w-4 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full" />
                                                    ) : feature.essential}
                                                </td>
                                                <td className="p-6 text-sm font-bold text-slate-900 dark:text-white text-center bg-blue-50/10 dark:bg-blue-900/5">
                                                    {typeof feature.professional === 'boolean' ? (
                                                        feature.professional ? <CheckCircle className="h-5 w-5 text-blue-500 mx-auto" /> : <div className="h-1 w-4 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full" />
                                                    ) : feature.professional}
                                                </td>
                                                <td className="p-6 text-sm font-bold text-indigo-600 dark:text-indigo-400 text-center">
                                                    {typeof feature.enterprise === 'boolean' ? (
                                                        feature.enterprise ? <CheckCircle className="h-5 w-5 text-indigo-500 mx-auto" /> : <div className="h-1 w-4 bg-slate-200 dark:bg-slate-700 mx-auto rounded-full" />
                                                    ) : feature.enterprise}
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add-ons Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 mb-6 font-bold text-xs uppercase tracking-widest">
                            <Zap className="h-4 w-4 mr-2 text-amber-500 fill-current" />
                            Hardware Expansion
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
                            Power Up Your <br />
                            <span className="text-blue-600">Countertop.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingData.addons.map((addon, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-xl backdrop-blur-sm"
                            >
                                <div className="h-16 w-16 bg-white dark:bg-white/10 rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400">
                                    <addon.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{addon.name}</h3>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">{addon.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {(addon as any).specs.map((spec: string, k: number) => (
                                        <li key={k} className="flex items-center text-xs font-bold text-slate-400 dark:text-slate-500">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                                            {spec}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-white/5">
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mr-1">{currency === 'USD' ? '$' : 'Rs.'}</span>
                                        {addon.price[currency]}
                                    </div>
                                    <button className="h-10 w-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-400 dark:group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
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
