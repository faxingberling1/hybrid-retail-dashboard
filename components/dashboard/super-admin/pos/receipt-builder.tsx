"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Layout,
    Type,
    Image as ImageIcon,
    QrCode,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Plus,
    Trash2,
    Save,
    Settings2,
    Palette,
    FileText,
    MoveVertical,
    Check,
    Scissors,
    Zap,
    Tag,
    Info,
    Smartphone,
    Eye,
    Moon,
    Sun,
    Printer
} from "lucide-react"
import { toast } from "sonner"

export function ReceiptBuilder() {
    const [previewMode, setPreviewMode] = useState("thermal") // thermal, light, dark
    const [config, setConfig] = useState({
        header: "HYBRID RETAIL POS",
        subheader: "Digital Solutions for Modern Retail",
        address: "123 Business Avenue, Tech City",
        phone: "+1 234 567 890",
        taxId: "TAX-992-001",
        website: "www.hybridpos.com",
        showLogo: true,
        logoAlignment: "center",
        logoSize: 48,
        showQrCode: true,
        footer: "Thank you for shopping with us!",
        secondaryFooter: "Join our loyalty program for 10% off",
        paperSize: "80mm",
        fontFamily: "monospace",
        baseFontSize: 12,
        lineHeight: 1.4,
        borderStyle: "dashed",
        headerAlignment: "center",
        primaryColor: "#000000",
        itemSpacing: "relaxed",
        showStoreIcon: true,
        promoText: "SUMMER SALE: 20% OFF NEXT PURCHASE",
        showPromo: true
    })

    const updateField = (field: string, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const fontOptions = [
        { id: "monospace", label: "Monospace (Classic POS)", class: "font-mono" },
        { id: "sans", label: "Modern Sans", class: "font-sans" },
        { id: "serif", label: "Elegant Serif", class: "font-serif" }
    ]

    const borderStyles = ["dashed", "dotted", "solid", "double"]

    return (
        <div className="flex flex-col xl:flex-row gap-8 min-h-[900px]">
            {/* Elite Editor Sidebar */}
            <div className="xl:w-[480px] space-y-6 flex-shrink-0">
                {/* Advanced Controls Accordion-like approach */}
                <div className="space-y-4">
                    {/* Section: Core Setup */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-blue-200 transition-all">
                        <h3 className="font-black text-gray-900 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                                    <Settings2 className="h-4 w-4" />
                                </div>
                                <span>Master Config</span>
                            </div>
                            <span className="text-[10px] font-black py-1 px-3 bg-blue-50 text-blue-600 rounded-full uppercase">Required</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {["58mm", "80mm"].map(size => (
                                <button
                                    key={size}
                                    onClick={() => updateField("paperSize", size)}
                                    className={`py-4 rounded-2xl text-[10px] font-black transition-all border-2 relative overflow-hidden ${config.paperSize === size
                                            ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/20"
                                            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                                        }`}
                                >
                                    {size} {config.paperSize === size && <Check className="absolute top-2 right-2 h-3 w-3" />}
                                    PLATE SIZE
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Elite Typography</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {fontOptions.map(font => (
                                        <button
                                            key={font.id}
                                            onClick={() => updateField("fontFamily", font.id)}
                                            className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm transition-all border-2 ${config.fontFamily === font.id
                                                    ? "border-blue-500 bg-blue-50/50 text-blue-700 font-bold"
                                                    : "border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                }`}
                                        >
                                            <span className={font.class}>{font.label}</span>
                                            {config.fontFamily === font.id && <Zap className="h-4 w-4 fill-blue-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Branding & Identity */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-purple-200 transition-all">
                        <h3 className="font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:rotate-12 transition-transform">
                                <Palette className="h-4 w-4" />
                            </div>
                            Brand Identity
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo Mode</label>
                                    <button
                                        onClick={() => updateField("showLogo", !config.showLogo)}
                                        className={`w-full py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${config.showLogo ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
                                    >
                                        {config.showLogo ? 'VISIBLE' : 'HIDDEN'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alignment</label>
                                    <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                        {[
                                            { id: "left", icon: <AlignLeft className="h-3 w-3" /> },
                                            { id: "center", icon: <AlignCenter className="h-3 w-3" /> },
                                            { id: "right", icon: <AlignRight className="h-3 w-3" /> }
                                        ].map(align => (
                                            <button
                                                key={align.id}
                                                onClick={() => updateField("logoAlignment", align.id)}
                                                className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${config.logoAlignment === align.id
                                                        ? "bg-white text-gray-900 shadow-sm"
                                                        : "text-gray-400 hover:text-gray-600"
                                                    }`}
                                            >
                                                {align.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Display Headline</label>
                                    <input
                                        type="text"
                                        value={config.header}
                                        onChange={(e) => updateField("header", e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-200 rounded-2xl text-sm font-bold outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Metadata Line (NTN/FTN)</label>
                                    <input
                                        type="text"
                                        value={config.taxId}
                                        onChange={(e) => updateField("taxId", e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-200 rounded-2xl text-sm font-bold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Promotional Modules */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-amber-200 transition-all">
                        <h3 className="font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:animate-bounce transition-transform">
                                <Tag className="h-4 w-4" />
                            </div>
                            Promotional Space
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                                        <Zap className="h-3 w-3" />
                                    </div>
                                    <span className="text-[10px] font-black text-amber-900 lowercase tracking-widest">Active Upsell</span>
                                </div>
                                <button
                                    onClick={() => updateField("showPromo", !config.showPromo)}
                                    className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${config.showPromo ? 'bg-amber-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${config.showPromo ? 'translate-x-4' : ''}`} />
                                </button>
                            </div>

                            {config.showPromo && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Campaign Text</label>
                                    <textarea
                                        value={config.promoText}
                                        onChange={(e) => updateField("promoText", e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-amber-200 rounded-2xl text-xs font-bold outline-none transition-all h-24 resize-none"
                                        placeholder="Add a limited time offer or discount claim code..."
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4">
                    <button
                        onClick={() => toast.success("Elite Configuration Published to Hardware Sync")}
                        className="w-full py-6 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-4 border-t border-white/20"
                    >
                        <Save className="h-5 w-5" />
                        Deploy to Global Network
                    </button>
                    <div className="flex gap-4">
                        <button className="flex-1 py-5 bg-white text-gray-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition-all border border-gray-100">
                            Safe Revert
                        </button>
                        <button className="flex-1 py-5 bg-white text-gray-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all border border-gray-100 flex items-center justify-center gap-2">
                            <Info className="h-4 w-4" />
                            Guide
                        </button>
                    </div>
                </div>
            </div>

            {/* High-Fidelity Preview Terminal */}
            <div className="flex-1 bg-gray-950 rounded-[4rem] p-10 lg:p-16 flex flex-col items-center justify-start border border-gray-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                {/* Background Grid Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(#2d3748_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

                {/* Preview Controls Header */}
                <div className="mb-12 w-full flex flex-col items-center">
                    <div className="flex bg-gray-900/80 backdrop-blur-md rounded-2xl p-1.5 border border-gray-800 mb-8 self-center">
                        {[
                            { id: "thermal", icon: <Printer className="h-4 w-4" />, label: "Thermal" },
                            { id: "light", icon: <Sun className="h-4 w-4" />, label: "Light" },
                            { id: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark" }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setPreviewMode(mode.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${previewMode === mode.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {mode.icon}
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 justify-center w-full">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent flex-1" />
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            Hardware Sync Active
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent flex-1" />
                    </div>
                </div>

                {/* The Virtual Receipt */}
                <motion.div
                    layout
                    style={{
                        width: config.paperSize === "80mm" ? "440px" : "320px",
                        fontFamily: config.fontFamily === "monospace" ? "'Courier New', Courier, monospace" : config.fontFamily === "serif" ? "serif" : "sans-serif"
                    }}
                    className={`
                        relative transition-all duration-500 ease-in-out shadow-[0_40px_120px_rgba(0,0,0,0.6)] p-12 lg:p-16 min-h-[700px] border-t-[16px] border-gray-900
                        ${previewMode === 'thermal' ? 'bg-white text-black' :
                            previewMode === 'dark' ? 'bg-gray-900 text-white border-t-blue-600' : 'bg-gray-50 text-gray-900 border-t-white'}
                    `}
                >
                    {/* Header Rendering */}
                    {config.showLogo && (
                        <div className={`flex flex-col mb-10 ${config.logoAlignment === "center" ? "items-center" :
                                config.logoAlignment === "right" ? "items-end" : "items-start"
                            }`}>
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center p-4 mb-4 shadow-sm border-2 ${previewMode === 'dark' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black border-black text-white'
                                }`}>
                                {config.showStoreIcon ? <ImageIcon className="h-full w-full" /> : <div className="text-2xl font-black">H</div>}
                            </div>
                        </div>
                    )}

                    <div className={`mb-10 ${config.headerAlignment === "center" ? "text-center" : "text-left"
                        }`}>
                        <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter leading-none">{config.header}</h2>
                        <p className={`text-sm font-bold opacity-70 mb-6 ${previewMode === 'dark' ? 'text-blue-300' : ''}`}>{config.subheader}</p>

                        <div className="text-[11px] space-y-1.5 opacity-60 leading-relaxed uppercase font-bold">
                            <p>{config.address}</p>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <p>PH: {config.phone}</p>
                                <span className="opacity-30">•</span>
                                <p>TAX: {config.taxId}</p>
                            </div>
                            <p className="underline decoration-2 underline-offset-4 tracking-widest">{config.website}</p>
                        </div>
                    </div>

                    {/* Elite Promo Module */}
                    {config.showPromo && (
                        <div className={`my-10 p-5 rounded-2xl border-2 border-dashed flex items-center gap-4 ${previewMode === 'dark' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-amber-50 border-amber-200 text-amber-900'
                            }`}>
                            <Zap className="h-5 w-5 fill-current flex-shrink-0" />
                            <p className="text-[10px] font-black uppercase leading-tight tracking-tight">
                                {config.promoText}
                            </p>
                        </div>
                    )}

                    {/* Industrial Separator */}
                    <div className={`border-b-4 my-10 ${config.borderStyle === "dashed" ? "border-dashed" :
                            config.borderStyle === "dotted" ? "border-dotted" :
                                config.borderStyle === "double" ? "border-double" : "border-solid"
                        } ${previewMode === 'dark' ? 'border-gray-700' : 'border-black'}`} />

                    {/* Item List Header */}
                    <div className="flex justify-between text-[10px] font-black opacity-40 uppercase mb-4 tracking-widest">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>

                    {/* Item Simulation */}
                    <div className={`space-y-6 mb-10 ${config.itemSpacing === "relaxed" ? "py-2" : ""}`}>
                        {[
                            { name: "RETAIL SUITE - PRO LICENSE", qty: 2, price: "15,000", total: "30,000" },
                            { name: "CLOUD STORAGE (1TB ANNUAL)", qty: 1, price: "45,000", total: "45,000" },
                            { name: "SUPPORT SERVICES BUNDLE", qty: 3, price: "2,500", total: "7,500" }
                        ].map((item, id) => (
                            <div key={id} className="text-xs">
                                <div className="flex justify-between font-black mb-1.5 uppercase tracking-tighter">
                                    <span className="flex-1 mr-6 truncate">{item.name}</span>
                                    <span>Rs {item.total}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold opacity-50 italic">
                                    <span>{item.qty} UNITS @ {item.price}</span>
                                    <span>SUBTOTAL</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`border-b-2 my-10 ${config.borderStyle === "dashed" ? "border-dashed" : "border-solid"
                        } ${previewMode === 'dark' ? 'border-gray-700' : 'border-black'}`} />

                    {/* High-Impact Totals Section */}
                    <div className="space-y-3 mb-12">
                        <div className="flex justify-between text-[11px] uppercase font-bold opacity-70">
                            <span>Gross Amount</span>
                            <span>Rs 82,500.00</span>
                        </div>
                        <div className="flex justify-between text-[11px] uppercase font-bold opacity-70">
                            <span>Service Tax (17%)</span>
                            <span>Rs 14,025.00</span>
                        </div>
                        <div className={`flex justify-between text-2xl font-black pt-6 mt-8 border-t-4 ${previewMode === 'dark' ? 'border-blue-600 text-blue-400' : 'border-black'
                            }`}>
                            <span>TOTAL</span>
                            <span>Rs 96,525</span>
                        </div>
                    </div>

                    {/* QR Integrity Layer */}
                    {config.showQrCode && (
                        <div className={`flex flex-col items-center mb-12 p-8 rounded-3xl border-2 border-dotted transition-all ${previewMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
                            }`}>
                            <QrCode className="h-28 w-28 text-current opacity-80" />
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">ELITE INTEGRITY SCAN</p>
                                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest text-center">VERIFIED INVOICE: SYNC-A9221-FF9</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center space-y-3">
                        <p className="text-[11px] font-black uppercase leading-tight tracking-wide">{config.footer}</p>
                        <p className={`text-[10px] font-bold opacity-50 italic ${previewMode === 'dark' ? 'text-blue-200' : ''}`}>{config.secondaryFooter}</p>

                        <div className="pt-12 flex flex-col items-center">
                            <div className={`h-1.5 w-24 rounded-full mb-6 ${previewMode === 'dark' ? 'bg-blue-900' : 'bg-gray-100'}`} />
                            <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.6em]">ELITE RETAIL ENGINE SYSTEM</p>
                        </div>
                    </div>

                    {/* Elite Cut Indicator */}
                    <div className="relative mt-24">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t-2 border-dashed ${previewMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>
                        </div>
                        <div className="relative flex justify-center gap-3">
                            <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${previewMode === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-600' : 'bg-white border-gray-100 text-gray-400'
                                }`}>
                                <Scissors className="inline-block h-3 w-3 mr-2 -mt-0.5" />
                                Automated Cut Line
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Additional floating artifacts for aesthetics */}
                <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-40">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                </div>
            </div>
        </div>
    )
}
