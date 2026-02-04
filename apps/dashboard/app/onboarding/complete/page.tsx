// app/onboarding/complete/page.tsx
'use client';

import { CheckCircle, LayoutDashboard, Sparkles, Zap, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingCompletePage() {
    const router = useRouter();
    const [theme, setTheme] = useState<'playful' | 'galactic'>('playful');
    const isGalactic = theme === 'galactic';

    // Type workaround for framer-motion issues
    const MotionDiv = motion.div as any;
    const MotionButton = motion.button as any;

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-1000 overflow-hidden relative font-sans antialiased ${isGalactic ? 'bg-[#020412] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>

            {/* Dynamic Backgrounds */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="wait">
                    {isGalactic ? (
                        <MotionDiv key="galactic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <MotionDiv animate={{ scale: [1, 1.2, 1], x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-violet-600/10 blur-[130px] rounded-full" />
                            <MotionDiv animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, 100, 0] }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[130px] rounded-full" />
                        </MotionDiv>
                    ) : (
                        <MotionDiv key="playful" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                            <MotionDiv animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[10%] -right-[5%] w-[70%] h-[70%] bg-sky-200/20 blur-[120px] rounded-full" />
                            <MotionDiv animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, 60, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute top-[20%] -left-[5%] w-[60%] h-[60%] bg-emerald-200/20 blur-[120px] rounded-full" />
                        </MotionDiv>
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
            </div>

            <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative z-10 max-w-md w-full text-center space-y-10 backdrop-blur-3xl border shadow-2xl rounded-[3.5rem] p-12 ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white/60 border-white/80'}`}
            >
                <div className="flex justify-center">
                    <MotionDiv
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className={`p-6 rounded-[2rem] shadow-2xl relative ${isGalactic ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}
                    >
                        <CheckCircle className="h-12 w-12" />
                        <MotionDiv
                            animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-emerald-400/50 rounded-[2rem] blur-xl"
                        />
                    </MotionDiv>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter">Setup Complete!</h1>
                    <p className={`text-sm font-medium leading-relaxed ${isGalactic ? 'text-slate-400' : 'text-slate-500'}`}>
                        Your organization has been successfully synchronized. All operational nodes are online and ready for command.
                    </p>
                </div>

                <div className="pt-4">
                    <MotionButton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/dashboard')}
                        className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center space-x-4 ${isGalactic ? 'bg-violet-600 text-white shadow-violet-500/30' : 'bg-slate-900 text-white shadow-slate-900/20'
                            }`}
                    >
                        <span>Go to Dashboard</span>
                        <LayoutDashboard className="h-4 w-4" />
                    </MotionButton>
                </div>

                <div className="flex items-center justify-center space-x-6 pt-4">
                    <div className="flex items-center space-x-2 opacity-50">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Active</span>
                    </div>
                    <div className="w-px h-4 bg-slate-400/20" />
                    <div className="flex items-center space-x-2 opacity-50">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ecosystem Live</span>
                    </div>
                </div>
            </MotionDiv>

            {/* Hidden theme toggle for consistency */}
            <div className="fixed bottom-8 right-8 z-20">
                <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(isGalactic ? "playful" : "galactic")}
                    className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 ${isGalactic ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
                >
                    {isGalactic ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-500" />}
                </MotionButton>
            </div>
        </div>
    );
}
