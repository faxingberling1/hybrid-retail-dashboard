import { LucideIcon } from 'lucide-react';
import IntegrationStatusBadge from './integration-status-badge';

export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'shipping' | 'analytics' | 'communication';
  status: 'active' | 'inactive' | 'error';
  apiKey: string;
  lastSynced: string;
  description?: string;
}

interface IntegrationCardProps {
  integration: Integration;
  icon: React.ReactNode;
  onToggle: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export default function IntegrationCard({
  integration,
  icon,
  onToggle,
  onViewDetails,
  className = ''
}: IntegrationCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-green-100 text-green-800';
      case 'analytics': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-gray-600">
              {icon}
            </div>
            <div>
              <div className="font-medium text-gray-900">{integration.name}</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(integration.type)}`}>
                  {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                </span>
                <IntegrationStatusBadge status={integration.status} />
              </div>
            </div>
          </div>
          <button
            onClick={() => onToggle(integration.id)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {integration.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {integration.description && (
          <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Last synced: {integration.lastSynced}
          </div>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(integration.id)}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}