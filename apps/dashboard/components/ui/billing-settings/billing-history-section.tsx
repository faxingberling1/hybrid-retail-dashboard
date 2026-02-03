// @ts-nocheck
import { Download, FileText, Receipt, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface BillingHistorySectionProps {
  invoices: Invoice[];
  onViewAll: () => void;
  onDownloadInvoice: (invoiceId: string) => void;
}

export default function BillingHistorySection({
  invoices,
  onViewAll,
  onDownloadInvoice
}: BillingHistorySectionProps) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(invoice => invoice.status === filter);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'overdue': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case 'pending': return <Clock className="h-3 w-3 mr-1" />;
      case 'overdue': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Billing History</h3>
          <p className="text-gray-500 text-sm">Access and download your complete invoice history</p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
        >
          View Full Statement
          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
        {[
          { id: 'all', label: 'All Invoices', color: 'text-indigo-600' },
          { id: 'paid', label: 'Paid', color: 'text-emerald-600' },
          { id: 'pending', label: 'Pending', color: 'text-amber-600' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === tab.id
              ? 'bg-white text-gray-900 shadow-sm scale-105'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-default"
            >
              <div className="flex items-center flex-1">
                <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-indigo-50 transition-colors">
                  <FileText className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900">{invoice.id}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1">
                    <span className="text-xs font-medium text-gray-500">{new Date(invoice.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{invoice.description}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                <div className="text-right">
                  <div className="text-lg font-black text-gray-900">{invoice.amount}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount Due</div>
                </div>

                <button
                  onClick={() => onDownloadInvoice(invoice.id)}
                  className="p-3 rounded-xl bg-gray-50 text-slate-400 hover:bg-indigo-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                  title="Download PDF Invoice"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredInvoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl"
          >
            <div className="inline-flex items-center justify-center h-20 w-20 bg-gray-100 rounded-full mb-4">
              <Receipt className="h-10 w-10 text-gray-300" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">No matching records</h4>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">We couldn't find any invoices matching your current filter selection.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
