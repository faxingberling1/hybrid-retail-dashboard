import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LifeBuoy } from 'lucide-react';

export default function SupportRequestsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/storefront" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Store
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">My Support Requests</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You don't have any active support requests at the moment. If you need help, please visit our Help Center.
        </p>
        <Link href="/storefront/help" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          Visit Help Center
        </Link>
      </div>
    </div>
  );
}
