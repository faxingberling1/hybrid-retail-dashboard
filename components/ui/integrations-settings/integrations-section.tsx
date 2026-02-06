import { useState } from 'react';
import { Server, Plus, CreditCard, Truck, BarChart3, Mail } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import IntegrationCard, { Integration } from './integration-card';
import IntegrationDetailsPanel from './integration-details-panel';
import ApiKeyField from './api-key-field';
import IntegrationActions from './integration-actions';
import AvailableIntegrationsGrid, { AvailableIntegration } from './available-integrations-grid';

interface IntegrationsSectionProps {
  integrations: Integration[];
  availableIntegrations: AvailableIntegration[];
  onToggleIntegration: (id: string) => void;
  onRegenerateKey: (id: string) => void;
  onRemoveIntegration: (id: string) => void;
  onAddIntegration: () => void;
  onConnectIntegration: (integration: AvailableIntegration) => void;
  className?: string;
}

export default function IntegrationsSection({
  integrations,
  availableIntegrations,
  onToggleIntegration,
  onRegenerateKey,
  onRemoveIntegration,
  onAddIntegration,
  onConnectIntegration,
  className = ''
}: IntegrationsSectionProps) {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const selectedIntegrationData = integrations.find(int => int.id === selectedIntegration);

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'payment': 
        return <CreditCard className="h-5 w-5" />;
      case 'shipping': 
        return <Truck className="h-5 w-5" />;
      case 'analytics': 
        return <BarChart3 className="h-5 w-5" />;
      case 'communication': 
        return <Mail className="h-5 w-5" />;
      default: 
        return <Server className="h-5 w-5" />;
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Connected Services Header */}
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Connected Services"
          description="Manage your third-party integrations"
          icon={<Server className="h-5 w-5" />}
        />
        <button
          onClick={onAddIntegration}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </button>
      </div>

      {/* Connected Integrations */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIntegrationIcon(integration.type)}
                <div>
                  <div className="font-medium text-gray-900">{integration.name}</div>
                  <div className="text-sm text-gray-600">
                    {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} Integration
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  integration.status === 'active' ? 'bg-green-100 text-green-800' :
                  integration.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {integration.status.toUpperCase()}
                </span>
                <button
                  onClick={() => onToggleIntegration(integration.id)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {integration.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={integration.apiKey}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 font-mono"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                    >
                      {showApiKey ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Synced
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                    {integration.lastSynced}
                  </div>
                </div>
              </div>

              <IntegrationActions
                onCopyKey={() => navigator.clipboard.writeText(integration.apiKey)}
                onRegenerateKey={() => onRegenerateKey(integration.id)}
                onRemove={() => onRemoveIntegration(integration.id)}
                onToggleVisibility={() => setShowApiKey(!showApiKey)}
                isVisible={showApiKey}
                showVisibilityToggle={true}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Available Integrations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h3>
        <AvailableIntegrationsGrid
          integrations={availableIntegrations}
          onConnect={onConnectIntegration}
        />
      </div>

      {/* Integration Details Modal (if selected) */}
      {selectedIntegrationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Integration Details</h3>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <IntegrationDetailsPanel
                integration={{
                  ...selectedIntegrationData,
                  createdAt: '2024-01-01',
                  updatedAt: '2024-01-15',
                  documentationUrl: 'https://docs.example.com',
                  version: 'v1.2.0'
                }}
                onRegenerateKey={() => onRegenerateKey(selectedIntegrationData.id)}
                onViewDocumentation={() => window.open('https://docs.example.com', '_blank')}
                onTestConnection={() => alert('Testing connection...')}
                onExportLogs={() => alert('Exporting logs...')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}