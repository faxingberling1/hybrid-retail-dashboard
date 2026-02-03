// @ts-nocheck
import { CreditCard, Zap, Users, HardDrive, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import { motion } from 'framer-motion';

interface CurrentPlan {
  plan: string;
  status: 'active' | 'past_due' | 'canceled';
  nextBillingDate: string;
  billingCycle: 'monthly' | 'yearly';
}

interface CurrentPlanSectionProps {
  plan: CurrentPlan;
  onUpgradePlan: () => void;
}

export default function CurrentPlanSection({ plan, onUpgradePlan }: CurrentPlanSectionProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'past_due': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Current Plan"
        description="Manage your subscription and billing details"
        icon={<CreditCard className="h-5 w-5" />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-px shadow-xl shadow-purple-500/20"
      >
        <div className="relative bg-[#0f172a]/95 rounded-[15px] p-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-white backdrop-blur-md border border-white/20">
                  Current Status
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(plan.status)}`}>
                  {plan.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                {plan.plan} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 italic">Special Edition</span>
              </h2>

              <p className="text-gray-400 text-lg max-w-xl">
                You're currently on the <span className="text-white font-medium">{plan.billingCycle}</span> {plan.plan.toLowerCase()} plan.
                Everything you need to scale your business is right here.
              </p>

              <div className="flex items-center mt-6 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                <span>Next billing cycle starts: <span className="text-white font-medium">{new Date(plan.nextBillingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span></span>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-baseline gap-1">
                <span className="text-white text-3xl font-bold">₨ 49,999</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <button
                onClick={onUpgradePlan}
                className="group relative px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/10 flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 group-hover:from-gray-50 group-hover:to-white transition-all" />
                <Zap className="relative h-4 w-4 fill-indigo-600" />
                <span className="relative">Upgrade to Elite</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Monthly Investment', value: '₨ 49,999', icon: <Zap className="h-5 w-5" />, color: 'from-orange-500 to-amber-500' },
          { label: 'Team Members', value: '50 Seats', icon: <Users className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
          { label: 'Cloud Storage', value: '100 GB', icon: <HardDrive className="h-5 w-5" />, color: 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Full Access Enabled</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
