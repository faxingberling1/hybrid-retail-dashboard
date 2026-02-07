"use client"

import { Shield, ArrowLeft, Lock, Eye, Database, Globe, Share2, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 3, 2026"

    const sections = [
        {
            title: "Data Collection",
            icon: <Database className="h-6 w-6" />,
            content: "We collect information that you provide directly to us when you create an account, update your profile, or use our POS services. This includes your name, email address, phone number, and business details."
        },
        {
            title: "How We Use Information",
            icon: <Eye className="h-6 w-6" />,
            content: "Your data is used to provide and maintain our services, process transactions, send technical notices, and respond to your comments or questions. We also use it for analytics to improve our software."
        },
        {
            title: "Data Protection",
            icon: <Lock className="h-6 w-6" />,
            content: "We implement robust security measures including 256-bit encryption, routine security audits, and strict access controls to protect your business and customer data from unauthorized access."
        },
        {
            title: "Global Compliance",
            icon: <Globe className="h-6 w-6" />,
            content: "HybridPOS is designed to be compliant with major global data protection standards, ensuring that your data is handled with the highest level of care regardless of where your business operates."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            </div>

            <div className="relative container mx-auto px-4 py-12 max-w-4xl">
                {/* Navigation */}
                <Link
                    href="/login"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Login
                </Link>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-4"

                    >
                        <Shield className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Privacy First</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"

                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"

                    >
                        Last Updated: {lastUpdated}
                    </motion.p>
                </div>

                {/* Content Cards */}
                <div className="grid gap-6 mb-16">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"

                        >
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Sections */}
                <div className="bg-white/60 backdrop-blur-md border border-white/40 p-10 rounded-[3rem] shadow-xl mb-16">
                    <div className="space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-black">1</span>
                                Information Shared
                            </h2>
                            <p className="text-gray-700 leading-relaxed ml-11">
                                We do not sell your personal data to third parties. We may share information with service providers who perform tasks on our behalf (like payment processing or cloud hosting), or when required by law to protect our rights or the safety of our users.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-black">2</span>
                                Cookie Policy
                            </h2>
                            <p className="text-gray-700 leading-relaxed ml-11">
                                Our platform uses cookies and similar technologies to enhance your experience, analyze device performance, and maintain secure sessions. You can manage your cookie preferences through your browser settings at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-black">3</span>
                                Your Rights
                            </h2>
                            <p className="text-gray-700 leading-relaxed ml-11">
                                Depending on your location, you may have the right to access, correct, or delete your personal data. If you wish to exercise these rights, please contact our privacy officer at <span className="text-blue-600 font-semibold underline">privacy@hybridpos.pk</span>.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl shadow-blue-500/30">
                    <Bell className="h-12 w-12 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl font-bold mb-4">Questions or Concerns?</h2>
                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                        Our dedicated privacy team is here to help you understand how your data is protected and managed.
                    </p>
                    <a
                        href="mailto:support@hybridpos.pk"
                        className="inline-block px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all transform hover:scale-105"
                    >
                        Contact Support Team
                    </a>
                </div>

                <div className="text-center mt-12 text-gray-500 text-sm">
                    © {new Date().getFullYear()} HybridPOS. All security protocols active.
                </div>
            </div>
        </div>
    )
}
