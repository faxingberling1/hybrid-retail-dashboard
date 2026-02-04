import { Bug, RefreshCw, Database, Zap, Shield, Wifi } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import { useState } from 'react';

export interface DebugTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => Promise<void>;
  variant: 'primary' | 'secondary' | 'danger';
}

interface DebugToolsSectionProps {
  tools: DebugTool[];
  className?: string;
}

export default function DebugToolsSection({
  tools,
  className = ''
}: DebugToolsSectionProps) {
  const [runningTool, setRunningTool] = useState<string | null>(null);

  const handleToolClick = async (tool: DebugTool) => {
    setRunningTool(tool.id);
    try {
      await tool.onClick();
    } finally {
      setRunningTool(null);
    }
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-900 hover:from-blue-100 hover:to-blue-200';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-900 hover:from-gray-100 hover:to-gray-200';
      case 'danger':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-900 hover:from-red-100 hover:to-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-900';
    }
  };

  const getVariantIconColor = (variant: string) => {
    switch (variant) {
      case 'primary': return 'text-blue-600';
      case 'secondary': return 'text-gray-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={className}>
      <SectionHeader
        title="Debug Tools"
        description="Advanced tools for system diagnostics and troubleshooting"
        icon={<Bug className="h-5 w-5" />}
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={runningTool !== null}
              className={`p-4 border rounded-lg text-left transition-all ${getVariantStyles(tool.variant)} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start">
                <div className={`mr-3 ${getVariantIconColor(tool.variant)}`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{tool.title}</div>
                  <div className="text-sm mt-1">{tool.description}</div>
                </div>
                {runningTool === tool.id && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <div className="text-sm font-medium text-yellow-900">Warning</div>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            These tools are for advanced users only. Use with caution as some operations may affect system performance or availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">System Health</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Connection</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm font-medium">128ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium">64%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                View System Metrics
              </button>
              <button className="w-full px-3 py-2 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                Check Network Status
              </button>
              <button className="w-full px-3 py-2 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                Generate Diagnostic Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}