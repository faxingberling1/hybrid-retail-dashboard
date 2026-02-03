// @ts-nocheck
import { CreditCard as CardIcon, Wallet, Plus, ChevronRight, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentMethod {
  method: string;
  type: string;
  lastFour: string;
  expiryDate: string;
}

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: () => void;
}

export default function PaymentMethodSection({
  paymentMethod,
  onChangePaymentMethod
}: PaymentMethodSectionProps) {
  const getCardTheme = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa': return 'from-slate-900 to-slate-800 text-white';
      case 'mastercard': return 'from-orange-600 to-amber-500 text-white';
      case 'amex': return 'from-emerald-700 to-teal-600 text-white';
      default: return 'from-indigo-600 to-purple-700 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Payment Configuration</h3>
          <p className="text-gray-500 text-sm">Manage your funding sources and security</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modern Card Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative h-56 rounded-3xl bg-gradient-to-br shadow-2xl p-8 overflow-hidden group ${getCardTheme(paymentMethod.type)}`}
        >
          {/* Chip and Logo */}
          <div className="flex justify-between items-start mb-auto">
            <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-100/50 shadow-inner" />
            <div className="text-2xl font-black italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">
              {paymentMethod.type.toUpperCase()}
            </div>
          </div>

          {/* Card Number (Masked) */}
          <div className="mt-8 mb-4">
            <div className="flex gap-4 text-2xl font-black tracking-[0.2em] opacity-90">
              <span>••••</span>
              <span>••••</span>
              <span>••••</span>
              <span className="font-sans tracking-normal">{paymentMethod.lastFour}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Card Holder</div>
              <div className="font-bold tracking-tight uppercase">Super Admin User</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Expires</div>
              <div className="font-bold tabular-nums">{paymentMethod.expiryDate}</div>
            </div>
          </div>

          {/* Decorative Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
        </motion.div>

        {/* Payment Details & Actions */}
        <div className="flex flex-col justify-between p-8 bg-gray-50 border border-gray-100 rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Method</span>
              <button
                onClick={onChangePaymentMethod}
                className="text-indigo-600 text-xs font-black uppercase tracking-widest px-3 py-1.5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Modify Card
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{paymentMethod.method}</div>
                  <div className="text-[10px] font-bold text-gray-400">Primary Billing Source</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <Plus className="h-4 w-4" />
              Add Backup Source
            </button>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Wallet className="h-3 w-3" />
              <span className="text-[10px] font-bold tracking-widest uppercase">2-Factor Auth Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
