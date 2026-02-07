"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Store, Moon, Sun, Smartphone, ArrowRight, Menu, X } from "lucide-react"
import { useTheme } from "@/app/providers"

export function SiteHeader() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [isMounted, setIsMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                                <span className={`text-xl font-black tracking-tighter block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>HybridPOS</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Enterprise Unified</span>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-12">
                            <Link href="/features" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-sky-500 transition-colors">Features</Link>
                            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-sky-500 transition-colors">Pricing</Link>

                            {/* Resources Dropdown */}
                            <div className="relative group">
                                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-sky-500 transition-colors flex items-center">
                                    Resources
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2`}>
                                    <div className={`p-4 rounded-2xl shadow-xl w-48 border flex flex-col gap-2 ${isDark ? 'bg-black/90 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-100'}`}>
                                        <Link href="/blog" className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-sky-500'}`}>Blog</Link>
                                        <Link href="/knowledge-base" className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-sky-500'}`}>Knowledge Base</Link>
                                        <Link href="/feedback" className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-sky-500'}`}>Request Feature</Link>
                                    </div>
                                </div>
                            </div>
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
                                <Link href="/login" className="hidden lg:flex px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    <span>Call Us</span>
                                </Link>

                                <Link href="/login">
                                    <MotionButton
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`hidden md:flex px-6 py-2.5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all items-center ${isDark ? 'bg-violet-600 shadow-violet-600/20 hover:bg-violet-500' : 'bg-slate-900 shadow-slate-900/10 hover:bg-slate-800'}`}
                                    >
                                        Login
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
                        {[{ n: 'Features', l: '/features' }, { n: 'Pricing', l: '/pricing' }, { n: 'Blog', l: '/blog' }, { n: 'Knowledge', l: '/knowledge-base' }, { n: 'Login', l: '/login' }].map((link) => (
                            <Link
                                key={link.n}
                                href={link.l}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-sky-500 ${isDark ? 'text-white' : 'text-slate-900'}`}
                            >
                                {link.n}
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
