"use client"

import Link from "next/link"
import { Store } from "lucide-react"
import { useTheme } from "@/app/providers"
import { useEffect, useState } from "react"

export function SiteFooter({ cms }: { cms?: any }) {
    const { resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)

    const footer = cms || {
        tagline: "The ultimate retail ecosystem. Synchronized, secure, and scalable.",
        columns: [
            {
                title: "Ecosystem",
                links: [
                    { label: "POS Core", href: "#" },
                    { label: "Inventory Mesh", href: "#" },
                    { label: "Documentation", href: "/docs" },
                    { label: "Knowledge Base", href: "/knowledge-base" }
                ]
            },
            {
                title: "Network",
                links: [
                    { label: "Regional Nodes", href: "#" },
                    { label: "Uptime Map", href: "#" },
                    { label: "Dev API", href: "#" },
                    { label: "Partners", href: "#" }
                ]
            },
            {
                title: "Legal",
                links: [
                    { label: "Privacy", href: "/compliance" },
                    { label: "Terms", href: "/compliance" },
                    { label: "SLA", href: "/compliance" },
                    { label: "Security", href: "/compliance" }
                ]
            }
        ],
        copyright: "Hybrid Retail Systems Ltd."
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const isDark = resolvedTheme === 'dark'

    if (!isMounted) return null

    return (
        <footer className={`py-20 border-t ${isDark ? 'bg-[#020412] border-white/10' : 'bg-white border-slate-100'}`}>
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 items-start mb-20">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-lg font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>HybridPOS</span>
                        </Link>
                        <p className={`text-sm font-bold leading-relaxed max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-900'}`}>
                            {footer.tagline}
                        </p>
                    </div>

                    {footer.columns.map((column: any, idx: number) => (
                        <div key={idx}>
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link: any, lIdx: number) => (
                                    <li key={lIdx}>
                                        <Link href={link.href} className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-900 hover:text-blue-600'}`}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-slate-100/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        &copy; {new Date().getFullYear()} {footer.copyright}
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-3">
                            {(footer.paymentMethods || [
                                { name: "Visa", cardBg: "bg-gradient-to-br from-[#1a1f71] to-[#01144c]", logoType: "SVG_VISA", size: "M" },
                                { name: "Mastercard", cardBg: "bg-gradient-to-br from-[#222] to-[#444]", logoType: "SVG_MASTERCARD", size: "M" }
                            ]).map((p: any, i: number) => {
                                const sizeClasses = p.size === 'S' ? 'w-20 h-14' : p.size === 'L' ? 'w-36 h-24' : 'w-28 h-18';
                                const CardContent = (
                                    <div className={`relative ${sizeClasses} ${p.cardBg} rounded-xl shadow-2xl border border-white/10 flex flex-col justify-between p-3 group hover:scale-110 transition-all duration-300 overflow-hidden`}>
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none"></div>
                                        <div className="w-6 h-4 bg-gradient-to-br from-amber-200 to-amber-500 rounded-[4px] opacity-80 shadow-inner" />
                                        <div className="self-end flex items-end justify-end">
                                            {p.logoType === 'IMAGE' && p.logoImage ? (
                                                <img
                                                    src={p.logoImage}
                                                    alt={p.name}
                                                    className="h-6 w-auto max-w-[60px] object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                                                />
                                            ) : p.logoType === 'SVG_VISA' ? (
                                                <svg viewBox="0 0 24 24" className="h-4 fill-white"><path d="M13.9 15.2l.9-5.7h1.5l-.9 5.7h-1.5zm6.5-5.6l-1.3 5.6h-1.4l.8-3.4-.9-2.2h1.6l.4 1.1.2.7.1-.7.4-1.1h1.5zm-3.6 3.9l.1-.9.6-3h1.5l-1.2 5.6h-1.4l.4-1.7zm-9.3-3.9h1.7l1.1 3.7.2.9.2-.9 1.1-3.7h1.6L11 15.2h-1.6l-1.9-5.6z" /></svg>
                                            ) : p.logoType === 'SVG_MASTERCARD' ? (
                                                <svg viewBox="0 0 24 24" className="h-6"><circle cx="9" cy="12" r="5" fill="#eb001b" opacity="0.9" /><circle cx="15" cy="12" r="5" fill="#f79e1b" opacity="0.9" /></svg>
                                            ) : p.logoType === 'SVG_JAZZCASH' ? (
                                                <div className="text-[10px] font-black text-white italic tracking-tighter">JazzCash</div>
                                            ) : p.logoType === 'SVG_EASYPAISA' ? (
                                                <div className="text-[10px] font-black text-white tracking-widest leading-none">easy<br />paisa</div>
                                            ) : (
                                                <div className="text-[10px] font-black text-white uppercase opacity-50">{p.name || ''}</div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                    </div>
                                );

                                if (p.href && p.href !== "#" && p.href.trim() !== "") {
                                    return (
                                        <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="block">
                                            {CardContent}
                                        </a>
                                    );
                                }

                                return <div key={i}>{CardContent}</div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
