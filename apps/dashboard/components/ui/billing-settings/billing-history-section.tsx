import { Download, FileText, Receipt } from 'lucide-react';
import { useState } from 'react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
          <p className="text-sm text-gray-600">View and download your invoices</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          View All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${
            filter === 'all'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${
            filter === 'paid'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${
            filter === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
      </div>

      <div className="space-y-3">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{invoice.id}</div>
                <div className="text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">{invoice.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{invoice.amount}</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${getStatusColor(invoice.status)}`}>
                {invoice.status.toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => onDownloadInvoice(invoice.id)}
              className="text-purple-600 hover:text-purple-800"
              title="Download Invoice"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-600">No invoices found</div>
            <div className="text-sm text-gray-500 mt-1">Try changing your filter</div>
          </div>
        )}
      </div>
    </div>
  );
}