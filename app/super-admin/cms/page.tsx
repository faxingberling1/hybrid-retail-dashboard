"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Save,
    Eye,
    Sparkles,
    Layout,
    Type,
    GripVertical,
    Plus,
    Trash2,
    Zap,
    Globe,
    Lock,
    Activity,
    Database,
    Smartphone,
    CreditCard,
    ArrowRight,
    Loader2,
    FileText,
    Map,
    ShieldCheck,
    Image
} from "lucide-react"
import { toast } from "sonner"

export default function MasterPageEditor() {
    const [activeTab, setActiveTab] = useState<string>("HERO")
    const [previewMode, setPreviewMode] = useState<"MOBILE" | "DESKTOP">("MOBILE")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [content, setContent] = useState<any>(null)

    useEffect(() => {
        fetch('/api/super-admin/cms')
            .then(res => res.json())
            .then(data => {
                // Granular schema merging to handle legacy or partial data structures
                const mergedContent = {
                    ...data,
                    hero: {
                        badge: "Pakistan's No.1 Retail Management System",
                        title: "Retail Perfected.",
                        subtitle: "The high-fidelity ecosystem for professional commerce.",
                        ctaPrimary: "Get Started Free",
                        ctaSecondary: "Schedule a Demo",
                        ...data.hero
                    },
                    header: {
                        logoText: "HybridPOS",
                        logoSubtext: "Enterprise Unified",
                        links: [
                            { label: "Features", href: "/features" },
                            { label: "Pricing", href: "/pricing" },
                            { label: "Blog", href: "/blog" }
                        ],
                        ctaText: "Login",
                        ctaHref: "/login",
                        ...data.header
                    },
                    features: data.features || [],
                    footer: {
                        tagline: "The ultimate retail ecosystem. Synchronized, secure, and scalable.",
                        columns: [
                            {
                                title: "Ecosystem",
                                links: [
                                    { label: "POS Core", href: "#" },
                                    { label: "Inventory Mesh", href: "#" },
                                    { label: "Documentation", href: "/docs" }
                                ]
                            }
                        ],
                        copyright: "Hybrid Retail Systems Ltd.",
                        paymentMethods: data.footer?.paymentMethods || [
                            { name: "Visa", cardBg: "bg-gradient-to-br from-[#1a1f71] to-[#01144c]", logoType: "SVG_VISA", size: "M", href: "#" },
                            { name: "Mastercard", cardBg: "bg-gradient-to-br from-[#222] to-[#444]", logoType: "SVG_MASTERCARD", size: "M", href: "#" }
                        ],
                        ...data.footer
                    },
                    map: {
                        badge: "Operational Hub",
                        title: "Karachi\nCommand Center.",
                        lat: 24.8607,
                        lng: 67.0011,
                        zoom: 12,
                        style: "Dark",
                        ...data.map
                    },
                    enterprise: {
                        badge: "Mission Critical",
                        title: "Command Your Enterprise.",
                        subtitle: "The scale-out infrastructure for retail giants.",
                        cta: "Deploy Enterprise",
                        features: [],
                        ...data.enterprise
                    },
                    media: {
                        images: [],
                        videos: [],
                        ...data.media
                    }
                }
                setContent(mergedContent)
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
                toast.error("Failed to load CMS content")
            })
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/super-admin/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            })
            if (res.ok) {
                toast.success("Master Sync Completed Successfully")
            } else {
                throw new Error("Save failed")
            }
        } catch (error) {
            toast.error("Global Sync Failed")
        } finally {
            setIsSaving(false)
        }
    }

    // Sync state to preview iframe
    useEffect(() => {
        const iframe = document.getElementById('full-page-preview') as HTMLIFrameElement
        if (iframe && iframe.contentWindow && content) {
            iframe.contentWindow.postMessage({
                type: 'CMS_UPDATE',
                content: content
            }, '*')
        }
    }, [content])

    const handleIframeLoad = () => {
        // Re-send content after iframe loads to avoid race condition
        const iframe = document.getElementById('full-page-preview') as HTMLIFrameElement
        if (iframe && iframe.contentWindow && content) {
            setTimeout(() => {
                iframe.contentWindow?.postMessage({
                    type: 'CMS_UPDATE',
                    content: content
                }, '*')
            }, 200)
        }
    }

    if (isLoading) {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
        )
    }

    const tabs = [
        { id: "HEADER", label: "Site Header", icon: <Globe className="h-4 w-4" /> },
        { id: "HERO", label: "Hero & Branding", icon: <Type className="h-4 w-4" /> },
        { id: "FEATURES", label: "Capabilities Matrix", icon: <Layout className="h-4 w-4" /> },
        { id: "MAP", label: "Operational Hub", icon: <Map className="h-4 w-4" /> },
        { id: "ENTERPRISE", label: "Corporate Command", icon: <ShieldCheck className="h-4 w-4" /> },
        { id: "FOOTER", label: "Site Footer", icon: <FileText className="h-4 w-4" /> },
        { id: "MEDIA", label: "Media & Assets", icon: <Image className="h-4 w-4" /> },
    ]

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Layout className="h-5 w-5" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight py-1">
                            Master Page Editor
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">Coordinate the entire digital presence from a single hub</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        Live Synchronized
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/20 hover:scale-[1.02] transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Deploy to Global Network
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10 border-blue-100 border'
                                : 'bg-transparent text-gray-500 hover:text-gray-900'}
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* Editor Content */}
                <div className="flex-1 space-y-8 max-w-[800px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "HERO" && (
                            <motion.div
                                key="hero"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                {/* Elite Narrative Engine */}
                                <div className="group relative bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-blue-500/5 transition-all duration-500 overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none scale-150 text-blue-600">
                                        <Sparkles className="h-64 w-64" />
                                    </div>

                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-600/20 rounded-2xl text-white">
                                                <Type className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 tracking-tight text-xl">Hero Narrative Matrix</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="h-1 w-8 bg-blue-500 rounded-full" />
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Master Brand Identity</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-5 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            High Fidelity Sync
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Floating Badge Designer */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                                <Zap className="h-3 w-3 text-blue-500" />
                                                Badge Signature
                                            </label>
                                            <div className="relative group/input">
                                                <input
                                                    type="text"
                                                    value={content.hero.badge}
                                                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                                                    className="w-full px-8 py-6 bg-gray-50/50 hover:bg-white border-2 border-transparent focus:border-blue-500/10 focus:bg-white rounded-[2rem] text-sm font-black outline-none transition-all shadow-inner"
                                                    placeholder="Pakistan's No.1..."
                                                />
                                                <div className="absolute top-1/2 -translate-y-1/2 right-6">
                                                    <div className="px-3 py-1 bg-white border border-gray-100 rounded-lg shadow-sm text-[8px] font-black text-blue-600 uppercase">Automated</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Headline Architect */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                                <Layout className="h-3 w-3 text-indigo-500" />
                                                Primary Narrative (Split Text)
                                            </label>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Top Line (Main)</span>
                                                    <input
                                                        type="text"
                                                        value={content.hero.title.split('\n')[0]}
                                                        onChange={(e) => {
                                                            const split = content.hero.title.split('\n')
                                                            split[0] = e.target.value
                                                            setContent({ ...content, hero: { ...content.hero, title: split.join('\n') } })
                                                        }}
                                                        className="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent focus:border-indigo-500/10 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all shadow-sm"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Bottom Line (Accent)</span>
                                                    <input
                                                        type="text"
                                                        value={content.hero.title.split('\n')[1] || ""}
                                                        onChange={(e) => {
                                                            const split = content.hero.title.split('\n')
                                                            split[1] = e.target.value
                                                            setContent({ ...content, hero: { ...content.hero, title: split.join('\n') } })
                                                        }}
                                                        className="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent focus:border-purple-500/10 focus:bg-white rounded-2xl text-lg font-black outline-none transition-all shadow-sm text-purple-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtext Weaver */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                                <Globe className="h-3 w-3 text-gray-900" />
                                                Supporting Narrative
                                            </label>
                                            <textarea
                                                value={content.hero.subtitle}
                                                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                                                rows={3}
                                                className="w-full px-8 py-6 bg-gray-50/50 hover:bg-white border-2 border-transparent focus:border-gray-200 focus:bg-white rounded-[2.5rem] text-sm font-medium leading-relaxed outline-none transition-all resize-none shadow-inner text-gray-500"
                                                placeholder="Explain the value proposition..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Branding Controls */}
                                <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[4rem] text-white shadow-3xl shadow-black/50 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
                                                <Sparkles className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg tracking-tight">Aesthetic Protocol</h3>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Global Design Overrides</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-8">
                                            <div className="space-y-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Visual Vibrancy</span>
                                                <div className="flex gap-2">
                                                    {['Subtle', 'Elite', 'Ultra'].map((lvl) => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setContent({ ...content, branding: { ...content.branding, vibrancy: lvl } })}
                                                            className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all duration-300 ${content.branding?.vibrancy === lvl ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                                        >
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Typography Scale</span>
                                                <div className="flex gap-2">
                                                    {['Modern', 'Bold', 'Heavy'].map((lvl) => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setContent({ ...content, branding: { ...content.branding, typography: lvl } })}
                                                            className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all duration-300 ${content.branding?.typography === lvl ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                                        >
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Neural Sync</span>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Live Active</span>
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "HEADER" && (
                            <motion.div
                                key="header"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-black text-xl tracking-tight text-gray-900">Navigation Node Designer</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo Signature</label>
                                            <input
                                                type="text"
                                                value={content.header.logoText}
                                                onChange={(e) => setContent({ ...content, header: { ...content.header, logoText: e.target.value } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Subtext Tagline</label>
                                            <input
                                                type="text"
                                                value={content.header.logoSubtext}
                                                onChange={(e) => setContent({ ...content, header: { ...content.header, logoSubtext: e.target.value } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Navigation Links</label>
                                            <button
                                                onClick={() => {
                                                    const newLinks = [...content.header.links, { label: "New Link", href: "#" }]
                                                    setContent({ ...content, header: { ...content.header, links: newLinks } })
                                                }}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Plus className="h-3 w-3" /> Add Link
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {content.header.links.map((link: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <input
                                                        className="flex-1 bg-transparent font-bold text-sm outline-none"
                                                        value={link.label}
                                                        onChange={(e) => {
                                                            const newLinks = [...content.header.links]
                                                            newLinks[idx].label = e.target.value
                                                            setContent({ ...content, header: { ...content.header, links: newLinks } })
                                                        }}
                                                    />
                                                    <input
                                                        className="flex-1 bg-transparent text-xs text-gray-400 outline-none"
                                                        value={link.href}
                                                        onChange={(e) => {
                                                            const newLinks = [...content.header.links]
                                                            newLinks[idx].href = e.target.value
                                                            setContent({ ...content, header: { ...content.header, links: newLinks } })
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newLinks = content.header.links.filter((_: any, i: number) => i !== idx)
                                                            setContent({ ...content, header: { ...content.header, links: newLinks } })
                                                        }}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "MAP" && (
                            <motion.div
                                key="map"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                            <Activity className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-black text-xl tracking-tight text-gray-900">Geographical Hub Telemetry</h3>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Operational Badge</label>
                                            <input
                                                type="text"
                                                value={content.map.badge}
                                                onChange={(e) => setContent({ ...content, map: { ...content.map, badge: e.target.value } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Telemetry Style</label>
                                            <div className="flex gap-2">
                                                {['Dark', 'Light'].map((style) => (
                                                    <button
                                                        key={style}
                                                        onClick={() => setContent({ ...content, map: { ...content.map, style } })}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${content.map.style === style ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                    >
                                                        {style}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Main Narrative</label>
                                        <textarea
                                            value={content.map.title}
                                            onChange={(e) => setContent({ ...content, map: { ...content.map, title: e.target.value } })}
                                            rows={2}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-2xl text-2xl font-black outline-none transition-all resize-none shadow-inner"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Latitude</label>
                                            <input
                                                type="number"
                                                value={content.map.lat}
                                                onChange={(e) => setContent({ ...content, map: { ...content.map, lat: parseFloat(e.target.value) } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Longitude</label>
                                            <input
                                                type="number"
                                                value={content.map.lng}
                                                onChange={(e) => setContent({ ...content, map: { ...content.map, lng: parseFloat(e.target.value) } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Proximity (Zoom)</label>
                                            <input
                                                type="number"
                                                value={content.map.zoom}
                                                onChange={(e) => setContent({ ...content, map: { ...content.map, zoom: parseInt(e.target.value) } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl text-sm font-bold outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "FOOTER" && (
                            <motion.div
                                key="footer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-slate-900 text-white rounded-2xl">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-black text-xl tracking-tight text-gray-900">Global Footer Blueprint</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Operational Tagline</label>
                                        <textarea
                                            value={content.footer.tagline}
                                            onChange={(e) => setContent({ ...content, footer: { ...content.footer, tagline: e.target.value } })}
                                            rows={2}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-2xl text-sm font-bold outline-none transition-all resize-none shadow-inner"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Node Columns</label>
                                            <button
                                                onClick={() => {
                                                    const newCols = [...content.footer.columns, { title: "New Group", links: [{ label: "Link", href: "#" }] }]
                                                    setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                }}
                                                className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Plus className="h-3 w-3" /> Append Column
                                            </button>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {content.footer.columns.map((col: any, cIdx: number) => (
                                                <div key={cIdx} className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 space-y-4 relative group/col">
                                                    <button
                                                        onClick={() => {
                                                            const newCols = content.footer.columns.filter((_: any, i: number) => i !== cIdx)
                                                            setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                        }}
                                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover/col:opacity-100 transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <input
                                                        className="w-full bg-transparent font-black text-xs uppercase tracking-widest text-slate-900 outline-none"
                                                        value={col.title}
                                                        onChange={(e) => {
                                                            const newCols = [...content.footer.columns]
                                                            newCols[cIdx].title = e.target.value
                                                            setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                        }}
                                                    />
                                                    <div className="space-y-2">
                                                        {col.links.map((link: any, lIdx: number) => (
                                                            <div key={lIdx} className="flex gap-2 items-center">
                                                                <input
                                                                    className="flex-1 bg-white px-3 py-2 rounded-lg text-[10px] font-bold outline-none border border-transparent focus:border-blue-200"
                                                                    value={link.label}
                                                                    onChange={(e) => {
                                                                        const newCols = [...content.footer.columns]
                                                                        newCols[cIdx].links[lIdx].label = e.target.value
                                                                        setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newCols = [...content.footer.columns]
                                                                        newCols[cIdx].links = col.links.filter((_: any, i: number) => i !== lIdx)
                                                                        setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                                    }}
                                                                    className="text-gray-300 hover:text-red-500"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newCols = [...content.footer.columns]
                                                                newCols[cIdx].links.push({ label: "New Link", href: "#" })
                                                                setContent({ ...content, footer: { ...content.footer, columns: newCols } })
                                                            }}
                                                            className="text-[8px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-600 transition-colors pt-2"
                                                        >
                                                            + Add Link
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Copyright Authority</label>
                                        <input
                                            type="text"
                                            value={content.footer.copyright}
                                            onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-2xl text-xs font-bold outline-none transition-all"
                                        />
                                    </div>

                                    {/* Financial Node Architect */}
                                    <div className="pt-12 border-t border-gray-100 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl shadow-black/20">
                                                    <CreditCard className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl tracking-tight text-gray-900">Financial Node Architect</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Design global payment gateway nodes</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newMethods = [...(content.footer.paymentMethods || []), { name: "New Node", cardBg: "bg-gradient-to-br from-gray-800 to-black", logoType: "TEXT", size: "M", href: "#" }]
                                                    setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                }}
                                                className="px-6 py-3 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-black/20"
                                            >
                                                <Plus className="h-3 w-3 text-blue-400" /> provision Node
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {(content.footer.paymentMethods || []).map((method: any, idx: number) => (
                                                <div key={idx} className="relative group bg-white p-6 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 transition-all hover:shadow-2xl">
                                                    <div className="flex items-start gap-8">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div
                                                                className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 transition-colors"
                                                                onDragStart={(e: any) => {
                                                                    (window as any).draggedNodeIdx = idx;
                                                                }}
                                                                onDragOver={(e: any) => e.preventDefault()}
                                                                onDrop={(e: any) => {
                                                                    const draggedIdx = (window as any).draggedNodeIdx;
                                                                    if (draggedIdx === undefined || draggedIdx === idx) return;
                                                                    const newMethods = [...content.footer.paymentMethods];
                                                                    const [draggedItem] = newMethods.splice(draggedIdx, 1);
                                                                    newMethods.splice(idx, 0, draggedItem);
                                                                    setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } });
                                                                }}
                                                                draggable
                                                            >
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>
                                                            <div className={`w-28 h-18 rounded-2xl ${method.cardBg} border border-white/10 shadow-2xl flex flex-col justify-between p-3 relative overflow-hidden`}>
                                                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
                                                                <div className="w-6 h-4 bg-gradient-to-br from-amber-200 to-amber-500 rounded-[4px] opacity-80 shadow-inner" />
                                                                <div className="self-end">
                                                                    {method.logoType === 'IMAGE' && method.logoImage ? (
                                                                        <img src={method.logoImage} alt={method.name} className="h-6 w-auto object-contain" />
                                                                    ) : (
                                                                        <div className="text-white/50 text-[8px] font-black uppercase tracking-tighter leading-none">
                                                                            {method.logoType === 'TEXT' ? (method.name || 'NN') : (method.logoType || '').replace('SVG_', '')}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="absolute bottom-2 right-2 px-1 bg-white/10 rounded text-[6px] font-black text-white/40 uppercase">{method.size || 'M'}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 grid md:grid-cols-2 gap-8">
                                                            <div className="space-y-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Gateway Identity</label>
                                                                    <input
                                                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-2xl text-sm font-black text-slate-900 outline-none transition-all shadow-inner"
                                                                        value={method.name}
                                                                        onChange={(e) => {
                                                                            const newMethods = [...content.footer.paymentMethods]
                                                                            newMethods[idx] = { ...newMethods[idx], name: e.target.value }
                                                                            setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Target Protocol (Link)</label>
                                                                    <input
                                                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-2xl text-[10px] font-mono text-slate-900 outline-none transition-all shadow-inner"
                                                                        value={method.href || ""}
                                                                        onChange={(e) => {
                                                                            const newMethods = [...content.footer.paymentMethods]
                                                                            newMethods[idx] = { ...newMethods[idx], href: e.target.value }
                                                                            setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                        }}
                                                                        placeholder="https://checkout.gateway.com/..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-6">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Node Scale</label>
                                                                        <select
                                                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-xl text-[10px] font-black text-slate-900 outline-none transition-all"
                                                                            value={method.size || "M"}
                                                                            onChange={(e) => {
                                                                                const newMethods = [...content.footer.paymentMethods]
                                                                                newMethods[idx] = { ...newMethods[idx], size: e.target.value }
                                                                                setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                            }}
                                                                        >
                                                                            <option value="S">Compact</option>
                                                                            <option value="M">Standard</option>
                                                                            <option value="L">Expanded</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Visual Signature</label>
                                                                        <select
                                                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-xl text-[10px] font-black text-slate-900 outline-none transition-all"
                                                                            value={method.logoType}
                                                                            onChange={(e) => {
                                                                                const newMethods = [...content.footer.paymentMethods]
                                                                                newMethods[idx] = { ...newMethods[idx], logoType: e.target.value }
                                                                                setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                            }}
                                                                        >
                                                                            <option value="SVG_VISA">Visa Mesh</option>
                                                                            <option value="SVG_MASTERCARD">Master Pulse</option>
                                                                            <option value="SVG_JAZZCASH">Jazz Node</option>
                                                                            <option value="SVG_EASYPAISA">Easy Mesh</option>
                                                                            <option value="TEXT">Literal Type</option>
                                                                            <option value="IMAGE">Custom Image</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Chromatic Engine (CSS)</label>
                                                                    <input
                                                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-slate-900/10 rounded-2xl text-[10px] font-mono text-slate-900 outline-none transition-all shadow-inner"
                                                                        value={method.cardBg || ""}
                                                                        onChange={(e) => {
                                                                            const newMethods = [...content.footer.paymentMethods]
                                                                            newMethods[idx] = { ...newMethods[idx], cardBg: e.target.value }
                                                                            setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                        }}
                                                                    />
                                                                </div>

                                                                {method.logoType === 'IMAGE' && (
                                                                    <div className="space-y-2">
                                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo Image (URL or Upload)</label>
                                                                        {method.logoImage ? (
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="flex-1 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center p-2 overflow-hidden">
                                                                                    <img src={method.logoImage} alt="Logo preview" className="h-full w-auto object-contain" />
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const newMethods = [...content.footer.paymentMethods]
                                                                                        newMethods[idx] = { ...newMethods[idx], logoImage: '' }
                                                                                        setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                                    }}
                                                                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-3">
                                                                                <input
                                                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-200 rounded-2xl text-[10px] font-mono text-slate-900 outline-none transition-all shadow-inner"
                                                                                    placeholder="https://example.com/logo.png"
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter') {
                                                                                            const val = (e.target as HTMLInputElement).value.trim()
                                                                                            if (val) {
                                                                                                const newMethods = [...content.footer.paymentMethods]
                                                                                                newMethods[idx] = { ...newMethods[idx], logoImage: val }
                                                                                                setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    onBlur={(e) => {
                                                                                        const val = e.target.value.trim()
                                                                                        if (val) {
                                                                                            const newMethods = [...content.footer.paymentMethods]
                                                                                            newMethods[idx] = { ...newMethods[idx], logoImage: val }
                                                                                            setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="flex-1 h-px bg-gray-200" />
                                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">or upload file</span>
                                                                                    <div className="flex-1 h-px bg-gray-200" />
                                                                                </div>
                                                                                <label className="flex flex-col items-center justify-center w-full h-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all group">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Browse Files</span>
                                                                                    </div>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        className="hidden"
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0]
                                                                                            if (!file) return
                                                                                            const reader = new FileReader()
                                                                                            reader.onload = (ev) => {
                                                                                                const newMethods = [...content.footer.paymentMethods]
                                                                                                newMethods[idx] = { ...newMethods[idx], logoImage: ev.target?.result as string }
                                                                                                setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                                            }
                                                                                            reader.readAsDataURL(file)
                                                                                        }}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end pt-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newMethods = content.footer.paymentMethods.filter((_: any, i: number) => i !== idx)
                                                                            setContent({ ...content, footer: { ...content.footer, paymentMethods: newMethods } })
                                                                        }}
                                                                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" /> Decommission Node
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "FEATURES" && (
                            <motion.div
                                key="features"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl tracking-tight text-gray-900">Capability Matrix Designer</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Architect global feature nodes</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newFeatures = [...content.features, { title: "New Capability", desc: "Brief operational protocol", icon: "Zap", color: "from-blue-500 to-indigo-600" }]
                                            setContent({ ...content, features: newFeatures })
                                        }}
                                        className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-100"
                                    >
                                        <Plus className="h-3 w-3" /> Append Matrix Node
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {content.features.map((feature: any, index: number) => (
                                        <div key={index} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 group relative transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                                            <div className="flex items-start gap-8">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 transition-colors">
                                                        <GripVertical className="h-5 w-5" />
                                                    </div>
                                                    <div className={`p-4 bg-gradient-to-br ${feature.color} text-white rounded-[1.5rem] shadow-lg`}>
                                                        <Sparkles className="h-5 w-5" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Operational Title</label>
                                                            <input
                                                                type="text"
                                                                value={feature.title}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...content.features]
                                                                    newFeatures[index].title = e.target.value
                                                                    setContent({ ...content, features: newFeatures })
                                                                }}
                                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-lg font-black outline-none transition-all shadow-inner"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Protocol Narrative</label>
                                                            <textarea
                                                                value={feature.desc}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...content.features]
                                                                    newFeatures[index].desc = e.target.value
                                                                    setContent({ ...content, features: newFeatures })
                                                                }}
                                                                rows={2}
                                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-sm font-bold outline-none transition-all resize-none shadow-inner"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Visual Icon Signature</label>
                                                            <select
                                                                value={feature.icon}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...content.features]
                                                                    newFeatures[index].icon = e.target.value
                                                                    setContent({ ...content, features: newFeatures })
                                                                }}
                                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-xs font-bold outline-none transition-all shadow-inner"
                                                            >
                                                                <option value="ShoppingCart">Global Commerce</option>
                                                                <option value="Package">Smart Inventory</option>
                                                                <option value="PieChart">Neural Analytics</option>
                                                                <option value="Users">Multi-Tenant</option>
                                                                <option value="Globe">Regional Mesh</option>
                                                                <option value="Shield">Edge Security</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Color Resonance</label>
                                                            <input
                                                                type="text"
                                                                value={feature.color}
                                                                onChange={(e) => {
                                                                    const newFeatures = [...content.features]
                                                                    newFeatures[index].color = e.target.value
                                                                    setContent({ ...content, features: newFeatures })
                                                                }}
                                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/10 rounded-2xl text-[10px] font-mono outline-none transition-all shadow-inner"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end pt-4">
                                                            <button
                                                                onClick={() => {
                                                                    const newFeatures = content.features.filter((_: any, i: number) => i !== index)
                                                                    setContent({ ...content, features: newFeatures })
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                                            >
                                                                <Trash2 className="h-4 w-4" /> Deconstruct Node
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "ENTERPRISE" && (
                            <motion.div
                                key="enterprise"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl tracking-tight text-gray-900">Corporate Command Architect</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orchestrate mission-critical infrastructure</p>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                        <ShieldCheck className="h-32 w-32" />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Operational Badge</label>
                                            <input
                                                type="text"
                                                value={content.enterprise.badge}
                                                onChange={(e) => setContent({ ...content, enterprise: { ...content.enterprise, badge: e.target.value } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-2xl text-sm font-black outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Deployment CTA</label>
                                            <input
                                                type="text"
                                                value={content.enterprise.cta}
                                                onChange={(e) => setContent({ ...content, enterprise: { ...content.enterprise, cta: e.target.value } })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-2xl text-sm font-black outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Headquarters Narrative Pitch</label>
                                        <textarea
                                            value={content.enterprise.title}
                                            onChange={(e) => setContent({ ...content, enterprise: { ...content.enterprise, title: e.target.value } })}
                                            rows={2}
                                            className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-[2rem] text-3xl font-black outline-none transition-all resize-none shadow-inner leading-tight text-slate-800"
                                            placeholder="Karachi Command Center."
                                        />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mt-2">Split the headline with a newline for the emerald highlight.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Strategy Subheading</label>
                                        <textarea
                                            value={content.enterprise.subtitle}
                                            onChange={(e) => setContent({ ...content, enterprise: { ...content.enterprise, subtitle: e.target.value } })}
                                            rows={2}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/10 rounded-2xl text-sm font-bold outline-none transition-all resize-none shadow-inner text-slate-500"
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-gray-50">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Mission-Critical Protocols</label>
                                        <div className="space-y-3">
                                            {content.enterprise.features.map((item: any, idx: number) => (
                                                <div key={idx} className="p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                                                        <input
                                                            className="bg-transparent font-black text-sm outline-none text-slate-700"
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const newFeat = [...content.enterprise.features]
                                                                newFeat[idx].title = e.target.value
                                                                setContent({ ...content, enterprise: { ...content.enterprise, features: newFeat } })
                                                            }}
                                                        />
                                                        <input
                                                            className="bg-transparent font-medium text-xs opacity-60 outline-none text-slate-500"
                                                            value={item.desc}
                                                            onChange={(e) => {
                                                                const newFeat = [...content.enterprise.features]
                                                                newFeat[idx].desc = e.target.value
                                                                setContent({ ...content, enterprise: { ...content.enterprise, features: newFeat } })
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === "MEDIA" && (
                            <motion.div
                                key="media"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-500/20">
                                        <Image className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl tracking-tight text-gray-900">High-Fidelity Media Asset Protocol</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global visual distribution hub</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Image Assets */}
                                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Image className="h-3 w-3" /> Static Visual Nodes
                                            </h4>
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Hero Main Visual", url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000" },
                                                { label: "Enterprise Engine Illustration", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000" },
                                                { label: "Capabilities Schematic", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000" }
                                            ].map((img, i) => (
                                                <div key={i} className="group relative">
                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-500/20 hover:bg-white transition-all">
                                                        <div className="h-16 w-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                                                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{img.label}</p>
                                                            <input
                                                                type="text"
                                                                value={img.url}
                                                                className="w-full bg-transparent text-xs font-mono truncate outline-none text-slate-500"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Video Assets */}
                                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Zap className="h-3 w-3" /> Dynamic Stream Nodes
                                            </h4>
                                            <button className="p-2 text-violet-500 hover:bg-violet-50 rounded-lg transition-all">
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: "System Core Demo", url: "https://vimeo.com/12345678" }
                                            ].map((vid, i) => (
                                                <div key={i} className="group relative">
                                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-violet-500/20 hover:bg-white transition-all">
                                                        <div className="h-16 w-16 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                                            <Zap className="h-8 w-8 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{vid.label}</p>
                                                            <input
                                                                type="text"
                                                                value={vid.url}
                                                                className="w-full bg-transparent text-xs font-mono truncate outline-none text-slate-500"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 bg-violet-50 rounded-[2rem] border border-violet-100 text-center">
                                            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest leading-loose">
                                                High-Fidelity streaming protocols are synchronized across all regional edge nodes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Full Page Live Preview */}
                <div className="xl:flex-1 min-w-[400px]">
                    <div className="sticky top-10 space-y-6">
                        <div className={`
                            bg-gray-900 shadow-[0_80px_100px_rgba(0,0,0,0.3)] relative overflow-hidden h-[800px] flex flex-col transition-all duration-500 ease-in-out
                            ${previewMode === "MOBILE"
                                ? "max-w-[380px] mx-auto rounded-[3.5rem] border-8 border-gray-800 p-2"
                                : "w-full rounded-[2rem] border-4 border-gray-800 p-1"}
                        `}>
                            {/* Device Controls */}
                            <div className="bg-gray-800 px-6 py-3 flex items-center justify-between rounded-t-[2.2rem]">
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 bg-red-400 rounded-full" />
                                    <div className="h-2 w-2 bg-amber-400 rounded-full" />
                                    <div className="h-2 w-2 bg-emerald-400 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPreviewMode("MOBILE")}
                                        className={`p-1.5 ${previewMode === "MOBILE" ? "text-blue-400" : "text-gray-400"} hover:bg-gray-700 rounded-lg transition-all`}
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </button>
                                    <div className="h-4 w-px bg-gray-700" />
                                    <button
                                        onClick={() => setPreviewMode("DESKTOP")}
                                        className={`p-1.5 ${previewMode === "DESKTOP" ? "text-blue-400" : "text-gray-400"} hover:bg-gray-700 rounded-lg transition-all`}
                                    >
                                        <Globe className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* The Iframe Preview */}
                            <div className={`flex-1 bg-white overflow-hidden ${previewMode === "MOBILE" ? "rounded-b-[2.2rem]" : "rounded-b-[1.5rem]"}`}>
                                <iframe
                                    id="full-page-preview"
                                    src="/preview"
                                    className="w-full h-full border-none"
                                    title="Full Page Preview"
                                    onLoad={handleIframeLoad}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                />
                            </div>

                            {/* Floating Sync Badge */}
                            <div className="absolute bottom-10 left-10 right-10 flex justify-center pointer-events-none">
                                <div className="px-6 py-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-3">
                                    <Activity className="h-3 w-3 text-blue-400 animate-pulse" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Neural Sync Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 backdrop-blur-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-600 text-white rounded-2xl flex-shrink-0">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Live Mirror</h4>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">ap-southeast-1</p>
                                </div>
                            </div>
                            <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100/50 backdrop-blur-sm flex items-center gap-4">
                                <div className="p-3 bg-purple-600 text-white rounded-2xl flex-shrink-0">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Optimization</h4>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">Active Engine</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
