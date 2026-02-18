"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Store, ShoppingCart, User, ArrowRight, Sparkles,
  Lock, AlertTriangle, Building, Users, Activity,
  Timer, Rocket, Globe, Zap, Database
} from "lucide-react"
import Link from "next/link"

// Type workaround for framer-motion issues
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"quick" | "manual">("quick")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [maintenance, setMaintenance] = useState({ active: false, endAt: null, startAt: null })
  const [overrideMaintenance, setOverrideMaintenance] = useState(false)

  const [timeLeft, setTimeLeft] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

  const highlights = [
    {
      badge: "Enterprise v3.2 Premium",
      title: "Redefining Retail Flow.",
      desc: "The high-fidelity ecosystem for professional commerce. Mission-critical stability with neural synchronization.",
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      badge: "Global Infrastructure",
      title: "Limitless Scaling.",
      desc: "Distributed mesh architecture ensuring sub-millisecond data propagation across your entire retail network.",
      icon: <Globe className="h-4 w-4" />
    },
    {
      badge: "Neural Intelligence",
      title: "Predictive Analytics.",
      desc: "AI-driven inventory forecasting and staff optimization to maximize every square foot of your operation.",
      icon: <Activity className="h-4 w-4" />
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % highlights.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [highlights.length])

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
        .catch(err => console.error('System sync interrupt:', err))
    }
    checkMaintenance()
    const interval = setInterval(checkMaintenance, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!maintenance.active || !maintenance.endAt) return
    const timer = setInterval(() => {
      const diff = new Date(maintenance.endAt!).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft("Ready shortly")
        return
      }
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${mins}m ${secs}s`)
    }, 1000)
    return () => clearInterval(timer)
  }, [maintenance])

  const demoRoles = [
    {
      id: "SUPER_ADMIN",
      name: "Super Admin",
      desc: "Full Enterprise Access",
      email: "superadmin@hybridpos.pk",
      icon: <Shield className="h-5 w-5" />,
      color: "violet",
      redirect: "/super-admin"
    },
    {
      id: "ADMIN",
      name: "Store Admin",
      desc: "Branch Operations",
      email: "admin@hybridpos.pk",
      icon: <Building className="h-5 w-5" />,
      color: "sky",
      redirect: "/admin"
    },
    {
      id: "USER",
      name: "Member Staff",
      desc: "POS & Sales Flow",
      email: "user@hybridpos.pk",
      icon: <User className="h-5 w-5" />,
      color: "emerald",
      redirect: "/user/inventory"
    }
  ]

  const handleLogin = async (creds: { email: string; password?: string; redirect?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await signIn('credentials', {
        email: creds.email,
        password: creds.password || "demo123",
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push(creds.redirect || "/dashboard")
      }
    } catch (err: any) {
      setError("Protcol Error: Failed to initialize session.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans selection:bg-sky-500/10">

      {/* Brand Section (Left Side) */}
      <section className="hidden lg:flex w-1/2 bg-slate-900 relative p-16 flex-col justify-between overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/home" className="flex items-center space-x-3 group w-fit">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">HybridPOS</span>
          </Link>

          <div className="mt-40 relative h-[450px]">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={currentSlide}
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 space-y-8 max-w-xl"
              >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400">
                  <div className="mr-2">
                    {highlights[currentSlide].icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {highlights[currentSlide].badge}
                  </span>
                </div>

                <h1 className="text-7xl font-black tracking-tighter text-white leading-[0.85]">
                  {highlights[currentSlide].title.split('.').map((part, i) => (
                    <span key={i}>
                      {i === 1 && part ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                          {part}.
                        </span>
                      ) : (
                        <>{part}{part ? '.' : ''}<br /></>
                      )}
                    </span>
                  ))}
                </h1>

                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  {highlights[currentSlide].desc}
                </p>
              </MotionDiv>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-0 left-0 flex space-x-3">
              {highlights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 transition-all duration-700 rounded-full ${currentSlide === i ? 'w-12 bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]' : 'w-3 bg-white/10 hover:bg-white/30'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 pt-20 border-t border-white/5">
          {[
            { value: "1.2ms", label: "Neural Latency", icon: <Zap className="h-4 w-4" /> },
            { value: "480K+", label: "Active Nodes", icon: <Database className="h-4 w-4" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center space-x-2 text-sky-500 mb-1">
                {stat.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
      </section>

      {/* Auth Section (Right Side) */}
      <section className="w-full lg:w-1/2 relative flex items-center justify-center p-8 bg-slate-50/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[480px] space-y-10"
        >
          {/* Header Mobile Only */}
          <div className="lg:hidden flex justify-center mb-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">HybridPOS</span>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.4em]">Initialize Your Session</p>
          </div>

          {/* Maintenance Overlay replaced by Modal */}

          <div className="bg-white p-2 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
            <div className="p-2 flex mb-8">
              {[
                { id: "quick", label: "Quick Access" },
                { id: "manual", label: "Manual Entry" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLoginMethod(tab.id as any)}
                  className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === tab.id
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="px-8 pb-10">
              <AnimatePresence mode="wait">
                {loginMethod === "quick" ? (
                  <MotionDiv
                    key="quick"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 gap-4"
                  >
                    {demoRoles.map((role) => (
                      <MotionButton
                        key={role.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLogin({ email: role.email, redirect: role.redirect })}
                        className={`w-full group relative p-5 rounded-[2rem] border-2 border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all text-left flex items-center justify-between ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-2xl transition-colors ${role.color === 'violet' ? 'bg-violet-50 text-violet-500' :
                            role.color === 'sky' ? 'bg-sky-50 text-sky-500' :
                              'bg-emerald-50 text-emerald-500'
                            }`}>
                            {role.icon}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 tracking-tight">{role.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-slate-900 transition-colors" />
                      </MotionButton>
                    ))}
                  </MotionDiv>
                ) : (
                  <MotionDiv
                    key="manual"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Node Identifier</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operator@hybridpos.pk"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 focus:border-sky-500/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-sm font-medium text-slate-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Secure Key</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 focus:border-sky-500/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-sm font-medium text-slate-900"
                          />
                        </div>
                        <div className="flex justify-end px-2">
                          <Link
                            href="/auth/forgot-password"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                    </div>

                    <MotionButton
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLogin({ email, password })}
                      disabled={isLoading}
                      className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center group shadow-xl hover:bg-slate-800 transition-all"
                    >
                      {isLoading ? (
                        <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                      ) : (
                        <>
                          <span>Establish Connection</span>
                          <ArrowRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </MotionButton>
                  </MotionDiv>
                )}
              </AnimatePresence>

              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-sky-600 font-black hover:text-sky-700 transition-colors"
                  >
                    Create A New Account
                  </Link>
                </p>
              </div>
            </div>

            {error && (
              <div className="mx-8 mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
              </div>
            )}
          </div>

          <div className="pt-8 flex items-center justify-between px-4">
            <Link href="/home#features" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">capabilities</Link>
            <div className="flex items-center space-x-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Core Active</span>
            </div>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">contact sales</Link>
          </div>

          {/* Maintenance Modal Overlay */}
          <AnimatePresence>
            {maintenance.active && !overrideMaintenance && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 -inset-y-32 z-50 flex items-center justify-center p-4 lg:p-8"
              >
                <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-2xl" />

                <MotionDiv
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="relative w-full max-w-md bg-white p-1 rounded-[3rem] shadow-2xl border border-slate-200/50 overflow-hidden"
                >
                  <div className="p-10 text-center space-y-8">
                    <div className="flex justify-center">
                      <div className="relative">
                        <MotionDiv
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-xl"
                        />
                        <div className="relative h-20 w-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 border border-white/20">
                          <Activity className="h-10 w-10 text-white animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">System Sync</h3>
                      <p className="text-sm text-slate-500 font-medium max-w-[260px] mx-auto">
                        Infrastructure optimization in progress. Neural nodes are standardizing.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <Timer className="h-4 w-4 text-amber-500 mx-auto mb-2" />
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated</div>
                        <div className="text-lg font-black text-slate-900 tabular-nums">{timeLeft || "Checking..."}</div>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <Lock className="h-4 w-4 text-indigo-500 mx-auto mb-2" />
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-lg font-black text-slate-900 uppercase">Active</div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <button
                        onClick={() => setOverrideMaintenance(true)}
                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center group"
                      >
                        <span>Administrative Bypass</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <Link
                        href="/home"
                        className="block text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                      >
                        Return to Public Gateway
                      </Link>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
                    <MotionDiv
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 30, repeat: Infinity }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                    />
                  </div>
                </MotionDiv>
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionDiv>
      </section>
    </div>
  )
}