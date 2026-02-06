"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Shield, ShoppingCart, CheckCircle,
  Building, User, Users, ArrowRight, Sparkles,
  Zap, Globe, Lock, CreditCard,
  TrendingUp, BarChart, Smartphone,
  Layers, Cpu, Activity, Database,
  Package, PieChart, Clock, Menu, X,
  Github, Twitter, Linkedin
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isMounted) return null

  const MotionDiv = motion.div as any
  const MotionButton = motion.button as any

  const navLinks = [
    { name: "Capabilities", href: "#features" },
    { name: "Global Mesh", href: "#mesh" },
    { name: "Intelligence", href: "#stats" },
    { name: "Enterprise", href: "/login" },
  ]

  const features = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Dynamic POS Engine",
      desc: "Zero-latency transaction processing with offline resilience and multi-terminal sync.",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Intelligent Inventory",
      desc: "Neural-driven stock monitoring with automated reordering and predictive analytics.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Growth Intelligence",
      desc: "Real-time visual reports and AI-powered business insights for rapid scaling.",
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Staff Optimization",
      desc: "Advanced shift management, performance tracking, and granular access control.",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Regional Mesh",
      desc: "Distributed database architecture ensuring speed and data integrity anywhere.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Hardened Security",
      desc: "Bank-grade encryption with multi-factor authentication and audit logging.",
      color: "from-indigo-500 to-cyan-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/10 selection:text-sky-600 overflow-x-hidden">

      {/* Floating Header */}
      <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <nav className="container mx-auto px-6">
          <div className={`p-4 md:px-8 rounded-[2rem] transition-all duration-500 flex items-center justify-between ${scrolled ? 'bg-white/80 backdrop-blur-2xl border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-2.5 bg-sky-500 text-white rounded-2xl shadow-lg shadow-sky-500/20">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">HybridPOS</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Enterprise Unified</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-sky-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all items-center"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </MotionButton>
              </Link>
              <button
                className="lg:hidden p-3 bg-slate-50 text-slate-900 rounded-2xl border border-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-100/50 blur-[120px] rounded-full"
          />
          <MotionDiv
            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv
            style={{ opacity, scale }}
            className="space-y-12 max-w-5xl mx-auto"
          >
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 shadow-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Next Generation Retail Mesh</span>
            </MotionDiv>

            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-slate-900">
              Retail <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600">Perfected.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              The high-fidelity ecosystem for professional commerce.
              Real-time synchronization, neural inventory, and zero-latency performance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link href="/login">
                <MotionButton
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center group shadow-2xl shadow-slate-900/20"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                </MotionButton>
              </Link>
              <Link href="/login">
                <MotionButton
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center shadow-xl shadow-slate-200/50 hover:border-sky-200 transition-all"
                >
                  View Live Demo
                </MotionButton>
              </Link>
            </div>
          </MotionDiv>

          {/* Floating UI Elements */}
          <div className="mt-40 grid lg:grid-cols-3 gap-8 relative max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[3rem] text-left border-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="h-20 w-20 text-sky-500" />
              </div>
              <div className="p-4 bg-sky-50 text-sky-500 rounded-2xl w-fit mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2 text-slate-900">Live Pulse</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Real-time telemetry of your entire retail network.</p>
              <div className="mt-8 flex items-center space-x-3">
                <div className="h-1.5 w-12 bg-sky-500 rounded-full" />
                <div className="h-1.5 w-4 bg-slate-100 rounded-full" />
                <div className="h-1.5 w-4 bg-slate-100 rounded-full" />
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-12 lg:-mt-20 rounded-[4rem] text-center border-white relative overflow-hidden group shadow-[0_48px_120px_rgba(0,0,0,0.08)]"
            >
              <div className="relative mb-10 inline-block">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-[2.5rem] shadow-2xl">
                  <Database className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-4xl font-black tracking-tighter mb-4 text-slate-900">99.99% Uptime</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">Architected for mission-critical retail environments.</p>
              <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">1.2ms</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Delay</div>
                </div>
                <div className="text-right text-emerald-500">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[3rem] text-left border-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-indigo-500">
                <Layers className="h-20 w-20" />
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl w-fit mb-6">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2 text-slate-900">Infinite Scaling</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Expand your empire from one store to thousands effortlessly.</p>
              <div className="mt-8 flex items-center space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <User className="h-3 w-3 text-slate-300" />
                  </div>
                ))}
                <div className="h-8 w-8 rounded-full bg-sky-50 flex items-center justify-center text-[8px] font-black text-sky-500">
                  +124
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-32 space-y-6">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm"
            >
              <Cpu className="h-4 w-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Engineered Core</span>
            </MotionDiv>
            <h2 className="text-6xl font-black tracking-tighter text-slate-900">
              Built for <span className="text-sky-500">Retail Masters</span>.
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Every detail optimized for high-throughput commercial environments.
              Powering the future of brick-and-mortar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-500/5 transition-all group"
              >
                <div className={`p-4 bg-gradient-to-br ${feature.color} text-white rounded-2xl w-fit mb-8 shadow-lg shadow-sky-500/10`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-4 text-slate-900 group-hover:text-sky-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Global Mesh Section */}
      <section id="mesh" className="py-40 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="p-4 bg-sky-50 text-sky-500 rounded-3xl w-fit shadow-sm">
                <Globe className="h-8 w-8" />
              </div>
              <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Regional <br />
                Multi-Node <br />
                <span className="text-sky-500">Sync Grid</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                Our distributed mesh network ensures your data is synchronized across all branches with zero latency.
                Even if the cloud goes dark, your stores keep running.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {["P2P Protocol", "Encrypted Tunnel", "Instant Relay", "Node Resilience"].map((tag, i) => (
                  <span key={i} className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </MotionDiv>
          </div>

          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-500/5 blur-[120px] rounded-full scale-150"></div>
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative w-full max-w-[500px] h-full max-h-[500px] border-2 border-dashed border-slate-100 rounded-full flex items-center justify-center p-12"
            >
              <div className="relative w-full h-full rounded-full border border-slate-100 flex items-center justify-center">
                <MotionDiv
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-40 h-40 bg-white shadow-2xl rounded-[3rem] border border-slate-50 flex items-center justify-center relative z-20 group"
                >
                  <div className="absolute inset-0 bg-sky-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <ShoppingCart className="h-16 w-16 text-sky-500 transition-transform group-hover:scale-110" />
                </MotionDiv>

                {/* Floating Orbitals */}
                {[...Array(6)].map((_, i) => (
                  <MotionDiv
                    key={i}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 60}deg) translate(220px) rotate(-${i * 60}deg)`
                    }}
                    className="mt-[-20px] ml-[-20px]"
                  >
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-lg flex items-center justify-center">
                      <Database className="h-4 w-4 text-slate-300" />
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section id="stats" className="py-40 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-16 text-center">
            {[
              { value: "480K+", label: "Active Nodes", icon: <Layers className="h-6 w-6" /> },
              { value: "1.2B+", label: "Transactions", icon: < Zap className="h-6 w-6" /> },
              { value: "100%", label: "Data Integrity", icon: <Shield className="h-6 w-6" /> },
              { value: "<1ms", label: "Neural Delay", icon: <Cpu className="h-6 w-6" /> }
            ].map((stat, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 text-sky-400 mx-auto">
                  {stat.icon}
                </div>
                <div className="text-6xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{stat.label}</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 relative overflow-hidden bg-white text-center px-6">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-sky-500/10 blur-[150px] rounded-full"></div>
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85]">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Enterprise.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Ready to upgrade your operational matrix?
            Join the elite retail networks.
          </p>
          <Link href="/login">
            <MotionButton
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-16 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/30 group inline-flex items-center"
            >
              Deploy Now
              <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-3 transition-transform" />
            </MotionButton>
          </Link>
        </MotionDiv>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 items-start mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-500/10">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-lg font-black tracking-tighter text-slate-900">HybridPOS</span>
              </Link>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                The ultimate retail ecosystem.
                Synchronized, secure, and scalable.
              </p>
              <div className="flex items-center space-x-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="p-2 text-slate-400 hover:text-sky-500 transition-colors">
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                {["POS Core", "Inventory Mesh", "Analytics", "Mobile App"].map((item, i) => (
                  <li key={i}><Link href="#" className="text-sm text-slate-400 font-medium hover:text-sky-500 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Network</h4>
              <ul className="space-y-4">
                {["Regional Nodes", "Uptime Map", "Dev API", "Partners"].map((item, i) => (
                  <li key={i}><Link href="#" className="text-sm text-slate-400 font-medium hover:text-sky-500 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                {["Privacy", "Terms", "SLA", "Security"].map((item, i) => (
                  <li key={i}><Link href="#" className="text-sm text-slate-400 font-medium hover:text-sky-500 transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              &copy; {new Date().getFullYear()} Hybrid Retail Systems Ltd.
            </p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">All Nodes Active</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[150] bg-white p-6 flex flex-col items-center justify-center space-y-12"
          >
            <button
              className="absolute top-10 right-10 p-4 bg-slate-100 rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-black tracking-tighter text-slate-900 hover:text-sky-500"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <MotionButton
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl"
              >
                Launch Dashboard
              </MotionButton>
            </Link>
          </MotionDiv>
        )}
      </AnimatePresence>

    </div>
  )
}