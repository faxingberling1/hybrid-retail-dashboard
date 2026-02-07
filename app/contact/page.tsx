"use client"

import { useState } from "react"
import {
    Mail, Phone, MapPin, Send, ArrowLeft,
    MessageSquare, Building, Users, CheckCircle2,
    Globe, Clock, Headphones
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ContactSalesPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        businessName: "",
        businessType: "RETAIL",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitted(true)
        }, 1500)
    }

    const contactInfos = [
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email Us",
            value: "sales@hybridpos.pk",
            description: "Response within 4 business hours",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Call Us",
            value: "+92 300 1234567",
            description: "Mon-Sat, 9AM-8PM PKT",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Visit Us",
            value: "Software Park, Lahore",
            description: "Pakistan's Tech Hub",
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Banner */}
            <div className="bg-gray-900 py-3 text-center">
                <p className="text-gray-300 text-xs font-medium tracking-widest uppercase">
                    Empowering 500+ Businesses Across Pakistan
                </p>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium transition-colors mb-8 group"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                    Back to Dashboard
                                </Link>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6"
                                >
                                    Let's scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">business together.</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl text-gray-600 leading-relaxed"
                                >
                                    Ready to transform your retail operations? Our sales experts are here to help you find the perfect HybridPOS solution.
                                </motion.p>
                            </div>

                            <div className="hidden lg:flex items-center gap-6 pb-2">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-sm`}>
                                            <Users className="h-5 w-5" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Expert Team</div>
                                    <div className="text-xs text-gray-500">Available for consultation</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-12 items-start">
                            {/* Form Section */}
                            <div className="lg:col-span-3">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 border border-white"
                                >
                                    {!submitted ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 ml-2">Your Name</label>
                                                    <div className="relative">
                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            placeholder="John Doe"
                                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 ml-2">Work Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            required
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="john@company.pk"
                                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 ml-2">Business Name</label>
                                                    <div className="relative">
                                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.businessName}
                                                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                                            placeholder="Abc Enterprise"
                                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 ml-2">Industry</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <select
                                                            value={formData.businessType}
                                                            onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900 appearance-none cursor-pointer"
                                                        >
                                                            <option value="RETAIL">Retail Store</option>
                                                            <option value="RESTAURANT">Restaurant</option>
                                                            <option value="PHARMACY">Pharmacy</option>
                                                            <option value="SUPERMARKET">Super Market</option>
                                                            <option value="OTHER">Other Business</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-2">How can we help?</label>
                                                <div className="relative">
                                                    <MessageSquare className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
                                                    <textarea
                                                        rows={4}
                                                        value={formData.message}
                                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                        placeholder="Tell us about your requirements..."
                                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900 resize-none"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <button
                                                disabled={isSubmitting}
                                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                            >
                                                {isSubmitting ? (
                                                    <Clock className="h-6 w-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        Request a Demo
                                                        <Send className="h-5 w-5" />
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-center text-xs text-gray-400 px-6">
                                                By submitting this form, you agree to our <Link href="/privacy" className="text-blue-500 underline">Privacy Policy</Link> and <Link href="/terms" className="text-blue-500 underline">Terms of Service</Link>.
                                            </p>
                                        </form>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                                            </div>
                                            <h2 className="text-4xl font-black text-gray-900 mb-4">Request Received!</h2>
                                            <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto">
                                                Our sales team has been notified. We'll be in touch via <span className="text-blue-600 font-bold">{formData.email}</span> within 4 hours.
                                            </p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                            >
                                                Submit another request
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Contact Cards */}
                                <div className="space-y-4">
                                    {contactInfos.map((info, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (idx * 0.1) }}
                                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-2xl ${info.bg} ${info.color} transition-transform group-hover:scale-110`}>
                                                    {info.icon}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{info.title}</div>
                                                    <div className="text-lg font-bold text-gray-900">{info.value}</div>
                                                    <div className="text-xs text-gray-500">{info.description}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Trust Widget */}
                                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[3rem] p-10 text-white shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                    <Headphones className="h-10 w-10 text-blue-400 mb-6" />
                                    <h3 className="text-2xl font-black mb-4 tracking-tight">24/7 Premium Support</h3>
                                    <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
                                        Every HybridPOS plan includes dedicated account managers and technical support to ensure your business never stops.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Dedicated Onboarding",
                                            "Hardware Assistance",
                                            "Live Cloud Monitoring"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-sm font-bold">
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
