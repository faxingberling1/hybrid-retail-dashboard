// @ts-nocheck
import { Receipt, FileBarChart, Download, Upload, HelpCircle, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'danger': return 'border-rose-100 bg-rose-50/50 hover:border-rose-200 hover:bg-rose-50 text-rose-600';
      case 'secondary': return 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 text-slate-600';
      default: return 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-200 hover:bg-indigo-50 text-indigo-600';
    }
  };

  return (
    <div className="pt-12 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Advanced Operations</h3>
          <p className="text-gray-500 text-sm">Perform administrative billing tasks and manage exports</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.onClick}
            className={`group relative flex flex-col items-start p-6 border rounded-2xl transition-all text-left hover:shadow-xl hover:shadow-gray-200/50 active:scale-[0.98] ${getVariantStyles(action.variant)}`}
          >
            <div className={`p-3 rounded-xl mb-4 transition-transform group-hover:scale-110 shadow-sm ${action.variant === 'danger' ? 'bg-rose-100 text-rose-600' :
              action.variant === 'secondary' ? 'bg-slate-100 text-slate-600' :
                'bg-indigo-100 text-indigo-600'
              }`}>
              {action.icon}
            </div>

            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-bold text-gray-900">{action.title}</span>
              <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1" />
            </div>

            <p className="text-xs font-medium text-gray-500 leading-relaxed">
              {action.description}
            </p>

            {/* Subtle background element */}
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
              <ChevronRight className="h-12 w-12" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
