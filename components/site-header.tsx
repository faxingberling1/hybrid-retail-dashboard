"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Store, Moon, Sun, Smartphone, ArrowRight, Menu, X } from "lucide-react"
import { useTheme } from "@/app/providers"

export function SiteHeader({ cms }: { cms?: any }) {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const header = cms || {
        logoText: "HybridPOS",
        logoSubtext: "Enterprise Unified",
        links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Blog", href: "/blog" }
        ],
        ctaText: "Login",
        ctaHref: "/login"
    }

    useEffect(() => {
        setIsMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const MotionButton = motion.button as any
    const isDark = resolvedTheme === 'dark'

    return (
        <>
            <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
                <nav className="container mx-auto px-6">
                    <div className={`p-4 md:px-8 rounded-[2rem] transition-all duration-500 flex items-center justify-between ${scrolled ? (isDark ? 'bg-black/60 backdrop-blur-2xl border border-white/10' : 'bg-white/80 backdrop-blur-2xl border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)]') : 'bg-transparent'}`}>
                        <Link href="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
                            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className={`text-xl font-black tracking-tighter block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{header.logoText}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{header.logoSubtext}</span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-12">
                            {header.links.map((link: any, idx: number) => (
                                <Link key={idx} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-sky-500 transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Theme Switcher */}
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-xl border-2 transition-all ${isDark ? 'bg-white/5 border-white/20 text-violet-400 hover:border-violet-400' : 'bg-slate-50 border-slate-200 text-amber-500 hover:border-amber-500'}`}
                            >
                                {isMounted && (isDark ? <Moon className="h-5 w-5 fill-current" /> : <Sun className="h-5 w-5 fill-current" />)}
                            </button>

                            <div className="flex items-center gap-3">
                                <Link href="/call-us" className="hidden lg:flex px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    <span>Call Us</span>
                                </Link>

                                <Link href={header.ctaHref}>
                                    <MotionButton
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`hidden md:flex px-6 py-2.5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all items-center ${isDark ? 'bg-violet-600 shadow-violet-600/20 hover:bg-violet-500' : 'bg-slate-900 shadow-slate-900/10 hover:bg-slate-800'}`}
                                    >
                                        {header.ctaText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </MotionButton>
                                </Link>
                            </div>

                            <button
                                className={`lg:hidden p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 text-slate-900 border-slate-100'}`}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className={`fixed inset-0 z-[150] p-6 flex flex-col items-center justify-center space-y-12 ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}
                    >
                        <button
                            className={`absolute top-10 right-10 p-4 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        {header.links.map((link: any, idx: number) => (
                            <Link
                                key={idx}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-sky-500 ${isDark ? 'text-white' : 'text-slate-900'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                            <MotionButton
                                whileTap={{ scale: 0.95 }}
                                className={`px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl ${isDark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
                            >
                                Get Started
                            </MotionButton>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
