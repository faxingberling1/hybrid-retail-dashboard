"use client"

import { FileText, ArrowLeft, Gavel, Scale, AlertTriangle, CheckSquare, Zap, Target } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TermsOfServicePage() {
    const lastUpdated = "February 3, 2026"

    const points = [
        {
            title: "Service Usage",
            icon: <Zap className="h-6 w-6" />,
            content: "Users must provide accurate information when registering and are responsible for maintaining account security. The service is intended for business operations and must not be used for illegal activities."
        },
        {
            title: "Subscription & Billing",
            icon: <Scale className="h-6 w-6" />,
            content: "Subscription fees are billed in advance on a recurring basis. You are responsible for all taxes and fees as specified in your plan. 14-day free trials are limited to one per organization."
        },
        {
            title: "Intellectual Property",
            icon: <Target className="h-6 w-6" />,
            content: "All software, designs, and content provided by HybridPOS are protected by copyright laws. Users retain ownership of their business data uploaded to the platform."
        },
        {
            title: "Liability & Warranty",
            icon: <AlertTriangle className="h-6 w-6" />,
            content: "The service is provided 'as is' without warranties. HybridPOS is not liable for indirect, incidental, or consequential damages resulting from the use of the service."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-4xl">
                {/* Navigation */}
                <Link
                    href="/login"
                    className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Login
                </Link>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-4"
                        {...({} as any)}
                    >
                        <Gavel className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Legal Agreement</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
                        {...({} as any)}
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"
                        {...({} as any)}
                    >
                        Please read these terms carefully before using our platform.
                    </motion.p>
                </div>

                {/* Highlight Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {points.map((point, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all"
                            {...({} as any)}
                        >
                            <div className="p-3 bg-amber-50 rounded-xl w-fit mb-4 text-amber-600">
                                {point.icon}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{point.title}</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{point.content}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Agreement */}
                <div className="bg-white/70 backdrop-blur-md border border-white/50 p-10 rounded-[3rem] shadow-xl mb-16 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <CheckSquare className="h-6 w-6 text-amber-600" />
                            1. Acceptance of Terms
                        </h2>
                        <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed">
                            <p>
                                By accessing or using HybridPOS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <CheckSquare className="h-6 w-6 text-amber-600" />
                            2. User Obligations
                        </h2>
                        <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed space-y-4">
                            <p>
                                You are responsible for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Maintaining the confidentiality of your account credentials.</li>
                                <li>All activities that occur under your account.</li>
                                <li>Ensuring your data complies with local business regulations.</li>
                                <li>Notifying us immediately of any unauthorized use of your account.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <CheckSquare className="h-6 w-6 text-amber-600" />
                            3. Termination
                        </h2>
                        <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed">
                            <p>
                                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Agreement Questions?</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            If you have any questions regarding these Terms of Service, please reach out to our legal department.
                        </p>
                        <Link
                            href="mailto:legal@hybridpos.pk"
                            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all inline-block"
                        >
                            Email Legal Team
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-500 text-sm">
                    Last Revision: {lastUpdated} • © {new Date().getFullYear()} HybridPOS
                </div>
            </div>
        </div>
    )
}
