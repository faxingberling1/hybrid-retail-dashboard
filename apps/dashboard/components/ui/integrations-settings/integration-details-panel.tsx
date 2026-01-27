import { Calendar, RefreshCw, ExternalLink, Download } from 'lucide-react';
import ApiKeyField from './api-key-field';
import IntegrationStatusBadge from './integration-status-badge';

export interface IntegrationDetail {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  apiKey: string;
  lastSynced: string;
  webhookUrl?: string;
  documentationUrl?: string;
  version?: string;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationDetailsPanelProps {
  integration: IntegrationDetail;
  onRegenerateKey: () => void;
  onViewDocumentation?: () => void;
  onTestConnection?: () => void;
  onExportLogs?: () => void;
  className?: string;
}

export default function IntegrationDetailsPanel({
  integration,
  onRegenerateKey,
  onViewDocumentation,
  onTestConnection,
  onExportLogs,
  className = ''
}: IntegrationDetailsPanelProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
          <div className="flex items-center space-x-3 mt-1">
            <IntegrationStatusBadge status={integration.status} />
            <span className="text-sm text-gray-600">Type: {integration.type}</span>
            {integration.version && (
              <span className="text-sm text-gray-600">Version: {integration.version}</span>
            )}
          </div>
        </div>
      </div>

      {/* API Key Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">API Configuration</h4>
        <ApiKeyField
          label="API Key"
          value={integration.apiKey}
          onRegenerate={onRegenerateKey}
          showRegenerate={true}
        />
        
        {integration.webhookUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webhook URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={integration.webhookUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(integration.webhookUrl!)}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sync Information */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sync Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              Last Synced
            </div>
            <div className="font-medium">{integration.lastSynced}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              Created
            </div>
            <div className="font-medium">{integration.createdAt}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onTestConnection && (
            <button
              onClick={onTestConnection}
              className="p-3 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Test Connection</div>
            </button>
          )}
          
          {onViewDocumentation && (
            <button
              onClick={onViewDocumentation}
              className="p-3 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <ExternalLink className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Documentation</div>
            </button>
          )}
          
          {onExportLogs && (
            <button
              onClick={onExportLogs}
              className="p-3 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Download className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Export Logs</div>
            </button>
          )}
          
          <button
            onClick={() => {
              if (integration.documentationUrl) {
                window.open(integration.documentationUrl, '_blank');
              }
            }}
            className="p-3 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <svg className="h-5 w-5 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div className="text-sm font-medium">Open Console</div>
          </button>
        </div>
      </div>

      {/* Documentation Link */}
      {integration.documentationUrl && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div className="text-sm font-medium text-blue-900">Documentation Available</div>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Need help setting up {integration.name}? Check out our detailed documentation.
          </p>
          <button
            onClick={() => window.open(integration.documentationUrl, '_blank')}
            className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            View Documentation →
          </button>
        </div>
      )}
    </div>
  );
}