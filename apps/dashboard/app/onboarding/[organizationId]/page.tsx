// app/onboarding/[organizationId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Settings,
  Users,
  Database,
  BarChart3,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Moon,
  Sun,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminHeader } from '@/components/dashboard/admin-header';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';

const ONBOARDING_STEPS = [
  { id: 'industry-setup', name: 'Industry Setup', icon: Settings, description: 'Protocol recalibration for your sector.' },
  { id: 'invite-users', name: 'Invite Team', icon: Users, description: 'Synchronize auxiliary operator nodes.' },
  { id: 'data-import', name: 'Import Data', icon: Database, description: 'Migrate legacy information metrics.' },
  { id: 'integrations', name: 'Connect Tools', icon: BarChart3, description: 'Initialize poly-channel ecosystem links.' },
  { id: 'notifications', name: 'Notifications', icon: Mail, description: 'Establish real-time alert vectors.' }
];

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('industry-setup');
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [theme, setTheme] = useState<'playful' | 'galactic'>('playful');
  const isGalactic = theme === 'galactic';

  useEffect(() => {
    fetchOrganizationData();
    fetchOnboardingProgress();
  }, [organizationId]);

  const fetchOrganizationData = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}`);
      const data = await response.json();
      setOrganization(data);
    } catch (error) {
      toast.error('Sync Failure: Node unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOnboardingProgress = async () => {
    try {
      const response = await fetch(`/api/onboarding/${organizationId}/progress`);
      const data = await response.json();
      setCompletedSteps(data.completedSteps || []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const completeStep = async (stepId: string) => {
    try {
      await fetch(`/api/onboarding/${organizationId}/complete-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepId })
      });

      setCompletedSteps(prev => [...prev, stepId]);
      toast.success(`Success: ${stepId.replace('-', ' ')} Synchronized.`);

      const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
      if (currentIndex < ONBOARDING_STEPS.length - 1) {
        setCurrentStep(ONBOARDING_STEPS[currentIndex + 1].id);
      }
    } catch (error) {
      toast.error('Initialization Fault: Module incomplete.');
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await fetch(`/api/onboarding/${organizationId}/complete`, {
        method: 'POST'
      });

      toast.success('Core Active: Redirecting to Command Hub.');
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 1500);
    } catch (error) {
      toast.error('Finalization Failure.');
    }
  };

  const handleSkipOnboarding = async () => {
    toast.loading('Bypassing initialization sequence...');
    try {
      await fetch(`/api/onboarding/${organizationId}/complete`, {
        method: 'POST'
      });

      toast.dismiss();
      toast.success('Sequence Aborted: Accessing Dashboard.');
      setTimeout(() => {
        router.push(`/dashboard`);
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error('Bypass Failure.');
    }
  };

  const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100;
  const isComplete = completedSteps.length === ONBOARDING_STEPS.length;

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isGalactic ? 'bg-[#020412]' : 'bg-white'}`}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full" />
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-1000 selection:bg-sky-500/20 overflow-x-hidden relative font-sans antialiased ${isGalactic ? 'bg-[#020412] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <AdminHeader />

      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {isGalactic ? (
            <motion.div key="galactic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/10 blur-[130px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full" />
            </motion.div>
          ) : (
            <motion.div key="playful" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-sky-200/20 blur-[120px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute top-[20%] -left-[5%] w-[60%] h-[60%] bg-emerald-200/20 blur-[120px] rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Navigation & Progress Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl border ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Zap className={`h-6 w-6 ${isGalactic ? 'text-violet-400' : 'text-sky-500'}`} />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter">Welcome, {organization?.business_name}.</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Initialize Operational Command</p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center space-x-8">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Setup Integrity</div>
              <div className="flex items-center space-x-3">
                <div className={`w-32 h-2 rounded-full overflow-hidden ${isGalactic ? 'bg-white/10' : 'bg-slate-200'}`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${isGalactic ? 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]' : 'bg-sky-500 shadow-lg shadow-sky-500/20'}`} />
                </div>
                <span className="text-xs font-black tracking-tight">{Math.round(progress)}%</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(isGalactic ? "playful" : "galactic")}
              className={`p-2.5 rounded-2xl border transition-all flex items-center space-x-3 ${isGalactic ? 'bg-violet-500/10 border-violet-500/30' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className="relative w-10 h-6 bg-slate-200/50 dark:bg-white/10 rounded-full flex items-center p-1">
                <motion.div animate={{ x: isGalactic ? 16 : 0 }} className={`w-4 h-4 rounded-full flex items-center justify-center ${isGalactic ? 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]' : 'bg-white shadow-sm'}`}>
                  {isGalactic ? <Moon className="h-2.5 w-2.5 text-white" /> : <Sun className="h-2.5 w-2.5 text-amber-500" />}
                </motion.div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isGalactic ? 'text-violet-400' : 'text-slate-500'}`}>
                {isGalactic ? 'Cosmic' : 'Bright'}
              </span>
            </motion.button>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ONBOARDING_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={step.id}
                    className={`group relative overflow-hidden rounded-[2.5rem] p-8 border-2 transition-all duration-500 ${isCompleted
                      ? (isGalactic ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-100')
                      : isCurrent
                        ? (isGalactic ? 'bg-white text-black border-white shadow-2xl' : 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10')
                        : (isGalactic ? 'bg-black/40 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 hover:border-slate-200')
                      }`}
                  >
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${isCompleted
                          ? (isGalactic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
                          : isCurrent
                            ? 'bg-black/10'
                            : (isGalactic ? 'bg-white/5 text-violet-400' : 'bg-sky-50 text-sky-600')
                          }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {isCompleted && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`p-2 rounded-full ${isGalactic ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-black tracking-tight">{step.name}</h3>
                        <p className={`text-xs font-medium leading-relaxed ${isCompleted ? 'opacity-60' : isCurrent ? 'opacity-60' : 'text-slate-500'}`}>
                          {step.description}
                        </p>
                      </div>

                      {!isCompleted ? (
                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => router.push(`/onboarding/${organizationId}/${step.id}`)}
                          className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-3 transition-all ${isCurrent
                            ? (isGalactic ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-slate-900 hover:bg-white/90')
                            : (isGalactic ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100')
                            }`}
                        >
                          <span>{isCurrent ? 'Continue Setup' : 'Start Module'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </motion.button>
                      ) : (
                        <div className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border ${isGalactic ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-200 text-emerald-600'}`}>
                          Synchronized
                        </div>
                      )}
                    </div>

                    {/* Background glow for current step */}
                    {isCurrent && (
                      <motion.div animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className={`absolute inset-0 z-0 ${isGalactic ? 'bg-violet-600/20 blur-[60px]' : 'bg-sky-600/10 blur-[60px]'}`} />
                    )}
                  </motion.div>
                );
              })}
            </section>
          </div>

          {/* Right Support/Info Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-10 rounded-[3rem] border-2 space-y-12 ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isGalactic ? 'bg-violet-500/10 text-violet-400' : 'bg-sky-50 text-sky-600'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black tracking-tighter">Vault Protocol Active</h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500">
                  Your environment is secured with enterprise-grade encryption. Each onboarding module provisions specific secure nodes for your business dashboard.
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment Sync</div>
                <div className="space-y-4">
                  {[
                    { label: 'Cloud Core', status: 'Online', color: 'emerald' },
                    { label: 'Mesh Network', status: 'Secured', color: 'sky' },
                    { label: 'Data Hub', status: 'Standby', color: 'amber' }
                  ].map((node, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{node.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${node.color}-500 animate-pulse`} />
                        <span className={`text-[9px] font-black uppercase tracking-widest text-${node.color}-500`}>{node.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompleteOnboarding}
                  disabled={!isComplete}
                  className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center space-x-4 ${isComplete
                    ? (isGalactic ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-emerald-600 text-white shadow-emerald-600/20')
                    : (isGalactic ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed')
                    }`}
                >
                  <span>Finalize Command</span>
                  <LayoutDashboard className="h-4 w-4" />
                </motion.button>

                <button
                  onClick={handleSkipOnboarding}
                  className={`w-full mt-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isGalactic ? 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'}`}
                >
                  Skip for Now
                </button>
              </div>
            </motion.div>

            <footer className="px-6 space-y-4">
              <div className="flex items-center space-x-4 opacity-50">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Node : Karachi (KHI-01)</span>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleSkipOnboarding}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 text-left transition-colors"
                >
                  Skip Initialization Sequence
                </button>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-500 text-left transition-colors">Emergency Protocol Support</button>
              </div>
            </footer>
          </aside>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}