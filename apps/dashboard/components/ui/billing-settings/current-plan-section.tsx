import { CreditCard } from 'lucide-react';
import SectionHeader from '../settings/section-header';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <SectionHeader
        title="Current Plan"
        description="Manage your subscription and billing"
        icon={<CreditCard className="h-5 w-5" />}
      />

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <div className="text-xl font-bold">{plan.plan} Plan</div>
            <div className="text-purple-200 mt-1">
              {plan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
            </div>
            <div className="flex items-center mt-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                {plan.status.replace('_', ' ').toUpperCase()}
              </div>
              <div className="ml-4 text-sm">
                Next billing: {new Date(plan.nextBillingDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={onUpgradePlan}
              className="px-6 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Monthly Price</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">₨ 49,999</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Users Included</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">50</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">Storage</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">100 GB</div>
        </div>
      </div>
    </div>
  );
}