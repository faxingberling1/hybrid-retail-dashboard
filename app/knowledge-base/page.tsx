"use client";

import { motion } from "framer-motion";
import { Book, Search, FileText, Settings, Shield, Zap, Terminal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const categories = [
    {
        title: "Getting Started",
        icon: Zap,
        articles: ["Quick Installation Guide", "System Requirements", "First Transaction"]
    },
    {
        title: "Point of Sale",
        icon: Terminal,
        articles: ["Shortcuts Reference", "Hardware Setup", "Offline Mode"]
    },
    {
        title: "Inventory & Stock",
        icon: Book,
        articles: ["Bulk Import CSV", "Purchase Orders", "Stock Audits"]
    },
    {
        title: "Security & Access",
        icon: Shield,
        articles: ["Role Based Access", "2FA Configuration", "Audit Logs"]
    },
    {
        title: "Advanced Config",
        icon: Settings,
        articles: ["API Integration", "Webhooks", "Custom Reports"]
    },
    {
        title: "Troubleshooting",
        icon: FileText,
        articles: ["Connection Issues", "Printer Errors", "Sync Conflicts"]
    }
];

export default function KnowledgeBasePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32 px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-24 space-y-8">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Documentation</span>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                        Knowledge <br />
                        <span className="text-blue-500">Base.</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Master the matrix. Comprehensive guides, references, and tutorials for the HybridPOS ecosystem.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                        <div className="relative bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-2 flex items-center shadow-2xl backdrop-blur-sm">
                            <Search className="h-6 w-6 text-slate-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium p-4 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                            <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400">
                                ⌘ K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <category.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-6">{category.title}</h3>
                            <ul className="space-y-4">
                                {category.articles.map((article, j) => (
                                    <li key={j}>
                                        <a href="#" className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/link">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700 group-hover/link:bg-blue-500 mr-3 transition-colors"></div>
                                            {article}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
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
