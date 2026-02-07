
"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Building2, Mail, Phone, MapPin,
    Calendar, Users, DollarSign, Activity,
    TrendingUp, Shield, CreditCard, Clock,
    ExternalLink, Edit, ShieldAlert, CheckCircle2
} from "lucide-react"

interface OrganizationDetailViewProps {
    organization: any
    isOpen: boolean
    onClose: () => void
    onStatusChange: (id: string, newStatus: string) => void
}

export default function OrganizationDetailView({
    organization,
    isOpen,
    onClose,
    onStatusChange
}: OrganizationDetailViewProps) {
    if (!organization) return null

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency', currency: 'PKR', minimumFractionDigits: 0
        }).format(amount).replace('PKR', '₨')
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-emerald-500/10 text-emerald-500'
            case 'suspended': return 'bg-rose-500/10 text-rose-500'
            case 'pending': return 'bg-amber-500/10 text-amber-500'
            default: return 'bg-slate-500/10 text-slate-500'
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-3xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 grad-indigo p-0.5 rounded-2xl">
                                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                                        <Building2 className="h-7 w-7 text-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                                        {organization.name}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full ${getStatusColor(organization.status)}`}>
                                            {organization.status}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 capitalize">
                                            {organization.industry || 'General Retail'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-12">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <Users className="h-5 w-5 text-indigo-500 mb-3" />
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {organization.user_count || 0}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Users</div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <DollarSign className="h-5 w-5 text-emerald-500 mb-3" />
                                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {formatCurrency(organization.total_revenue || 0)}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Platform Revenue</div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <Shield className="h-5 w-5 text-amber-500 mb-3" />
                                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                        {organization.current_plan || 'N/A'}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Subscription</div>
                                </div>
                            </div>

                            {/* Main Info Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Identity & Compliance */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                                            <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
                                            Business Identity
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="h-4 w-4 text-slate-400 mr-3" />
                                                <span className="text-slate-500 font-medium">Registered on:</span>
                                                <span className="text-slate-900 dark:text-slate-200 font-bold ml-2">
                                                    {formatDate(organization.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Activity className="h-4 w-4 text-slate-400 mr-3" />
                                                <span className="text-slate-500 font-medium">Last Node Sync:</span>
                                                <span className="text-slate-900 dark:text-slate-200 font-bold ml-2">
                                                    {formatDate(organization.last_activity)}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <ShieldAlert className="h-4 w-4 text-slate-400 mr-3" />
                                                <span className="text-slate-500 font-medium">Verification:</span>
                                                <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    Verified System
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2 text-indigo-500" />
                                            Billing Infrastructure
                                        </h3>
                                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-medium">Cycle Status</span>
                                                <span className="text-emerald-500 font-black">Healthy</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-medium">Next Invoice</span>
                                                <span className="text-slate-900 dark:text-white font-bold">Standard Queue</span>
                                            </div>
                                            <button className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm">
                                                Generate Ledger
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls & Actions */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                                            <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                                            Admin Controls
                                        </h3>
                                        <div className="space-y-3">
                                            {organization.status === 'active' ? (
                                                <button
                                                    onClick={() => onStatusChange(organization.id, 'suspended')}
                                                    className="w-full flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-2xl group hover:bg-rose-100 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <ShieldAlert className="h-5 w-5 text-rose-500 mr-3" />
                                                        <span className="text-sm font-black text-rose-900 dark:text-rose-200 uppercase tracking-tight">Suspend Organization</span>
                                                    </div>
                                                    <TrendingUp className="h-4 w-4 text-rose-300 group-hover:rotate-45 transition-transform" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onStatusChange(organization.id, 'active')}
                                                    className="w-full flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl group hover:bg-emerald-100 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" />
                                                        <span className="text-sm font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-tight">Restore Access</span>
                                                    </div>
                                                    <TrendingUp className="h-4 w-4 text-emerald-300 group-hover:rotate-45 transition-transform" />
                                                </button>
                                            )}

                                            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:bg-slate-100 transition-colors">
                                                <div className="flex items-center">
                                                    <Edit className="h-5 w-5 text-slate-500 mr-3" />
                                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Adjust Configuration</span>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-slate-300" />
                                            </button>

                                            <button className="w-full flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl group hover:bg-indigo-100 transition-colors">
                                                <div className="flex items-center">
                                                    <Activity className="h-5 w-5 text-indigo-500 mr-3" />
                                                    <span className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">Deep System Audit</span>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-indigo-300" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                            Integration Health
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "94%" }}
                                                    className="h-full grad-indigo"
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-indigo-500">94%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium mt-2">
                                            Operational efficiency based on transaction throughput and user activity density.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Branding */}
                            <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Entity Integrity Validated • HybridPOS Enterprise
                                </span>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
