import { Server, CreditCard, Truck, BarChart3, Mail, Cloud } from 'lucide-react';

export interface AvailableIntegration {
  id: string;
  name: string;
  type: 'payment' | 'shipping' | 'analytics' | 'communication' | 'cloud';
  description: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

interface AvailableIntegrationsGridProps {
  integrations: AvailableIntegration[];
  onConnect: (integration: AvailableIntegration) => void;
  className?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'payment':
      return <CreditCard className="h-5 w-5" />;
    case 'shipping':
      return <Truck className="h-5 w-5" />;
    case 'analytics':
      return <BarChart3 className="h-5 w-5" />;
    case 'communication':
      return <Mail className="h-5 w-5" />;
    case 'cloud':
      return <Cloud className="h-5 w-5" />;
    default:
      return <Server className="h-5 w-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-blue-100 text-blue-800';
    case 'shipping': return 'bg-green-100 text-green-800';
    case 'analytics': return 'bg-purple-100 text-purple-800';
    case 'communication': return 'bg-orange-100 text-orange-800';
    case 'cloud': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AvailableIntegrationsGrid({
  integrations,
  onConnect,
  className = ''
}: AvailableIntegrationsGridProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors hover:shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  {getIcon(integration.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{integration.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(integration.type)}`}>
                      {integration.type}
                    </span>
                    {integration.isPopular && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                    {integration.isNew && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{integration.category}</span>
              <button
                onClick={() => onConnect(integration)}
                className="px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}