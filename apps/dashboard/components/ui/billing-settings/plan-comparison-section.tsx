import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Plan Comparison</h3>
          <p className="text-sm text-gray-600">Compare features across different plans</p>
        </div>
        
        {/* Billing Cycle Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border rounded-xl p-6 ${
              plan.popular
                ? 'border-purple-500 border-2'
                : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">{getPrice(plan)}</span>
                <span className="text-gray-600">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {plan.popular ? 'Get Started' : 'Learn More'}
              <ChevronRight className="inline h-4 w-4 ml-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Features</th>
              {plans.map((plan) => (
                <th key={plan.id} className="text-center py-3 px-4 font-semibold text-gray-900">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700">{feature.name}</td>
                {plans.map((plan) => {
                  const planKey = plan.name.toLowerCase() as keyof Omit<PlanFeature, 'name'>;
                  const hasFeature = feature[planKey];
                  return (
                    <td key={plan.id} className="text-center py-3 px-4">
                      {hasFeature ? (
                        <CheckCircle className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 inline" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}