import { Receipt, FileBarChart, Download, Upload, HelpCircle, CreditCard } from 'lucide-react';

interface BillingAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface BillingActionsSectionProps {
  actions: BillingAction[];
}

export default function BillingActionsSection({ actions }: BillingActionsSectionProps) {
  const getVariantClass = (variant?: string) => {
    switch (variant) {
      case 'danger': return 'border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100';
      case 'secondary': return 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100';
      default: return 'border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100';
    }
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Billing Actions</h3>
          <p className="text-sm text-gray-600">Manage your billing and subscriptions</p>
        </div>
        <CreditCard className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-4 border rounded-lg text-left transition-colors ${getVariantClass(action.variant)}`}
          >
            <div className="flex items-center mb-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${
                action.variant === 'danger' ? 'bg-red-100' : 
                action.variant === 'secondary' ? 'bg-gray-100' : 
                'bg-purple-100'
              }`}>
                <div className={action.variant === 'danger' ? 'text-red-600' : 
                  action.variant === 'secondary' ? 'text-gray-600' : 
                  'text-purple-600'
                }>
                  {action.icon}
                </div>
              </div>
              <div className="font-medium text-gray-900">{action.title}</div>
            </div>
            <div className="text-sm text-gray-600">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}