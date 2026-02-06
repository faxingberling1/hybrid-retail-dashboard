"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    FileText,
    CheckCircle2,
    Download,
    Loader2,
    ArrowRight,
    FileSpreadsheet,
    PieChart,
    ShieldCheck,
    AlertCircle
} from "lucide-react"

interface ReportGeneratorModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (report: any) => void
}

export default function ReportGeneratorModal({ isOpen, onClose, onComplete }: ReportGeneratorModalProps) {
    const [step, setStep] = useState<'config' | 'processing' | 'success'>('config')
    const [progress, setProgress] = useState(0)
    const [reportType, setReportType] = useState("Sales Performance")
    const [format, setFormat] = useState("PDF")

    const reportOptions = [
        { label: "Sales Performance", icon: FileText, desc: "Revenue, volume, and trends" },
        { label: "Inventory Audit", icon: FileSpreadsheet, desc: "Stock levels and turnover" },
        { label: "Staff Efficiency", icon: PieChart, desc: "Productivity by personnel" },
        { label: "Tax Compliance", icon: ShieldCheck, desc: "Integrated FBR calculations" },
    ]

    useEffect(() => {
        if (step === 'processing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setTimeout(() => setStep('success'), 500)
                        return 100
                    }
                    return prev + Math.random() * 15
                })
            }, 300)
            return () => clearInterval(interval)
        }
    }, [step])

    const handleGenerate = () => {
        setStep('processing')
        setProgress(0)
    }

    const handleFinish = () => {
        const newReport = {
            id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: reportType,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            type: reportType.split(' ')[0],
            status: "Ready",
            size: `${(Math.random() * 5).toFixed(1)} MB`
        }
        onComplete(newReport)
        onClose()
        setStep('config')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        {...({
                            initial: { opacity: 0 },
                            animate: { opacity: 1 },
                            exit: { opacity: 0 },
                            onClick: onClose,
                            className: "absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        } as any)}
                    />

                    <motion.div
                        {...({
                            initial: { scale: 0.9, opacity: 0, y: 20 },
                            animate: { scale: 1, opacity: 1, y: 0 },
                            exit: { scale: 0.9, opacity: 0, y: 20 },
                            className: "relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        } as any)}
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Generate Report</h2>
                                    <p className="text-gray-400 text-[10px] font-black tracking-[0.2em] uppercase">Configure your automated audit</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-10">
                            {step === 'config' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {reportOptions.map((opt) => (
                                            <button
                                                key={opt.label}
                                                onClick={() => setReportType(opt.label)}
                                                className={`p-6 rounded-[2rem] border-2 text-left transition-all ${reportType === opt.label
                                                        ? 'border-rose-500 bg-rose-50/30'
                                                        : 'border-gray-50 bg-white hover:border-gray-200'
                                                    }`}
                                            >
                                                <opt.icon className={`h-6 w-6 mb-4 ${reportType === opt.label ? 'text-rose-600' : 'text-gray-400'}`} />
                                                <p className={`font-black uppercase tracking-tight ${reportType === opt.label ? 'text-rose-900' : 'text-gray-900'}`}>{opt.label}</p>
                                                <p className="text-xs text-gray-400 font-medium">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex bg-gray-50 p-2 rounded-2xl">
                                        {["PDF", "Excel", "CSV"].map(fmt => (
                                            <button
                                                key={fmt}
                                                onClick={() => setFormat(fmt)}
                                                className={`flex-1 py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${format === fmt ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleGenerate}
                                        className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        Start Synthesis <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {step === 'processing' && (
                                <div className="py-20 flex flex-col items-center text-center">
                                    <div className="relative mb-10">
                                        <svg className="h-32 w-32 -rotate-90">
                                            <circle cx="64" cy="64" r="60" className="stroke-gray-100 fill-none" strokeWidth="8" />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                className="stroke-rose-600 fill-none"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                style={{ strokeDasharray: 377, strokeDashoffset: 377 - (377 * progress) / 100 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl font-black text-gray-900">{Math.round(progress)}%</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">Compiling Intelligence...</h3>
                                    <p className="text-gray-500 max-w-xs font-medium">Synthesizing data vectors and calculating compliance scores.</p>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="py-12 text-center">
                                    <div className="inline-flex p-6 bg-emerald-50 text-emerald-600 rounded-[2.5rem] mb-8 ring-8 ring-emerald-50/50">
                                        <CheckCircle2 className="h-12 w-12" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Report Manifested</h3>
                                    <p className="text-gray-500 font-medium mb-12">Your {reportType} is now available in the audit history.</p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleFinish}
                                            className="flex-1 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-gray-900/20"
                                        >
                                            View in History
                                        </button>
                                        <button className="p-6 bg-rose-50 text-rose-600 rounded-[2rem] hover:scale-110 transition-all border border-rose-100">
                                            <Download className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security Badge */}
                        <div className="p-6 bg-gray-50 flex items-center justify-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-to-End Encrypted Generation</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
