'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function IndustrySetupRedirect() {
    const params = useParams();
    const router = useRouter();
    const organizationId = params.organizationId as string;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgAndRedirect = async () => {
            try {
                const response = await fetch(`/api/organizations/${organizationId}`);
                if (!response.ok) throw new Error('Failed to fetch organization');

                const org = await response.json();
                const industry = (org.industry || 'pharmacy').toLowerCase();

                const supportedIndustries = ['pharmacy', 'fashion', 'healthcare', 'education'];

                if (supportedIndustries.includes(industry)) {
                    const path = `/onboarding/${organizationId}/industry-setup/${industry}`;
                    router.replace(path);
                } else {
                    // If no specific module, just mark as complete or show notice
                    toast.info(`Protocol ${industry}: No specific calibration required.`);
                    await fetch(`/api/onboarding/${organizationId}/complete-step`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ step: 'industry-setup' })
                    });
                    router.replace(`/onboarding/${organizationId}`);
                }
            } catch (error) {
                console.error('Redirection error:', error);
                toast.error('Sync Error: Industry module not found.');
                router.push(`/onboarding/${organizationId}`);
            }
        };

        fetchOrgAndRedirect();
    }, [organizationId, router]);

    return (
        <div className="min-h-screen bg-[#020412] flex flex-col items-center justify-center text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full mb-8 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            />
            <div className="text-center space-y-2">
                <h2 className="text-xl font-black tracking-tighter uppercase">Initializing Sector Protocol</h2>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">Synchronizing Industry Nodes</p>
            </div>
        </div>
    );
}
