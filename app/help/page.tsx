"use client"

import { useState } from "react"
import {
    Search, ArrowLeft, LifeBuoy, Book,
    Settings, ShoppingCart, Package, Users,
    MessageCircle, ChevronRight, HelpCircle,
    ExternalLink, PlayCircle, Star
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        {
            title: "Getting Started",
            icon: <PlayCircle className="h-6 w-6" />,
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50",
            description: "Learn the basics of setting up your store and first terminal."
        },
        {
            title: "Inventory & Products",
            icon: <Package className="h-6 w-6" />,
            color: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            description: "Manage stocks, track suppliers, and organize product categories."
        },
        {
            title: "Sales & POS",
            icon: <ShoppingCart className="h-6 w-6" />,
            color: "from-purple-500 to-pink-600",
            bg: "bg-purple-50",
            description: "Daily operations, processing payments, and handling returns."
        },
        {
            title: "Settings & Profile",
            icon: <Settings className="h-6 w-6" />,
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-50",
            description: "Manage your account, team members, and store configurations."
        }
    ]

    const faqs = [
        {
            q: "How do I add a new product to inventory?",
            a: "Navigate to Admin > Inventory Management and click 'Add Product'. Fill in the details, set stock levels, and assign a category.",
            category: "Inventory"
        },
        {
            q: "Can I use HybridPOS without an internet connection?",
            a: "Yes, our POS terminal supports offline mode for processing sales. Data will automatically sync with the cloud once connection is restored.",
            category: "POS"
        },
        {
            q: "How do I invite my staff members?",
            a: "Go to Admin > Staff Management and click 'Invite Member'. Enter their email and assign an appropriate role (e.g., Cashier, Manager).",
            category: "Settings"
        },
        {
            q: "Where can I view my daily sales reports?",
            a: "Detailed reports are available under the 'Reports' section in the Admin Dashboard, offering insights into revenue, top products, and staff performance.",
            category: "Sales"
        }
    ]

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Search Hero */}
            <div className="relative bg-white pb-32 pt-12 overflow-hidden border-b border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>

                {/* Animated Shapes */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative container mx-auto px-4 max-w-5xl">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors mb-12 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6"
                        >
                            <LifeBuoy className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Help Center</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                            How can we help you today?
                        </h1>

                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-16 pr-6 py-6 bg-white border-2 border-transparent focus:border-blue-500 rounded-[2rem] shadow-2xl shadow-blue-500/10 transition-all outline-none text-lg text-gray-900 placeholder:text-gray-400"
                                placeholder="Search for articles, features, or troubleshooting..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10">
                {/* Category Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 transition-all group cursor-pointer"
                        >
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg w-fit mb-6 transition-transform group-hover:scale-110`}>
                                {category.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {category.description}
                            </p>
                            <div className="flex items-center text-blue-600 font-bold text-sm">
                                Explore Articles
                                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="grid lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <HelpCircle className="h-8 w-8 text-blue-600" />
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, idx) => (
                                        <motion.div
                                            key={faq.q}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                                    {faq.category}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h4>
                                            <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No results found for "{searchQuery}"</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20">
                            <MessageCircle className="h-10 w-10 mb-6" />
                            <h3 className="text-2xl font-bold mb-3">Still need help?</h3>
                            <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                                Connect with our support experts directly for personalized assistance.
                            </p>
                            <Link
                                href={'/contact' as any}
                                className="block w-full py-4 bg-white text-blue-700 text-center font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition-all transform hover:scale-105"
                            >
                                Contact Support
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Community Forum", icon: <Users /> },
                                    { label: "Video Tutorials", icon: <PlayCircle /> },
                                    { label: "System Status", icon: <Star /> },
                                    { label: "Developer API", icon: <ExternalLink /> }
                                ].map((link, idx) => (
                                    <button key={idx} className="flex items-center justify-between w-full group text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                {cloneIcon(link.icon, "h-4 w-4 text-gray-400 group-hover:text-blue-600")}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{link.label}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Quote */}
            <div className="bg-white border-t border-gray-100 py-16">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <p className="text-2xl font-medium text-gray-800 italic mb-6">
                        "The Help Center provided immediate answers during our initial setup. The search accuracy is incredible!"
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black">TC</div>
                        <div className="text-left">
                            <div className="font-bold text-gray-900 text-sm">TechCorp Inc.</div>
                            <div className="text-xs text-gray-500">Global Customer</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cloneIcon(icon: any, className: string) {
    const Icon = icon.type
    return <Icon className={className} />
}
