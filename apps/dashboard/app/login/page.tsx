"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Shield, ShoppingCart, CheckCircle,
  Building, User, ArrowRight, Sparkles,
  PlusCircle, Users, Zap,
  Briefcase, Palette, Globe, Lock,
  CreditCard, Settings, Bell, Star,
  TrendingUp, BarChart, Smartphone,
  Calendar, Target, ShieldCheck,
  Hammer, Timer, AlertTriangle,
  Layers, Cpu, Activity, Moon, Sun, Rocket,
  Search, Package, PieChart, Clock, Database
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  // Type workaround for framer-motion issues
  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ADMIN" | "USER" | "NEW_ACCOUNT">("NEW_ACCOUNT")
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [theme, setTheme] = useState<"playful" | "galactic">("playful")
  const [maintenance, setMaintenance] = useState<{ active: boolean, endAt: string | null, startAt: string | null }>({ active: false, endAt: null, startAt: null })
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)

    const checkMaintenance = () => {
      fetch('/api/system/settings')
        .then(res => res.json())
        .then(data => {
          setMaintenance({
            active: data.maintenanceMode,
            endAt: data.maintenanceEndAt,
            startAt: data.maintenanceStartAt
          })
        })
        .catch(err => console.error('Failed to update system sync:', err))
    }

    checkMaintenance()
    const interval = setInterval(checkMaintenance, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!maintenance.active || !maintenance.endAt) {
      setTimeLeft("")
      setProgress(0)
      return
    }

    const calculateTime = () => {
      const end = new Date(maintenance.endAt!).getTime()
      const start = maintenance.startAt ? new Date(maintenance.startAt).getTime() : Date.now()
      const now = new Date().getTime()
      const diff = end - now
      const totalDuration = end - start

      // Calculate progress
      let newProgress = 0
      if (totalDuration > 0) {
        const elapsed = now - start
        newProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
      }
      setProgress(newProgress)

      if (diff <= 0) {
        setTimeLeft("Ready shortly")
        setProgress(100)
        return
      }

      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${mins}m ${secs}s`)
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [maintenance])

  const demoCredentials = {
    SUPER_ADMIN: {
      email: "superadmin@hybridpos.pk",
      password: "demo123",
      name: "Super Admin",
      icon: <Shield className="h-6 w-6" />,
      playful: {
        bg: "bg-violet-50",
        accent: "text-violet-600",
        border: "border-violet-200"
      },
      galactic: {
        bg: "bg-violet-500/10",
        accent: "text-violet-400",
        border: "border-violet-500/30"
      },
      features: ["Global Protocol", "Organization Hub", "Member Control", "System Core"]
    },
    ADMIN: {
      email: "admin@hybridpos.pk",
      password: "demo123",
      name: "Store Admin",
      icon: <Building className="h-6 w-6" />,
      playful: {
        bg: "bg-sky-50",
        accent: "text-sky-600",
        border: "border-sky-200"
      },
      galactic: {
        bg: "bg-sky-500/10",
        accent: "text-sky-400",
        border: "border-sky-500/30"
      },
      features: ["Store Matrix", "Stock Engine", "Team Sync", "Profit Stream"]
    },
    USER: {
      email: "user@hybridpos.pk",
      password: "demo123",
      name: "Staff User",
      icon: <User className="h-6 w-6" />,
      playful: {
        bg: "bg-emerald-50",
        accent: "text-emerald-600",
        border: "border-emerald-200"
      },
      galactic: {
        bg: "bg-emerald-500/10",
        accent: "text-emerald-400",
        border: "border-emerald-500/30"
      },
      features: ["POS Interface", "Stock Audit", "Customer Desk", "Daily Pulse"]
    },
    NEW_ACCOUNT: {
      email: "",
      password: "",
      name: "Create New Account",
      icon: <PlusCircle className="h-6 w-6" />,
      playful: {
        bg: "bg-rose-50",
        accent: "text-rose-600",
        border: "border-rose-200"
      },
      galactic: {
        bg: "bg-rose-500/10",
        accent: "text-rose-400",
        border: "border-rose-500/30"
      },
      features: ["Quick Setup", "Business Info", "Admin Profile", "Team Access"]
    }
  }

  const handleLogin = async (role: "SUPER_ADMIN" | "ADMIN" | "USER" | "NEW_ACCOUNT") => {
    if (role === "NEW_ACCOUNT") {
      router.push("/auth/signup")
      return
    }

    setIsLoading(true)
    setSelectedRole(role)
    setShowDemoInfo(true)
    setError(null)

    const credentials = demoCredentials[role]
    const redirectMap = {
      SUPER_ADMIN: "/super-admin",
      ADMIN: "/admin",
      USER: "/user/inventory",
      NEW_ACCOUNT: "/auth/signup"
    }

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl: redirectMap[role]
      })

      if (result?.error) {
        setError(`Connection Refused: ${result.error}`)
      } else if (result?.ok && !result.error) {
        setTimeout(() => {
          window.location.href = redirectMap[role]
        }, 600)
      }
    } catch (err: any) {
      setError(`Stream Interrupted: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <MotionDiv
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-12 h-12 border-4 border-slate-100 border-t-sky-500 rounded-full"
          />
          <p className="mt-6 text-slate-400 font-bold tracking-[0.2em] uppercase text-[10px]">Preparing Workspace</p>
        </div>
      </div>
    )
  }

  const isGalactic = theme === "galactic"

  const features = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Dynamic POS",
      desc: "High-speed checkout with multi-payment engine and offline capability.",
      color: "sky"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Intelligent Inventory",
      desc: "Real-time tracking with predictive stock alerts and automated reordering.",
      color: "emerald"
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Growth Analytics",
      desc: "AI-powered insights and deep-dive reporting for professional expansion.",
      color: "violet"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Pulse",
      desc: "Advanced staff optimization, shift management, and performance metrics.",
      color: "rose"
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-1000 selection:bg-sky-500/20 overflow-hidden relative font-sans antialiased ${isGalactic ? 'bg-[#020412] text-white' : 'bg-white text-slate-900'}`}>

      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {isGalactic ? (
            <MotionDiv
              key="galactic-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MotionDiv
                animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/20 blur-[130px] rounded-full"
              />
              <MotionDiv
                animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }}
                transition={{ duration: 30, repeat: Infinity }}
                className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 blur-[130px] rounded-full"
              />
              <MotionDiv
                animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -60, 0] }}
                transition={{ duration: 22, repeat: Infinity }}
                className="absolute bottom-0 right-[20%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[130px] rounded-full"
              />
              {[...Array(20)].map((_, i) => (
                <MotionDiv
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                />
              ))}
            </MotionDiv>
          ) : (
            <MotionDiv
              key="playful-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MotionDiv
                animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-rose-200/20 blur-[120px] rounded-full"
              />
              <MotionDiv
                animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 60, 0] }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute top-[20%] -left-[5%] w-[60%] h-[60%] bg-sky-200/20 blur-[120px] rounded-full"
              />
            </MotionDiv>
          )}
        </AnimatePresence>
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay`}></div>
      </div>

      <AnimatePresence>
        {maintenance.active && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-[30px] flex items-center justify-center p-6"
          >
            <MotionDiv
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className={`bg-white/80 border-white border shadow-[0_32px_120px_rgba(0,0,0,0.1)] backdrop-blur-3xl rounded-[3rem] p-12 text-center max-w-lg w-full relative overflow-hidden`}
            >
              <div className="relative inline-block mb-10">
                <div className={`absolute inset-0 bg-sky-500/10 rounded-full blur-3xl animate-pulse`}></div>
                <div className={`relative p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[2rem] shadow-sm`}>
                  <Activity className="h-10 w-10 text-sky-500 animate-pulse" />
                </div>
              </div>

              <h2 className={`text-4xl font-black tracking-tighter mb-4 text-slate-900`}>Under Calibration</h2>
              <p className={`font-medium mb-12 max-w-sm mx-auto leading-relaxed text-slate-500`}>
                We're fine-tuning the system for professional excellence. Access is temporarily paused for optimization.
              </p>

              <div className="bg-slate-50/50 border-slate-100 border rounded-[2rem] p-8 mb-12 relative overflow-hidden">
                <div className="flex items-center justify-center space-x-2 mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
                  <Timer className="h-3 w-3" />
                  <span>Completion Estimate</span>
                </div>
                <div className="text-5xl font-black tracking-tight tabular-nums font-mono text-slate-900 mb-6">
                  {timeLeft || "-- : --"}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-[200px] mx-auto h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <MotionDiv
                    className="h-full bg-emerald-500 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </MotionDiv>
                </div>
                <div className="mt-2 text-[10px] font-medium text-slate-400 text-center uppercase tracking-wider">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              <MotionButton
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMaintenance({ ...maintenance, active: false })}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center group shadow-xl transition-all ${isGalactic ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
              >
                <Shield className="h-5 w-5 mr-3" />
                Privileged Access Portal
                <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </MotionButton>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-28">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-5"
          >
            <div className="relative group">
              <MotionDiv
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`relative p-5 border rounded-[1.5rem] shadow-lg transition-all transform group-hover:scale-110 ${isGalactic ? 'bg-black/40 border-white/10 group-hover:shadow-violet-500/20' : 'bg-white border-slate-100 group-hover:shadow-sky-500/10'}`}
              >
                <ShoppingCart className={`h-8 w-8 ${isGalactic ? 'text-violet-400' : 'text-sky-500'}`} />
              </MotionDiv>
            </div>
            <div>
              <h1 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                HybridPOS
              </h1>
              <div className="flex items-center space-x-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isGalactic ? 'bg-violet-400' : 'bg-sky-500'}`}></div>
                <p className={`text-[10px] uppercase tracking-[0.4em] font-black ${isGalactic ? 'text-slate-500' : 'text-slate-400'}`}>Enterprise Unified</p>
              </div>
            </div>
          </MotionDiv>

          <div className="flex items-center space-x-12">
            <nav className="hidden md:flex items-center space-x-12">
              <Link href="#" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isGalactic ? 'text-slate-500 hover:text-violet-400' : 'text-slate-400 hover:text-sky-500'}`}>Capabilities</Link>
              <Link href="/contact" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isGalactic ? 'text-slate-500 hover:text-violet-400' : 'text-slate-400 hover:text-sky-500'}`}>Contact Sales</Link>
            </nav>

            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(isGalactic ? "playful" : "galactic")}
              className={`relative p-2.5 rounded-2xl border transition-all flex items-center space-x-3 group ${isGalactic ? 'bg-violet-500/10 border-violet-500/30' : 'bg-slate-100 border-slate-200'}`}
            >
              <div className="relative w-10 h-6 bg-slate-200/50 dark:bg-white/10 rounded-full flex items-center p-1 transition-colors">
                <MotionDiv
                  animate={{ x: isGalactic ? 16 : 0 }}
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${isGalactic ? 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]' : 'bg-white shadow-sm'}`}
                >
                  {isGalactic ? <Moon className="h-2.5 w-2.5 text-white" /> : <Sun className="h-2.5 w-2.5 text-amber-500" />}
                </MotionDiv>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isGalactic ? 'text-violet-400' : 'text-slate-500'}`}>
                {isGalactic ? 'Cosmic' : 'Bright'}
              </span>
            </MotionButton>
          </div>
        </header>

        <main className="space-y-40">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <section className="space-y-20">
              <div className="space-y-10">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-8"
                >
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full border ${isGalactic ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-sky-50 border-sky-100 text-sky-600'}`}>
                    {isGalactic ? <Rocket className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Mastery</span>
                  </div>

                  <h2 className={`text-7xl md:text-8xl font-black tracking-tighter leading-[0.85] ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                    Business <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isGalactic ? 'from-violet-400 via-fuchsia-500 to-indigo-500' : 'from-sky-500 via-blue-600 to-indigo-600'}`}>
                      Perfected.
                    </span>
                  </h2>

                  <p className={`text-xl font-medium leading-relaxed max-w-lg ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                    The ultimate ecosystem for retail excellence.
                    Synchronized inventory, zero-latency processing, and professional growth tools at your command.
                  </p>
                </MotionDiv>

                <div className="flex items-center space-x-12">
                  {[
                    { value: "150k+", label: "Elite Members" },
                    { value: "0ms", label: "Sync Lag" },
                    { value: "100%", label: "Accuracy" }
                  ].map((stat, i) => (
                    <MotionDiv key={i} className="space-y-1">
                      <div className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                      <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${isGalactic ? 'text-slate-600' : 'text-slate-400'}`}>{stat.label}</div>
                    </MotionDiv>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: <Zap className="h-5 w-5" />, title: "Instant Sync", desc: "Real-time node updates" },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure Base", desc: "Hardened protocols" },
                  { icon: <Layers className="h-5 w-5" />, title: "Multi-Stack", desc: "Infinite organization" },
                  { icon: <Cpu className="h-5 w-5" />, title: "Core Energy", desc: "Autonomous processing" }
                ].map((feature, idx) => (
                  <MotionDiv
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="flex items-start space-x-4 group cursor-default"
                  >
                    <div className={`w-12 h-12 shrink-0 rounded-2xl border shadow-sm flex items-center justify-center transition-all duration-300 ${isGalactic ? 'bg-black/40 border-white/5 text-slate-500 group-hover:text-violet-400 group-hover:border-violet-500/30' : 'bg-white border-slate-100 text-slate-300 group-hover:text-sky-500 group-hover:border-sky-100'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <div className={`font-black text-sm tracking-tight ${isGalactic ? 'text-white/90' : 'text-slate-900'}`}>{feature.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{feature.desc}</div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </section>

            {/* Auth Portal */}
            <section className="space-y-8">
              <MotionDiv
                className={`backdrop-blur-3xl border shadow-2xl rounded-[3.5rem] p-12 space-y-10 ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/80'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Auth Portal</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Initialize Operation</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${isGalactic ? 'bg-violet-500/10' : 'bg-sky-50'}`}>
                    <Lock className={`h-6 w-6 ${isGalactic ? 'text-violet-400' : 'text-sky-500'}`} />
                  </div>
                </div>

                <div className="space-y-4">
                  {(["SUPER_ADMIN", "ADMIN", "USER", "NEW_ACCOUNT"] as const).map((role) => {
                    const cred = demoCredentials[role]
                    const themeStyles = isGalactic ? cred.galactic : cred.playful

                    return (
                      <MotionButton
                        key={role}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLogin(role)}
                        className={`w-full group relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-left ${selectedRole === role
                          ? `${isGalactic ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-900 text-white'} shadow-2xl`
                          : `${isGalactic ? 'bg-white/5 border-white/5 hover:border-white/20' : 'bg-white border-slate-50 hover:border-slate-200'} shadow-sm`
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className={`p-4 rounded-2xl transition-all duration-300 ${selectedRole === role
                              ? (isGalactic ? 'bg-black/10' : 'bg-white/10')
                              : themeStyles.bg
                              }`}>
                              <div className={selectedRole === role ? (isGalactic ? 'text-black' : 'text-white') : themeStyles.accent}>
                                {cred.icon}
                              </div>
                            </div>
                            <div>
                              <h4 className={`font-black text-xl tracking-tighter ${selectedRole === role ? (isGalactic ? 'text-black' : 'text-white') : (isGalactic ? 'text-white' : 'text-slate-900')}`}>
                                {cred.name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {cred.features.slice(0, 2).map((feature, idx) => (
                                  <span key={idx} className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${selectedRole === role ? (isGalactic ? 'bg-black/5 text-black/70' : 'bg-white/20 text-white') : (isGalactic ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className={`transition-all duration-500 ${selectedRole === role ? 'translate-x-0' : 'translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                            {selectedRole === role && isLoading ? (
                              <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className={`w-6 h-6 border-2 border-t-white rounded-full ${isGalactic ? 'border-black/20' : 'border-white/20'}`} />
                            ) : (
                              <ArrowRight className={`h-6 w-6 ${selectedRole === role ? (isGalactic ? 'text-black' : 'text-white') : 'text-slate-300'}`} />
                            )}
                          </div>
                        </div>
                      </MotionButton>
                    )
                  })}
                </div>

                {error && (
                  <MotionDiv animate={{ x: [0, -5, 5, -5, 5, 0] }} className={`p-5 border rounded-[2rem] flex items-center space-x-4 ${isGalactic ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-900'}`}>
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-tight">{error}</p>
                  </MotionDiv>
                )}
              </MotionDiv>
            </section>
          </div>

          {/* Feature Showcase Section */}
          <section className="space-y-24 py-20 relative">
            <div className="text-center space-y-6">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`inline-flex items-center px-4 py-1.5 rounded-full border ${isGalactic ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-sky-50 border-sky-100 text-sky-600'}`}
              >
                <Layers className="h-4 w-4 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Advanced Capabilities</span>
              </MotionDiv>
              <h3 className={`text-5xl md:text-6xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                Engineered for <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isGalactic ? 'from-violet-400 to-fuchsia-500' : 'from-sky-500 to-blue-600'}`}>Infinite Scaling.</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <MotionDiv
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onHoverStart={() => setActiveFeature(idx)}
                  onHoverEnd={() => setActiveFeature(null)}
                  className={`group relative p-8 border rounded-[2.5rem] transition-all duration-500 ${isGalactic ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${activeFeature === idx ? 'scale-110 rotate-3' : ''} ${isGalactic ? 'bg-violet-500/10 text-violet-400' : 'bg-sky-50 text-sky-600'}`}>
                    {feature.icon}
                  </div>
                  <h4 className={`text-xl font-black tracking-tight mb-4 ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h4>
                  <p className={`text-sm leading-relaxed font-medium ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                    {feature.desc}
                  </p>

                  {/* Interactive Glow / Element */}
                  <MotionDiv
                    animate={{ opacity: activeFeature === idx ? 1 : 0, scale: activeFeature === idx ? 1 : 0.8 }}
                    className={`absolute bottom-6 right-8 w-8 h-8 rounded-full flex items-center justify-center ${isGalactic ? 'bg-violet-500/20 text-violet-400' : 'bg-sky-100 text-sky-600'}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </MotionDiv>
                </MotionDiv>
              ))}
            </div>

            {/* Visual Ecosystem Component */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`mt-20 p-12 border rounded-[3rem] overflow-hidden relative group ${isGalactic ? 'bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border-white/10' : 'bg-slate-50 border-slate-100'}`}
            >
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h4 className={`text-3xl font-black tracking-tighter ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                    Global Synchronization Hub
                  </h4>
                  <p className={`text-lg font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                    Every branch, every terminal, every transaction. Synchronized in real-time across the global HybridPOS mesh network.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["Zero Latency", "Cloud Native", "Region Lock", "Enterprise Encryption"].map((tag, i) => (
                      <span key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isGalactic ? 'bg-white/5 text-violet-300' : 'bg-white text-sky-600 shadow-sm border border-slate-100'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 flex items-center justify-center">
                  <div className={`absolute inset-0 opacity-10 ${isGalactic ? 'bg-violet-500' : 'bg-sky-500'} blur-[100px] rounded-full`}></div>
                  <MotionDiv
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="relative w-48 h-48 border-2 border-dashed border-sky-400/30 rounded-full flex items-center justify-center"
                  >
                    <MotionDiv
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-3 left-1/2 -ml-3 w-6 h-6 bg-white border border-sky-500 rounded-lg flex items-center justify-center shadow-lg"
                    >
                      <Database className="h-3 w-3 text-sky-500" />
                    </MotionDiv>
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 ${isGalactic ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_40px_rgba(167,139,250,0.3)]' : 'bg-white border-sky-500 shadow-2xl shadow-sky-200'}`}>
                      <Globe className={`h-12 w-12 ${isGalactic ? 'text-white' : 'text-sky-500'} animate-pulse`} />
                    </div>
                  </MotionDiv>
                </div>
              </div>
            </MotionDiv>
          </section>

          {/* Account Creation Card */}
          <section className="pb-20">
            <MotionDiv
              whileHover={{ y: -10 }}
              onClick={() => router.push('/auth/signup')}
              className={`relative overflow-hidden group rounded-[4rem] cursor-pointer p-16 shadow-2xl ${isGalactic ? 'bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-900' : 'bg-slate-900'}`}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
              <MotionDiv
                animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute -top-[50%] -right-[10%] w-[100%] h-[100%] bg-white/5 blur-[120px]"
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-16">
                <div className="space-y-6">
                  <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Create Account.</h3>
                  <p className="text-white/60 text-xl font-medium max-w-[400px] leading-relaxed">Experience the next generation of business management. Secure your trial access today.</p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-12">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-14 h-14 rounded-full border-4 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 hover:z-20 ${isGalactic ? 'border-violet-700 bg-violet-600' : 'border-slate-800 bg-slate-700'}`}>
                        <User className="h-6 w-6 text-white/40" />
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-white z-10">
                      +18k
                    </div>
                  </div>
                  <MotionButton
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-12 py-6 bg-white text-slate-900 font-black rounded-[2.5rem] shadow-2xl flex items-center space-x-4 text-lg"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </MotionButton>
                </div>
              </div>
            </MotionDiv>
          </section>
        </main>

        {/* Footer */}
        <footer className={`pt-20 border-t ${isGalactic ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center border ${isGalactic ? 'bg-violet-500/10 border-violet-500/20' : 'bg-slate-50 border-slate-100'}`}>
                  <Globe className={isGalactic ? 'text-violet-400' : 'text-sky-500'} />
                </div>
                <div>
                  <span className={`text-xl font-black tracking-tight ${isGalactic ? 'text-white' : 'text-slate-900'}`}>Global Node Infrastructure</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hybrid Mesh Enabled</p>
                </div>
              </div>
              <p className={`text-sm font-medium max-w-[340px] leading-relaxed ${isGalactic ? 'text-slate-500' : 'text-slate-400'}`}>
                Ultra-low latency architecture with real-time multi-region replication. Every operation synchronized in millisecond precision.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-10">
              {[
                { title: "System", links: ["Status", "Performance", "Locations"] },
                { title: "Legal", links: ["Privacy", "Security", "Terms"] },
                { title: "Help", links: ["Support Center", "Developers", "Contact Us"] }
              ].map((section) => (
                <div key={section.title} className="space-y-6">
                  <h5 className={`text-[10px] font-black uppercase tracking-[0.4em] ${isGalactic ? 'text-violet-400' : 'text-sky-600'}`}>{section.title}</h5>
                  <ul className="space-y-4">
                    {section.links.map(link => (
                      <li key={link}>
                        <Link href="#" className={`text-xs font-bold transition-colors ${isGalactic ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={`py-12 border-t flex flex-col md:flex-row justify-between items-center -mx-6 px-6 ${isGalactic ? 'border-white/5 bg-white/5' : 'border-slate-50 bg-slate-50/50'}`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} HybridPOS Galactic Entity • V4.3 Core
            </p>
            <div className="flex items-center space-x-6">
              <div className={`px-6 py-2.5 rounded-full border flex items-center space-x-3 ${isGalactic ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-md'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isGalactic ? 'bg-violet-400' : 'bg-emerald-500'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-widest leading-none mt-0.5 ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>Core Synchronized</span>
              </div>
              <div className={`hidden sm:flex items-center space-x-2 ${isGalactic ? 'text-violet-400/40' : 'text-slate-300'}`}>
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Vault-Grade Protocol</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
          background-size: 400% 400%;
        }
      `}</style>
    </div>
  )
}