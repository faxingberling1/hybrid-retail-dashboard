import { Key, Copy, RefreshCw, BarChart } from 'lucide-react';
import SectionHeader from '../settings/section-header';

interface ApiAccessSectionProps {
  apiToken: string;
  onGenerateToken: () => void;
  usage: {
    requestsToday: number;
    requestsLimit: number;
    resetTime: string;
  };
  className?: string;
}

export default function ApiAccessSection({
  apiToken,
  onGenerateToken,
  usage,
  className = ''
}: ApiAccessSectionProps) {
  const usagePercentage = (usage.requestsToday / usage.requestsLimit) * 100;

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Access</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium text-gray-900">API Access Token</div>
              <div className="text-sm text-gray-600">For programmatic access to your data</div>
            </div>
            <button
              onClick={onGenerateToken}
              className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
            >
              <RefreshCw className="h-4 w-4 mr-2 inline" />
              Generate New
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="password"
              value={apiToken}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 font-mono"
            />
            <button
              onClick={() => navigator.clipboard.writeText(apiToken)}
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            This token grants full access to your account. Keep it secure.
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="font-medium text-gray-900 mb-2">API Usage</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Requests Today</span>
              <span className="font-medium">{usage.requestsToday.toLocaleString()} / {usage.requestsLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Reset: {usage.resetTime}</span>
              <span>{Math.round(usagePercentage)}% used</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-2" />
            <div className="text-sm font-medium text-blue-900">API Documentation</div>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Need help with API integration? Check out our comprehensive documentation.
          </p>
          <button className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-900">
            View Documentation →
          </button>
        </div>
      </div>
    </div>
  );
}