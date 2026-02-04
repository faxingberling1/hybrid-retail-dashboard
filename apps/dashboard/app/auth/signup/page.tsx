// app/auth/signup/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import IndustrySelection from './steps/industry-selection'
import BusinessDetails from './steps/business-details'
import AdminSetup from './steps/admin-setup'
import TwoFactorSetup from './steps/two-factor-setup'
import UserInvitation from './steps/user-invitation'
import Confirmation from './steps/confirmation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  ArrowLeft, Check, Sparkles, Rocket,
  ShieldCheck, Globe, Moon, Sun, ShoppingCart,
  ArrowRight, Lock
} from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { id: 'industry', title: 'Industry', component: IndustrySelection, desc: 'Tailor your experience' },
  { id: 'business', title: 'Business Info', component: BusinessDetails, desc: 'Your brand details' },
  { id: 'admin', title: 'Admin Setup', component: AdminSetup, desc: 'Create your account' },
  { id: 'security', title: '2FA Setup', component: TwoFactorSetup, desc: 'Secure your access' },
  { id: 'users', title: 'Team Setup', component: UserInvitation, desc: 'Invite your team' },
  { id: 'confirm', title: 'Final Review', component: Confirmation, desc: 'Ready to start' },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    industry: '',
    businessName: '',
    businessType: '',
    employees: '1-10',
    country: '',
    timezone: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    adminPhone: '',
    twoFactorEnabled: false,
    twoFactorVerified: false,
    userEmails: [] as string[],
    userRoles: [] as string[],
    termsAccepted: false,
    marketingEmails: false,
  })
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<'playful' | 'galactic'>('playful')
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const CurrentStepComponent = STEPS[currentStep].component
  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0
  const isGalactic = theme === 'galactic'

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Initialization stalled: Please fill required parameters.')
      return
    }

    if (isLastStep) {
      await handleSubmit()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (isFirstStep) {
      router.push('/login')
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: return !!formData.industry
      case 1: return !!(formData.businessName && formData.businessType && formData.country)
      case 2: return !!(formData.adminEmail && formData.adminPassword && formData.adminName)
      case 3: return formData.twoFactorVerified
      case 4: return true
      case 5: return formData.termsAccepted
      default: return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Core Synchronized: Account established.')

        const signInResult = await signIn('credentials', {
          email: formData.adminEmail,
          password: formData.adminPassword,
          redirect: false,
        })

        if (signInResult && !signInResult.error) {
          setTimeout(() => {
            router.push(`/onboarding/${data.organizationId}`)
          }, 1000)
        } else {
          toast.success('System Initialized. Access portal at login.')
          router.push('/login')
        }
      } else {
        toast.error(data.error || 'Initialization Refused')
      }
    } catch (error: any) {
      toast.error(error.message || 'Mesh Sync Failure')
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className={`min-h-screen transition-colors duration-1000 selection:bg-sky-500/20 overflow-x-hidden relative font-sans antialiased ${isGalactic ? 'bg-[#020412] text-white' : 'bg-white text-slate-900'}`}>

      {/* Backgrounds */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {isGalactic ? (
            <motion.div key="galactic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/10 blur-[130px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full" />
              {[...Array(15)].map((_, i) => (
                <motion.div key={i} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} className="absolute w-1 h-1 bg-white rounded-full" />
              ))}
            </motion.div>
          ) : (
            <motion.div key="playful" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-rose-200/10 blur-[120px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute top-[20%] -left-[5%] w-[60%] h-[60%] bg-sky-200/10 blur-[120px] rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-4">
            <div className={`p-4 border rounded-2xl shadow-sm ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white border-slate-100'}`}>
              <ShoppingCart className={`h-6 w-6 ${isGalactic ? 'text-violet-400' : 'text-sky-500'}`} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter">Create New Account</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Account Configuration</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(isGalactic ? "playful" : "galactic")}
            className={`p-2.5 rounded-2xl border transition-all flex items-center space-x-3 ${isGalactic ? 'bg-violet-500/10 border-violet-500/30' : 'bg-slate-100 border-slate-200'}`}
          >
            <div className="relative w-10 h-6 bg-slate-200/50 dark:bg-white/10 rounded-full flex items-center p-1">
              <motion.div animate={{ x: isGalactic ? 16 : 0 }} className={`w-4 h-4 rounded-full flex items-center justify-center ${isGalactic ? 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]' : 'bg-white shadow-sm'}`}>
                {isGalactic ? <Moon className="h-2.5 w-2.5 text-white" /> : <Sun className="h-2.5 w-2.5 text-amber-500" />}
              </motion.div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isGalactic ? 'text-violet-400' : 'text-slate-500'}`}>
              {isGalactic ? 'Dark' : 'Light'}
            </span>
          </motion.button>
        </header>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Progress & Info Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="space-y-6">
              <h1 className={`text-5xl font-black tracking-tighter leading-[0.9] ${isGalactic ? 'text-white' : 'text-slate-900'}`}>
                Start your <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isGalactic ? 'from-violet-400 to-fuchsia-500' : 'from-sky-500 to-blue-600'}`}>Journey.</span>
              </h1>
              <p className={`text-sm font-medium leading-relaxed max-w-sm ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                Join thousands of businesses already using our platform. Complete these simple steps to get started.
              </p>
            </div>

            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-6">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 ${index < currentStep ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                    index === currentStep ? `${isGalactic ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10'}` :
                      `${isGalactic ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-white border-slate-100 text-slate-400'}`
                    }`}>
                    {index < currentStep ? <Check className="h-5 w-5" /> : <span className="text-xs font-black">{index + 1}</span>}
                  </div>
                  <div className={`hidden md:block transition-opacity duration-500 ${index > currentStep ? 'opacity-30' : 'opacity-100'}`}>
                    <div className={`text-xs font-black uppercase tracking-[0.2em] ${index === currentStep ? (isGalactic ? 'text-violet-400' : 'text-sky-600') : 'text-slate-400'}`}>{step.title}</div>
                    <div className="text-[10px] font-bold text-slate-500 tracking-tight mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-8 border rounded-[2.5rem] space-y-6 ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center space-x-4">
                <ShieldCheck className={isGalactic ? 'text-violet-400' : 'text-sky-600'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Setup</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                Your data is protected with enterprise-grade encryption and stored securely on our private network.
              </p>
            </div>
          </aside>

          {/* Main Form Area */}
          <main className="lg:col-span-8">
            <motion.div
              layout
              className={`backdrop-blur-3xl border shadow-2xl rounded-[3.5rem] overflow-hidden ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/80'}`}
            >
              <div className="p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  >
                    <CurrentStepComponent
                      formData={formData}
                      updateFormData={updateFormData}
                      theme={theme}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Bar */}
              <div className={`p-8 border-t flex justify-between items-center ${isGalactic ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isGalactic ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {isFirstStep ? 'Cancel' : 'Previous Step'}
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={loading}
                  className={`px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center space-x-3 ${isGalactic ? 'bg-violet-600 text-white shadow-violet-500/20' : 'bg-slate-900 text-white shadow-slate-900/10'
                    }`}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    <>
                      <span>{isLastStep ? 'Create Account' : 'Next Step'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            <footer className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
              <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Link href="#" className="hover:text-sky-500 transition-colors">Privacy Protocol</Link>
                <Link href="#" className="hover:text-sky-500 transition-colors">Operator Terms</Link>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Core v4.3 • Dimension Synchronized
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}