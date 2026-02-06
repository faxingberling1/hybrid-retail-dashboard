// @ts-nocheck
import { CheckCircle2, XCircle, ChevronRight, Zap, Star, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlanFeature {
  name: string;
  basic: boolean;
  pro: boolean;
  enterprise: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PlanComparisonSectionProps {
  plans: Plan[];
  features: PlanFeature[];
  onSelectPlan: (planId: string) => void;
}

export default function PlanComparisonSection({
  plans,
  features,
  onSelectPlan
}: PlanComparisonSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (plan: Plan) => {
    const price = plan.price.replace('₨ ', '');
    const numPrice = parseFloat(price.replace(',', ''));
    if (billingCycle === 'yearly') {
      const yearlyPrice = numPrice * 12 * 0.8; // 20% discount for yearly
      return `₨ ${yearlyPrice.toLocaleString('en-PK')}`;
    }
    return plan.price;
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Level Up Your Business</h3>
          <p className="mt-2 text-gray-500 text-lg">Choose a plan that scales with your ambition. Upgrade anytime as your team grows.</p>
        </div>

        {/* Modern Billing Cycle Toggle */}
        <div className="flex items-center p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${billingCycle === 'monthly'
              ? 'bg-white text-indigo-600 shadow-md scale-105'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${billingCycle === 'yearly'
              ? 'bg-white text-indigo-600 shadow-md scale-105'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <span>Yearly</span>
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md animate-pulse">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Modern Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group flex flex-col p-8 rounded-3xl border transition-all duration-500 ${plan.popular
              ? 'bg-white border-indigo-500 border-2 shadow-2xl shadow-indigo-500/10 scale-105 z-10'
              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl shadow-sm'
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 uppercase tracking-widest">
                  <Star className="h-3 w-3 fill-white" />
                  Most Recommended
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className={`text-xl font-black tracking-tight ${plan.popular ? 'text-indigo-600' : 'text-gray-900'}`}>
                {plan.name}
              </h4>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{getPrice(plan)}</span>
                <span className="text-gray-500 text-sm font-medium">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-500 leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Core Features</div>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${plan.popular ? 'bg-indigo-50 text-indigo-500' : 'bg-green-50 text-green-500'}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className={`group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${plan.popular
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm'
                }`}
            >
              {plan.popular ? 'Unlock Premium Access' : 'See Detailed Plan'}
              <ChevronRight className={`h-4 w-4 transition-transform ${plan.popular ? 'group-hover:translate-x-1' : ''}`} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison Table - Modern View */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-black text-gray-900">Feature Breakdown</h4>
              <p className="text-xs text-gray-500 font-medium">Compare detailed specifications across our tiers</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Capabilities</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-6 px-8 text-sm font-black text-gray-900">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {features.map((feature, idx) => (
                <tr key={idx} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="py-5 px-8 text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {feature.name}
                  </td>
                  {plans.map((plan) => {
                    const planKey = plan.name.toLowerCase() as keyof Omit<PlanFeature, 'name'>;
                    const hasFeature = feature[planKey];
                    return (
                      <td key={plan.id} className="text-center py-5 px-8">
                        <div className="flex justify-center">
                          {hasFeature ? (
                            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center italic">
                              <XCircle className="h-4 w-4 opacity-40" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
